# Voice2Bite 🎙️🍔

**Voice2Bite** is a groundbreaking, highly accessible food ordering and delivery platform engineered from the ground up for the visually impaired. Unlike traditional apps that require complex screen-reader gymnastics, Voice2Bite provides a 100% voice-first, conversational interface that allows users to navigate, browse menus, and place orders completely hands-free.

---

## 🏗️ Architecture Stack

The project relies on a robust microservices architecture to handle real-time audio processing and dynamic web interactions:

1. **Frontend (User Interface)**
   - **Framework**: Next.js / React
   - **State Management**: Redux Toolkit
   - **Styling**: Bootstrap & Custom CSS
   - **Voice Tech**: Native Web Audio API (VAD & Earcons), `window.speechSynthesis` (TTS)
2. **Primary Backend (Business Logic)**
   - **Framework**: Node.js with Express
   - **Database**: MongoDB (Mongoose)
   - **Caching & Sessions**: Redis (Upstash)
   - **Auth**: JWT-based Authentication
3. **AI Voice Backend (STT & NLP)**
   - **Framework**: Python (Flask)
   - **Speech-to-Text (STT)**: OpenAI Whisper
   - **Intent Parsing / LLM**: OpenRouter API (powered by `google/gemini-2.5-flash`)

---

## 🌟 Comprehensive Feature Set

### 1. Customer Experience (Visually Impaired Focus)
- **Tap-Anywhere Activation**: No hunting for small microphone buttons. A simple double-click anywhere on the screen activates the microphone.
- **Voice Activity Detection (VAD)**: Users do not need to manually stop the recording. The app uses Web Audio `AnalyserNode` to detect a 2-second silence and automatically submits the voice command.
- **Proactive Route Announcements**: As the user moves between pages (e.g., from Home to Checkout), the app immediately announces their new location to prevent disorientation.
- **Short-Term Conversational Memory**: The AI backend retains a rolling history of the last 5 interactions. Users can use pronouns (e.g., *"What does Pizza Hut have?"* -> *"Add the first item to my cart"*), and the system will intelligently resolve the context.
- **Positional Menu Context**: Menu items are dynamically indexed (e.g., `1. Burger`, `2. Fries`) so users can select items by their numerical position without having to dictate complex item names.
- **Web-Native Audio Cues (Earcons)**: Distinct, lightweight audio feedback (success beeps, error thuds) generated natively via the browser's oscillators. No asset loading required.
- **Global ARIA Announcements**: A hidden `aria-live="assertive"` container ensures that users with system-level screen readers (like NVDA or VoiceOver) receive immediate feedback alongside the app's internal TTS.
- **Conversational Checkout**: Fully ARIA-labeled checkout forms ready to be filled via voice.

### 2. Hotel Admin Experience (Restaurant Owners)
- **Restaurant Management**: Dedicated dashboard for restaurant owners to update menus and view metrics.
- **Voice-Controlled Kitchen Display**: The Hotel Admin panel is fully voice-enabled. Owners can double-click and say:
  - *"Read my pending orders"*
  - *"Accept order number 45"*
  - *"Mark order 45 as delivered"*
- **Silent Background Refreshes**: Voice commands trigger automatic background API calls that refresh the order tables instantly, supplemented by a success chime.

### 3. Company Admin Experience (Super Admins)
- **Global Overseer Dashboard**: Access to top-level platform analytics.
- **Restaurant & Admin Management**: Ability to view all active restaurants globally, see registered hotel administrators, and monitor platform-wide order flow.
- **Protected Routing**: Specialized `ProtectedCompanyRoute.js` wrappers ensure strictly guarded access.

---

## 🧠 How the AI Voice Pipeline Works

1. **Recording & Context Gathering**: When the user speaks, `VoiceInput.js` records the audio. It also gathers the *context* (current page, nearby restaurants, active menu items, conversation history, and cart contents).
2. **Transcription**: The audio `.wav` file is sent to the Python Flask server, where **OpenAI Whisper** transcribes it to text.
3. **Intent Parsing**: The transcribed text + JSON context is sent to **OpenRouter (Gemini 2.5 Flash)**.
4. **Structured Decision**: The LLM responds with a strictly structured JSON decision containing the `action` (e.g., `addToCart`, `showMenu`), required parameters, and a short, conversational `reply` field.
5. **Execution & TTS**: The React frontend executes the Redux dispatch or Next.js route change, plays a success earcon, and uses `window.speechSynthesis` to speak the natural LLM reply back to the user.

---

## 🚀 Setup & Installation

To run Voice2Bite locally, you will need to boot up all three microservices.

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- MongoDB connection string
- OpenRouter API Key
- Upstash Redis credentials

### 1. The Core Backend (Node.js)
```bash
cd voice2bite_Backend
npm install
# Ensure your .env file is populated with MONGO_URI, PORT, JWT_SECRET, UPSTASH_REDIS_URL, etc.
npm run dev
```

### 2. The AI Voice Backend (Python)
```bash
cd voice2bite_whisperbackend
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
# Ensure your .env file is populated with OPENROUTER_API_KEY
python app.py
```

### 3. The Frontend (Next.js)
```bash
cd frontend
npm install
# Ensure your .env.local is populated with NEXT_PUBLIC_BACKEND_URL and NEXT_PUBLIC_WHISPER_URL
npm run dev
```

## 🗺️ Project Structure Highlights
- `frontend/src/components/VoiceInput.js`: The beating heart of the frontend. Handles VAD, AudioContext, recording, and executing AI intents.
- `voice2bite_whisperbackend/app.py`: The STT and LLM processing hub containing the massive `SYSTEM_PROMPT`.
- `frontend/pages/companyAdmin/`: The protected Next.js routes for global super-admins.
- `frontend/src/utils/AudioCues.js`: The Web Audio API oscillator logic for accessible earcons.
