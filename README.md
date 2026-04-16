# TwinMind Live Suggestions — AI Meeting Copilot

TwinMind Live is a real-time AI-powered meeting copilot that transcribes live audio and provides intelligent, context-aware suggestions every 30 seconds.

## 🚀 Features

- **Real-time Transcription**: Uses Groq Whisper Large V3 for low-latency speech-to-text.
- **Intelligent Suggestions**: Generates 3 diverse suggestions (questions, talking points, action items) every 30 seconds using Llama 3.3 70B.
- **Contextual Chat**: Interactive chat panel for deep-dives into suggestions or custom questions, with full transcript context.
- **Session Export**: Export your entire transcript, suggestion history, and chat logs to a JSON file.
- **Customizable**: Editable prompts and refresh intervals via the settings panel.
- **Premium UI**: Glassmorphic, dark-themed responsive design with smooth animations.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Multer, Groq SDK.
- **AI**: Groq API (Whisper-large-v3, Llama-3.3-70b-versatile).

## 📦 Getting Started

### 1. Backend Setup
```bash
cd server
npm install
# Ensure you have Nodemon for development
npm install -g nodemon
# Start the server
npm start # or nodemon index.js
```

### 2. Frontend Setup
```bash
cd client
npm install
# Start the development server
npm run dev
```

### 3. Configuration
- Open the app (usually `http://localhost:5173`).
- Click the **Settings** icon.
- Enter your **Groq API Key**.
- (Optional) Customize the AI prompts.

## 🧠 Prompt Strategy

- **Suggestions**: Analyzes the last ~2 minutes of the meeting to provide 1 question, 1 insight, and 1 action point.
- **Chat**: Combines the full meeting transcript with recent chat history to provide highly contextual responses.

## 🛡️ Privacy
The Groq API key is stored in your browser's `localStorage` and is only sent to the backend for inference. No data is persisted in a database.
