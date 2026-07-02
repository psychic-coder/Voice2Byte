import uuid
import re
import os
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct, Filter, FieldCondition, MatchValue
from sentence_transformers import SentenceTransformer

# Initialize Qdrant Client from the Docker/network configuration when available.
qdrant_url = os.getenv("QDRANT_URL")
if qdrant_url:
    qdrant_client = QdrantClient(url=qdrant_url)
else:
    qdrant_client = QdrantClient(
        host=os.getenv("QDRANT_HOST", "localhost"),
        port=int(os.getenv("QDRANT_PORT", "6333")),
    )
COLLECTION_NAME = "menus"

# Initialize local embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")


def _tokenize(text):
    return {token for token in re.findall(r"[a-z0-9]+", text.lower()) if len(token) > 2}


def _has_query_overlap(query, payload):
    query_tokens = _tokenize(query)
    payload_text = " ".join(
        str(payload.get(field, "")) for field in ("name", "description", "category")
    )
    payload_tokens = _tokenize(payload_text)
    return bool(query_tokens & payload_tokens)

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

def retrieve_top_k_menu_items(query, restaurant_id, k=5, threshold=0.4):
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
            
        # Check if the top match is above our similarity threshold and has at least some lexical support.
        top_hit = points[0]
        if top_hit.score < threshold:
            return [], True

        if not _has_query_overlap(query, top_hit.payload or {}):
            return [], True
            
        items = []
        for idx, hit in enumerate(points):
            payload = hit.payload
            items.append({
                "name": f"{idx + 1}. {payload.get('name')}",
                "description": payload.get('description', ''),
                "price": payload.get('price', 0),
                "score": hit.score,
            })
            
        return items, False
    except Exception as e:
        print(f"Qdrant retrieval error: {e}")
        return [], True
