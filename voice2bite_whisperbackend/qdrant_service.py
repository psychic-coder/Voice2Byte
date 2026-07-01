import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue
from sentence_transformers import SentenceTransformer

# Initialize Qdrant Client (Docker local default port 6333)
# Note: Ensure docker-compose is running
qdrant_client = QdrantClient(host="localhost", port=6333)
COLLECTION_NAME = "menus"

# Initialize local embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Create collection if it doesn't exist
try:
    if not qdrant_client.collection_exists(COLLECTION_NAME):
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE)
        )
except Exception as e:
    print(f"Warning: Could not connect to Qdrant or create collection: {e}")

def sync_menu(restaurant_id, menu_items):
    """
    Embeds menu items and upserts them to Qdrant.
    menu_items is a list of dicts: {"name": "Burger", "description": "...", "category": "..."}
    """
    points = []
    for item in menu_items:
        text_to_embed = f"{item.get('name', '')} {item.get('description', '')} {item.get('category', '')}"
        vector = embedder.encode(text_to_embed).tolist()
        
        point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{restaurant_id}-{item.get('name', '')}"))
        
        points.append(PointStruct(
            id=point_id,
            vector=vector,
            payload={
                "restaurant_id": restaurant_id,
                "name": item.get('name', ''),
                "description": item.get('description', ''),
                "category": item.get('category', ''),
                "price": item.get('price', 0)
            }
        ))
        
    if points:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=points
        )
        return len(points)
    return 0

def retrieve_top_k_menu_items(query, restaurant_id, k=5, threshold=0.25):
    """
    Embeds the user query and retrieves top K matches from Qdrant.
    Returns a tuple (items, is_hallucinated_fallback)
    """
    try:
        query_vector = embedder.encode(query).tolist()
        
        search_result = qdrant_client.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="restaurant_id",
                        match=MatchValue(value=restaurant_id)
                    )
                ]
            ),
            limit=k
        )
        
        # In newer qdrant-client versions, query_points returns a QueryResponse which has a points list
        points = getattr(search_result, 'points', search_result)
        
        if not points:
            return [], True
            
        # Check if the top match is above our similarity threshold
        if points[0].score < threshold:
            return [], True
            
        items = []
        for idx, hit in enumerate(points):
            payload = hit.payload
            items.append({
                "name": f"{idx + 1}. {payload.get('name')}",
                "description": payload.get('description', ''),
                "price": payload.get('price', 0)
            })
            
        return items, False
    except Exception as e:
        print(f"Qdrant retrieval error: {e}")
        return [], True
