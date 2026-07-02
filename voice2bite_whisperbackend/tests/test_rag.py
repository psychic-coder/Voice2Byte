import json
import tiktoken
from qdrant_service import sync_menu, retrieve_top_k_menu_items
import random

random.seed(42)

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
    if i == 5:
        name = "Iced Cola"
        desc = "A cold soda served over ice."
        price = 2.99
    elif i == 8:
        name = "Garden Salad"
        desc = "Fresh lettuce, cucumber, tomato, and vinaigrette."
        price = 7.99
    elif i == 12:
        name = "Ghost Pepper Wings"
        desc = "Extremely spicy chicken wings for those who dare."
        price = 14.99
    elif i == 18:
        name = "Chocolate Sundae"
        desc = "A rich dessert with chocolate sauce and whipped cream."
        price = 6.49
    elif i == 25:
        name = "Budget Slider"
        desc = "The absolute cheapest burger on our menu."
        price = 2.99
    elif i == 30:
        name = "Grilled Chicken Burger"
        desc = "Chicken patty with smoky grill flavor."
        price = 13.49
    elif i == 35:
        name = "Veggie Wrap"
        desc = "Grilled vegetables wrapped in a tortilla."
        price = 9.49
    elif i == 40:
        name = "Truffle Fries"
        desc = "Crispy potato fries loaded with expensive truffle oil."
    elif i == 45:
        name = "BBQ Wings"
        desc = "Sticky wings with smoky barbecue glaze."
        price = 11.99
    elif i == 50:
        name = "Cheeseburger"
        desc = "A classic cheeseburger with lettuce, tomato, and house sauce."
        price = 10.99
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
    ("pizza", ["pizza"]),
    ("I want something spicy", ["spicy", "pepper", "wings"]),
    ("what is the cheapest burger", ["burger", "cheap", "budget"]),
    ("do you have any fancy fries", ["fries", "truffle", "potato"]),
    ("cold drink please", ["cold", "drink", "tea", "cola"]),
    ("need a chocolate dessert", ["chocolate", "dessert", "shake"]),
    ("show me grilled chicken", ["grilled", "chicken", "burger"]),
    ("healthy salad", ["salad", "healthy", "garden"]),
    ("barbecue wings", ["wings", "bbq", "barbecue"]),
    ("vegetarian wrap", ["wrap", "veggie", "vegetarian"]),
]

relevant_hits = 0
total_slots = 0

for q, relevance_terms in queries:
    print(f"\n--- Testing Query: '{q}' ---")
    top_k, is_fallback = retrieve_top_k_menu_items(q, restaurant_id, k=5)

    if is_fallback:
        print("   Result: Semantic Fallback Triggered (No match above threshold)")
        continue

    print("   Top 5 Matches:")
    for idx, item in enumerate(top_k[:5]):
        text = f"{item['name']} {item['description']}"
        is_relevant = any(term.lower() in text.lower() for term in relevance_terms)
        relevant_hits += int(is_relevant)
        total_slots += 1
        print(f"   {idx+1}. {item['name']} | score={item['score']:.4f} | relevant={is_relevant}")

    top_k_json = json.dumps(top_k)
    after_tokens = count_tokens(top_k_json)
    print(f"   Token count for this query context (After RAG): ~{after_tokens} tokens")
    print(f"   Tokens Saved: {before_tokens - after_tokens} tokens per request!")

if total_slots:
    precision = relevant_hits / total_slots
    print(f"\nPrecision@5 approximation: {relevant_hits}/{total_slots} = {precision:.2%}")

