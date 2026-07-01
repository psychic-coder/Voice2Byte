import os
import json
from fallback_matcher import process_intent

print("--- Testing Fail-Open Fallback Matcher ---")

context = json.dumps({
    "currentPage": "home",
    "restaurants": ["McDonalds", "Pizza Hut"],
    "menuItems": [{"name": "1. Burger", "price": 5}, {"name": "2. Fries", "price": 2}],
    "cart": [{"name": "Burger", "quantity": 1}]
})

tests = [
    "show me McDonalds",
    "add Burger",
    "add number 2",
    "checkout",
    "remove Burger",
    "accept order 45"
]

for t in tests:
    res = process_intent(t, context)
    print(f"Input: '{t}' -> Action: {res['action']}")
    print(f"Reply: {res['reply']}\n")

print("--- Testing Circuit Breaker State Transition ---")
print("--- Testing Circuit Breaker State Transition ---")
import pybreaker
import requests
from datetime import datetime

class MockDBListener(pybreaker.CircuitBreakerListener):
    def state_change(self, cb, old_state, new_state):
        print(f"BREAKER HOOK TRIGGERED: State changed from {old_state.name} to {new_state.name}")
        try:
            import psycopg2
            conn = psycopg2.connect("postgresql://postgres:rohitPen15@127.0.0.1:5432/voice2bite")
            cur = conn.cursor()
            cur.execute("""
                CREATE TABLE IF NOT EXISTS resilience_events (
                    id SERIAL PRIMARY KEY,
                    timestamp TIMESTAMP NOT NULL,
                    old_state VARCHAR(50),
                    new_state VARCHAR(50),
                    reason VARCHAR(255)
                )
            """)
            cur.execute("""
                INSERT INTO resilience_events (timestamp, old_state, new_state, reason)
                VALUES (%s, %s, %s, %s)
            """, (datetime.now(), old_state.name, new_state.name, "Circuit breaker state transition"))
            conn.commit()
            print("Successfully logged to DB!")
            cur.close()
            conn.close()
        except Exception as e:
            print(f"Failed to log state change to DB (expected if DB is down locally): {e}")

openrouter_breaker = pybreaker.CircuitBreaker(fail_max=3, reset_timeout=30, listeners=[MockDBListener()])

@openrouter_breaker
def call_openrouter():
    # Force failure
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers={"Authorization": "Bearer BAD"}, timeout=1)
    response.raise_for_status()

print(f"Initial Breaker State: {openrouter_breaker.current_state}")

try:
    for i in range(4):
        print(f"Attempt {i+1}...")
        try:
            call_openrouter()
        except Exception as e:
            print(f"Caught: {type(e).__name__}")
except Exception as e:
    pass
    
print(f"Final Breaker State: {openrouter_breaker.current_state}")

print("Verifying MongoDB (Postgres) Logs:")
try:
    import psycopg2
    conn = psycopg2.connect("postgresql://postgres:rohitPen15@127.0.0.1:5432/voice2bite")
    cur = conn.cursor()
    cur.execute("SELECT * FROM resilience_events ORDER BY id DESC LIMIT 2")
    rows = cur.fetchall()
    for r in rows:
        print(r)
    conn.close()
except Exception as e:
    print(f"DB Check Failed (Postgres might not be running locally in this test environment): {e}")

