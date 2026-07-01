import json
import tiktoken
from qdrant_service import sync_menu, retrieve_top_k_menu_items
import random

def count_tokens(text):
    # Using cl100k_base which is standard for OpenAI and close enough for Gemini approximation
    enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))

print("--- Phase 2: RAG-Based Menu Context Verification ---")

# 1. Generate Massive Synthetic Menu
restaurant_id = "test-rest-999"
menu_items = []
categories = ["Appetizers", "Mains", "Desserts", "Beverages"]

for i in range(1, 51):
    price = round(random.uniform(5.0, 25.0), 2)
    # Add some specific items we can search for
    if i == 12:
        name = "Ghost Pepper Wings"
        desc = "Extremely spicy chicken wings for those who dare."
        price = 14.99
    elif i == 25:
        name = "Budget Slider"
        desc = "The absolute cheapest burger on our menu."
        price = 2.99
    elif i == 40:
        name = "Truffle Fries"
        desc = "Crispy potato fries loaded with expensive truffle oil."
    else:
        name = f"Item Number {i}"
        desc = f"A delicious {random.choice(categories).lower()} dish made with fresh ingredients."

    menu_items.append({
        "name": f"{i}. {name}",
        "description": desc,
        "category": random.choice(categories),
        "price": price
    })

print(f"1. Generated {len(menu_items)} synthetic menu items.")

# 2. Measure tokens for full menu (Before RAG)
full_menu_json = json.dumps(menu_items)
before_tokens = count_tokens(full_menu_json)
print(f"2. Token count before RAG (Full Menu Context): ~{before_tokens} tokens")

# 3. Sync to Qdrant
print("3. Embedding and Syncing to Qdrant (this may take a moment to download the model if first run)...")
sync_count = sync_menu(restaurant_id, menu_items)
print(f"   -> Synced {sync_count} items to Qdrant successfully.")

# 4. Test Semantic Precision & After RAG Tokens
queries = [
    "I want something spicy",
    "what is the cheapest burger",
    "do you have any fancy fries"
]

for q in queries:
    print(f"\n--- Testing Query: '{q}' ---")
    top_k, is_fallback = retrieve_top_k_menu_items(q, restaurant_id, k=5)
    
    if is_fallback:
        print("   Result: Semantic Fallback Triggered (No match above threshold)")
    else:
        print("   Top 3 Matches:")
        for idx, item in enumerate(top_k[:3]):
            print(f"   {idx+1}. {item['name']} - {item['description']}")
            
        top_k_json = json.dumps(top_k)
        after_tokens = count_tokens(top_k_json)
        print(f"   Token count for this query context (After RAG): ~{after_tokens} tokens")
        print(f"   Tokens Saved: {before_tokens - after_tokens} tokens per request!")

