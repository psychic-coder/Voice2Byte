# Voice2Bite

A voice-powered food delivery application with three main components: a Next.js frontend, a Node.js API backend, and a Python (Whisper AI) service for intent parsing and speech-to-text.

## Prerequisites

- Docker and Docker Compose
- (Optional) Ollama running locally if using AI features

## Running with Docker (Recommended)

1. **Start Ollama** (if you have it installed locally, on Mac/Windows it runs on port 11434):
   ```bash
   ollama run llama3.2  # or whichever model you prefer
   ```

2. **Start the stack**:
   ```bash
   docker compose up --build
   ```

This will spin up:
- **db**: PostgreSQL database (port 5432)
- **backend**: Node.js API (port 4000)
- **whisper**: Python/Flask Whisper service (port 5000)
- **frontend**: Next.js App (port 3000)

Access the web app at `http://localhost:3000`.

## Features
- Voice ordering ("Add a burger to my cart", "Checkout", etc.)
- Multi-restaurant support
- Customer and Hotel Admin dashboards
- Local PostgreSQL + Redis (Upstash)

## Environment Variables
The `.env` files are already pre-configured for local Docker development.
- `voice2bite_Backend/.env`
- `frontend/.env.local`
- `voice2bite_whisperbackend/.env`
