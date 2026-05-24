# 🎤 Voice Command Backend - Whisper + Ollama

A powerful Flask backend that provides voice command processing for food delivery applications. Leverages OpenAI's Whisper for speech recognition and Ollama's LLM for natural language understanding.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.3+-green.svg)
![Whisper](https://img.shields.io/badge/OpenAI-Whisper-orange.svg)
![Ollama](https://img.shields.io/badge/Ollama-LLM-purple.svg)

## ✨ Features

- **🎙️ Real-time Speech Recognition** - Convert audio to text using OpenAI's Whisper
- **🤖 Intelligent Intent Detection** - Understand user commands with Ollama LLM
- **🍕 Food Delivery Context** - Specialized for restaurant and menu interactions
- **🔧 Easy Integration** - Simple REST API for frontend applications
- **⚡ Fast Processing** - Optimized audio processing and response times
- **🎯 Smart Restaurant Matching** - Fuzzy matching for restaurant name recognition

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- [Ollama](https://ollama.ai/) installed and running
- `llama3.2:1b` model pulled in Ollama

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/voice-command-backend.git
cd voice-command-backend