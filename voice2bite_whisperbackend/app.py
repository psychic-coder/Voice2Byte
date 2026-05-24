from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import json 
import requests
from difflib import SequenceMatcher  # Add for fuzzy matching

app = Flask(__name__)
CORS(app)

model = whisper.load_model("base")
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

OLLAMA_MODEL = "llama3.2:1b" 
OLLAMA_URL = "http://localhost:11434/api/chat" 

ACTIONS = {
    "sayPage": ["page"],
    "goTo": ["page"],
    "readRestaurants": ["restaurants"],
    "showMenu": ["restaurant", "menuItems"],
    "addToCart": ["items"],
    "readCart": ["cart", "totalPrice"],
    "removeFromCart": ["item"],
    "checkout": ["cart", "totalPrice"],
    "greet": [],
    "goodbye": [],
    "help": [],
    "unknown": []
}

SYSTEM_PROMPT = """
You are an AI assistant that powers a voice-interactive food delivery web app.
You make decisions for the frontend UI based on the user's voice commands and the current page context.

---
### 🏠 Current Context
You always know what page the user is currently on: {currentPage}
Possible pages: ["home", "restaurants", "restaurantDetails", "cart", "checkout"]

You also know the following data dynamically provided by the frontend:
- restaurants[]: a list of available restaurant names
- menuItems[]: list of items available in the current restaurant (only if on restaurantDetails page)
- cart[]: list of items user has added (with name, price, and quantity)
- userLocation: current city or area name
- totalPrice: total cart value in currency

---
### 🧩 Your Job
Your job is to:
1. Understand what the user wants (intent detection)
2. Decide what UI action should be performed
3. Respond in a structured JSON format that the frontend can directly interpret
4. Always include a short natural reply (for text-to-speech)

---
### 🍕 Menu Display Flow
When user asks for a restaurant menu:
1. Use "showMenu" action with the exact restaurant name from available restaurants
2. Include "restaurant" field with the restaurant name
3. The frontend will navigate to that restaurant's page and read the menu

Example menu commands:
- "show me McDonald's menu" → {"action": "showMenu", "restaurant": "McDonald's", "reply": "Showing McDonald's menu"}
- "what does Pizza Hut have?" → {"action": "showMenu", "restaurant": "Pizza Hut", "reply": "Opening Pizza Hut menu"}
- "tell me the menu of KFC" → {"action": "showMenu", "restaurant": "KFC", "reply": "Here's KFC menu"}
- "show Burger King items" → {"action": "showMenu", "restaurant": "Burger King", "reply": "Displaying Burger King items"}

---
### 💡 Possible Actions (Numbered)
| No. | Action | When to Use | Required Fields |
|-----|--------|------------|----------------|
| 1 | "sayPage" | User asks "where am I" | "page" |
| 2 | "goTo" | User wants to go to a different page | "page" |
| 3 | "readRestaurants" | User asks "show nearby restaurants" | "restaurants" |
| 4 | "showMenu" | User asks for menu of a specific restaurant | "restaurant" |
| 5 | "addToCart" | User says "add 2 pizzas" | "items" (list of {{"name": "pizza", "quantity": 2}}) |
| 6 | "readCart" | User says "what's in my cart" | "cart", "totalPrice" |
| 7 | "removeFromCart" | User says "remove burger" | "item" |
| 8 | "checkout" | User says "place my order" | "cart", "totalPrice" |
| 9 | "greet" | User greets ("hi", "hello") | none |
| 10 | "goodbye" | User says bye | none |
| 11 | "help" | User asks "what can you do" | none |
| 12 | "unknown" | User input cannot be understood | none |

IMPORTANT: Respond with ONLY valid JSON, no markdown:
{{"action": "showMenu", "restaurant": "McDonald's", "reply": "Showing McDonald's menu"}}
"""

# Helper function for fuzzy matching
def find_best_restaurant_match(user_input, available_restaurants):
    """Find the best matching restaurant name using fuzzy matching"""
    if not available_restaurants:
        return None
    
    user_input_lower = user_input.lower()
    best_match = None
    best_ratio = 0
    
    for restaurant in available_restaurants:
        ratio = SequenceMatcher(None, user_input_lower, restaurant.lower()).ratio()
        if ratio > best_ratio and ratio > 0.6:  # Threshold for decent match
            best_ratio = ratio
            best_match = restaurant
    
    return best_match

@app.route("/analyze", methods=["POST"])
def analyze_audio():
    file_path = None
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        audio = request.files["file"]
        if not audio.filename:
            return jsonify({"error": "No file selected"}), 400
            
        import time
        safe_filename = f"audio_{int(time.time())}_{audio.filename}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        audio.save(file_path)

        result = model.transcribe(file_path)
        user_text = result["text"].strip()
        print(f"Transcribed: {user_text}")

        try:
            context_str = request.form.get("context", "{}")
            context = json.loads(context_str) if context_str else {}
        except (json.JSONDecodeError, AttributeError) as e:
            print(f"Context parsing error: {e}")
            context = {}

        default_context = {
            "currentPage": "home",
            "restaurants": [],
            "menuItems": [],
            "cart": [],
            "userLocation": "Unknown",
            "totalPrice": 0,
            "restaurantName": "",
            "restaurantId": ""
        }
        default_context.update(context)
        context = default_context

        try:
            formatted_prompt = SYSTEM_PROMPT.format(**context)
        except KeyError as e:
            print(f"Prompt formatting error: {e}")
            formatted_prompt = SYSTEM_PROMPT.replace("{currentPage}", str(context.get("currentPage", "home")))

        # Enhanced intent hints with menu-specific detection
        intent_hints = ""
        user_text_lower = user_text.lower()
        
        # Page location queries
        if any(phrase in user_text_lower for phrase in ['where am i', 'what page', 'current page', 'which page', 'tell me the page']):
            intent_hints = "\n\nNOTE: User is asking about their current location/page. Use 'sayPage' action to tell them they are on the '{currentPage}' page.".format(**context)
        
        # Restaurant listing queries
        elif any(phrase in user_text_lower for phrase in ['show restaurants', 'list restaurants', 'available restaurants', 'nearby restaurants', 'what restaurants']):
            intent_hints = "\n\nNOTE: User wants to see restaurant listings. Use 'readRestaurants' action."
        
        # Menu queries - enhanced detection
        elif any(phrase in user_text_lower for phrase in ['menu', 'show menu', 'what do you have', 'what food', 'items', 'dishes']):
            available_restaurants = context.get('restaurants', [])
            if available_restaurants:
                # Try to extract restaurant name from query
                restaurant_candidates = []
                for restaurant in available_restaurants:
                    if restaurant.lower() in user_text_lower:
                        restaurant_candidates.append(restaurant)
                
                if restaurant_candidates:
                    # Use the first matching restaurant
                    best_restaurant = restaurant_candidates[0]
                    intent_hints = f"\n\nNOTE: User is asking for a menu. Use 'showMenu' action with restaurant: '{best_restaurant}'"
                else:
                    # Use fuzzy matching to find best restaurant match
                    best_match = find_best_restaurant_match(user_text, available_restaurants)
                    if best_match:
                        intent_hints = f"\n\nNOTE: User is asking for a menu. Use 'showMenu' action with restaurant: '{best_match}'"
                    else:
                        intent_hints = f"\n\nNOTE: User is asking for a menu but no specific restaurant matched. Available restaurants: {', '.join(available_restaurants)}. You may need to ask for clarification or use 'readRestaurants' first."
            else:
                intent_hints = "\n\nNOTE: User is asking for a menu but no restaurants are available in context."
        
        # Cart queries
        elif any(phrase in user_text_lower for phrase in ['cart', 'my order', 'what i ordered', 'my items']):
            intent_hints = "\n\nNOTE: User is asking about their cart. Use 'readCart' action."
        
        # Checkout queries
        elif any(phrase in user_text_lower for phrase in ['checkout', 'place order', 'confirm order', 'proceed to payment']):
            intent_hints = "\n\nNOTE: User wants to checkout. Use 'checkout' action."

        user_message = f"User said: '{user_text}'. Current page: {context.get('currentPage', 'unknown')}. Based on the context, decide the next action.{intent_hints}"

        payload = {
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": formatted_prompt},
                {"role": "user", "content": user_message}
            ],
            "stream": False
        }

        try:
            response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        except requests.exceptions.ConnectionError:
            return jsonify({
                "transcription": user_text,
                "decision": {"action": "unknown", "reply": f"I heard: '{user_text}'. Ollama is not available."}
            })
        except requests.exceptions.Timeout:
            return jsonify({
                "transcription": user_text,
                "decision": {"action": "unknown", "reply": f"I heard: '{user_text}'. Request timed out."}
            })
            
        if response.status_code != 200:
            return jsonify({
                "transcription": user_text,
                "decision": {"action": "unknown", "reply": f"I heard: '{user_text}'. AI processing unavailable."}
            })

        try:
            ollama_output = response.json()
            content = ollama_output.get("message", {}).get("content", "").strip()
            print(f"Raw Ollama response content: {content}")
        except (json.JSONDecodeError, AttributeError) as e:
            print(f"Ollama response parsing error: {e}")
            content = ""

        def extract_and_parse_json(raw_content):
            if not raw_content:
                return {}
                
            content = raw_content.strip()
            
            # Remove code blocks
            if content.startswith('```') and content.endswith('```'):
                lines = content.split('\n')
                if len(lines) > 2:
                    content = '\n'.join(lines[1:-1])
            elif '```json' in content or '```' in content:
                start = content.find('{')
                end = content.rfind('}') + 1
                if start != -1 and end > start:
                    content = content[start:end]
            
            # Try direct JSON parse
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                pass
            
            # Try unescaping if it's a stringified JSON
            try:
                if content.startswith('"') and content.endswith('"'):
                    unescaped = json.loads(content) 
                    return json.loads(unescaped) 
            except (json.JSONDecodeError, TypeError):
                pass
            
            # Try regex extraction
            import re
            json_match = re.search(r'\{[^{}]*"action"[^{}]*\}', content)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass
            
            return {"action": "unknown", "reply": "I couldn't process that request."}
        
        try:
            print(f"Cleaned content for JSON parsing: {content[:200]}")
            decision = extract_and_parse_json(content)
            print(f"Parsed decision: {decision}")
        except Exception as e:
            print(f"Decision parsing error: {e}, content: {content[:200]}")
            decision = {"action": "unknown", "reply": "Sorry, I couldn't understand that."}

        # Post-process decision for menu actions
        action = decision.get("action", "unknown")
        
        # Enhance showMenu action with better restaurant matching
        if action == "showMenu":
            restaurant_name = decision.get("restaurant", "").strip()
            available_restaurants = context.get('restaurants', [])
            
            if restaurant_name and available_restaurants:
                # Validate and correct restaurant name
                if restaurant_name not in available_restaurants:
                    # Try fuzzy matching
                    best_match = find_best_restaurant_match(restaurant_name, available_restaurants)
                    if best_match:
                        decision["restaurant"] = best_match
                        print(f"Corrected restaurant name from '{restaurant_name}' to '{best_match}'")
        
        if action not in ACTIONS:
            action = "unknown"

        validated_decision = {"action": action, "reply": decision.get("reply", "Processing your request...")}

        # Enhanced field validation
        for field in ACTIONS[action]:
            try:
                if field == "items":
                    items = decision.get(field, [])
                    if not isinstance(items, list):
                        items = []
                    validated_decision[field] = [
                        {
                            "name": str(i.get("name", "unknown")) if isinstance(i, dict) else "unknown", 
                            "quantity": int(i.get("quantity", 1)) if isinstance(i, dict) and isinstance(i.get("quantity"), (int, str)) else 1
                        }
                        for i in items if isinstance(i, dict)
                    ]
                elif field == "cart":
                    cart = decision.get(field, context.get("cart", []))
                    if not isinstance(cart, list):
                        cart = []
                    validated_decision[field] = [
                        {
                            "name": str(i.get("name", "unknown")) if isinstance(i, dict) else "unknown",
                            "quantity": int(i.get("quantity", 1)) if isinstance(i, dict) and isinstance(i.get("quantity"), (int, str)) else 1,
                            "price": float(i.get("price", 0)) if isinstance(i, dict) and isinstance(i.get("price"), (int, float, str)) else 0,
                        }
                        for i in cart if isinstance(i, dict)
                    ]
                elif field == "menuItems":
                    menu = decision.get(field, context.get("menuItems", []))
                    validated_decision[field] = menu if isinstance(menu, list) else []
                elif field == "restaurants":
                    restaurants = decision.get(field, context.get("restaurants", []))
                    validated_decision[field] = restaurants if isinstance(restaurants, list) else []
                elif field == "totalPrice":
                    price = decision.get(field, context.get("totalPrice", 0))
                    validated_decision[field] = float(price) if isinstance(price, (int, float, str)) else 0
                elif field == "page":
                    validated_decision[field] = str(decision.get(field, context.get("currentPage", "home")))
                elif field == "restaurant":
                    # Ensure restaurant name is properly formatted
                    restaurant_name = str(decision.get(field, "unknown")).strip()
                    validated_decision[field] = restaurant_name
                elif field == "item":
                    validated_decision[field] = str(decision.get(field, "unknown"))
                else:
                    validated_decision[field] = decision.get(field, "")
            except (ValueError, TypeError, AttributeError) as e:
                print(f"Field validation error for {field}: {e}")
                if field in ["items", "cart", "menuItems", "restaurants"]:
                    validated_decision[field] = []
                elif field == "totalPrice":
                    validated_decision[field] = 0
                else:
                    validated_decision[field] = ""

        return jsonify({
            "transcription": user_text,
            "decision": validated_decision
        })

    except Exception as e:
        print(f"Unexpected error in /analyze: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": f"Internal server error: {type(e).__name__}",
            "message": str(e)[:200]  
        }), 500
    finally:
        if file_path and os.path.exists(file_path):
            try:
                os.unlink(file_path)
            except Exception as e:
                print(f"Error cleaning up file {file_path}: {e}")
    
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "whisper_loaded": model is not None})

@app.route('/transcribe', methods=['POST'])
def simple_transcribe():
    """Simple transcription endpoint without Ollama dependency"""
    file_path = None
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        audio = request.files["file"]
        if not audio.filename:
            return jsonify({"error": "No file selected"}), 400
            
        import time
        safe_filename = f"audio_{int(time.time())}_{audio.filename}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        audio.save(file_path)

        result = model.transcribe(file_path)
        user_text = result["text"].strip()
        
        return jsonify({
            "transcription": user_text,
            "language": result.get("language", "unknown")
        })
        
    except Exception as e:
        print(f"Error in /transcribe: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if file_path and os.path.exists(file_path):
            try:
                os.unlink(file_path)
            except Exception as e:
                print(f"Error cleaning up file {file_path}: {e}")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)