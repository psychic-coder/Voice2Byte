import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

payload = {
    "model": "google/gemini-2.5-flash",
    "messages": [
        {"role": "user", "content": "Hello, are you receiving this?"}
    ]
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
}

print(f"Testing OpenRouter API with Key: {API_KEY[:10]}...")
try:
    response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=10)
    if response.status_code == 200:
        data = response.json()
        print("SUCCESS! OpenRouter replied:")
        print(data["choices"][0]["message"]["content"])
    else:
        print(f"FAILURE. Status code: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Exception: {e}")
