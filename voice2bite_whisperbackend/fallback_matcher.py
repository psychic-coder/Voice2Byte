import re
import json

def process_intent(transcription, context_json):
    """
    Fallback regex-based intent matcher for when the LLM is unavailable.
    """
    try:
        if isinstance(context_json, str):
            context = json.loads(context_json)
        else:
            context = context_json
    except Exception:
        context = {}
        
    trans = transcription.lower()
    
    # 1. Browse / Show Menu
    if "show" in trans or "menu" in trans:
        for rest in context.get('restaurants', []):
            if rest.lower() in trans:
                return {
                    "action": "showMenu", 
                    "restaurant": rest,
                    "reply": f"I'm having trouble understanding complex requests right now, but I can show you the menu for {rest}."
                }
                
    # 2. Add to Cart
    if "add" in trans:
        items = context.get('menuItems', [])
        for item in items:
            name_without_index = re.sub(r'^\d+\.\s*', '', item['name']).lower()
            if name_without_index in trans:
                return {
                    "action": "addToCart",
                    "items": [{"name": name_without_index, "quantity": 1}],
                    "reply": f"I'm running in a degraded state, but I've added {name_without_index} to your cart."
                }
        
        # Check for numbers like "add 1"
        match = re.search(r'add\s+(number\s+)?(\d+|one|two|three)', trans)
        if match:
            num = match.group(2)
            # basic mapping
            if num == "one": num = "1"
            elif num == "two": num = "2"
            elif num == "three": num = "3"
            
            for item in items:
                if item['name'].startswith(f"{num}."):
                    name_without_index = re.sub(r'^\d+\.\s*', '', item['name'])
                    return {
                        "action": "addToCart",
                        "items": [{"name": name_without_index, "quantity": 1}],
                        "reply": f"I'm running in a degraded state, but I've added {name_without_index} to your cart."
                    }
                    
        return {
            "action": "unknown",
            "reply": "I'm having trouble connecting to my brain. Please try manually selecting the item."
        }
        
    # 3. Checkout
    if "checkout" in trans or "place order" in trans or "pay" in trans:
        return {
            "action": "checkout",
            "reply": "I'm having trouble processing requests, but I'm taking you to checkout."
        }
        
    # 4. Remove from Cart
    if "remove" in trans:
        for item in context.get('cart', []):
            if item['name'].lower() in trans:
                return {
                    "action": "removeFromCart",
                    "item": item['name'],
                    "reply": f"I'm running in degraded mode, but I've removed {item['name']} from your cart."
                }
                
    # 5. Read Orders (Hotel Admin)
    if "read" in trans and "order" in trans:
        return {
            "action": "readOrders",
            "reply": "I'm experiencing connectivity issues, but you can read your orders on the dashboard."
        }
        
    # 6. Accept / Deliver (Hotel Admin)
    if "accept" in trans or "deliver" in trans or "reject" in trans:
        status = "CONFIRMED"
        if "deliver" in trans: status = "DELIVERED"
        if "reject" in trans: status = "REJECTED"
        
        match = re.search(r'order (?:number )?(\d+)', trans)
        if match:
            return {
                "action": "updateOrderStatus",
                "orderId": match.group(1),
                "status": status,
                "reply": f"I'm having trouble connecting, but I'm trying to update order {match.group(1)}."
            }
            
    # Default fallback
    return {
        "action": "unknown",
        "reply": "I'm currently experiencing connectivity issues and cannot process this complex command. I can still help you with simple commands like 'checkout' or 'add an item'."
    }
