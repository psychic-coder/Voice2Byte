# Voice2Bite 🍕🎙️

An advanced, voice-first food ordering platform designed for visually impaired users.

Voice2Bite leverages OpenAI's Whisper (Speech-to-Text), LLMs (Intent Parsing), and Vector Databases (RAG) to seamlessly transform spoken requests into actionable e-commerce transactions, all processed asynchronously for maximum resilience.

---

## ✨ Features

- **🎙️ Real-time Speech-to-Intent**: Speak your order ("I'd like to order 2 spicy pizzas from Domino's") and the AI will parse your intent, match the items against the menu using semantic search, and dynamically update your cart.
- **🛡️ High Availability API Gateway**: Built-in Fail-Open Resilience logic with Circuit Breakers to ensure the frontend never stalls if external APIs go down.
- **🚥 Atomic Rate Limiting**: Robust Lua-based Token Bucket rate limiting via Redis ensures the expensive AI endpoints cannot be spammed, completely immune to race conditions.
- **⚡ Async Order Pipeline**: Orders are processed instantaneously using a Redis-backed **BullMQ** job queue, returning a `202 Accepted` to prevent UI blocking.
- **📡 Real-Time WebSockets**: As the background worker progresses an order (`RECEIVED` → `PREPARING` → `READY`), state updates are broadcasted to the frontend via **Socket.IO**.
- **🔊 Audio Cues & TTS**: Fully integrated Text-To-Speech engine. Visually impaired users hear physical audio chimes and vocal announcements whenever an order's status changes in real-time!

---

## 🏗️ Architecture

- **Frontend**: Next.js, React, Redux Toolkit, Web Audio API, `socket.io-client`.
- **Primary Backend (API Gateway)**: Node.js, Express, PostgreSQL, Prisma, BullMQ, Socket.IO.
- **Voice AI Microservice**: Python, Flask, OpenAI Whisper (via `openai-whisper`), OpenRouter LLMs.
- **Databases**:
  - **PostgreSQL**: Relational data (Users, Restaurants, Menus, Orders).
  - **Redis**: Token Buckets (Rate Limiting) and Job Queue (BullMQ).
  - **Qdrant**: Vector Database for RAG (Retrieval-Augmented Generation) semantic searches.

---

## 🚀 Quick Start (Dockerized Full-Stack)

We have containerized the *entire* architecture into a single orchestrator. It automatically boots all databases, runs schema migrations, seeds the database with 100+ realistic fake entries, and starts all microservices.

### Prerequisites
- Docker & Docker Compose installed.

### Run the Application
```bash
# Clone the repository
git clone https://github.com/your-username/voice2bite.git
cd voice2bite

# Spin up the entire stack!
docker-compose up -d --build
```

**Services Available At:**
- **Frontend Web UI**: `http://localhost:3000`
- **Node.js API Gateway**: `http://localhost:4000`
- **Python Voice Microservice**: `http://localhost:5000`
- **PostgreSQL DB**: `localhost:5432`
- **Redis Cache**: `localhost:6379`
- **Qdrant Vector DB**: `localhost:6333`

---

## 🧪 Test Credentials (Pre-Seeded)

The database is automatically seeded with 20 fake restaurants, 100+ food items, and multiple user personas upon running `docker-compose up`.

You can log in to the Frontend (`http://localhost:3000/login`) using any of the following pre-seeded test accounts:

### 🏢 Company Admin
- **Email:** `admin@voice2bite.com`
- **Password:** `password123`
- *Role: Global platform administration.*

### 🏨 Hotel Admin (Restaurant Owner)
- **Email:** `hotel@voice2bite.com`
- **Password:** `password123`
- *Role: Manages menus and confirms incoming orders.*

### 🧑‍🤝‍🧑 Customer (End User)
- **Email:** `customer@voice2bite.com`
- **Password:** `password123`
- *Role: Can browse restaurants, use Voice Input, and track real-time orders.*

*(Note: There are 50 additional customers and 19 additional hotel admins randomly generated and seeded into the DB as well!)*
