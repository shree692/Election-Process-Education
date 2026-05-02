# 🗳️ ElectEd – Election Process Education

An **interactive election education web app** with a full Node.js/Express backend. Helps citizens understand the election process, timelines, voter registration, key roles, and more.

## ✨ Features

- 🏠 **Hero** – Animated landing with particle effects & live stat counters
- 📅 **Election Timeline** – Chronological 8-stage election calendar
- 📋 **How to Participate** – Step-by-step guides for Voters, Candidates & Observers
- 👥 **Key Roles** – Who does what in an election
- 🧠 **Interactive Quiz** – 10 questions with instant feedback, explanations & leaderboard
- 🤖 **AI Assistant** – Smart chatbot answering election questions via REST API
- 🌙☀️ **Dark / Light Theme** – Persistent theme toggle

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3 (vanilla), JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| Fonts | Google Fonts (Inter, Outfit) |

## 📁 Project Structure

```
Election-Process-Education/
├── server.js              ← Express server
├── package.json
├── index.html             ← Frontend entry point
├── style.css              ← Dark/light theme styles
├── app.js                 ← Frontend JS (API-connected)
├── data/
│   └── electionData.js    ← Centralized data store
└── routes/
    ├── chat.js            ← POST /api/chat
    ├── quiz.js            ← GET/POST /api/quiz/*
    └── data.js            ← GET /api/data/*
```

## 🚀 Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/shree692/Election-Process-Education.git
cd Election-Process-Education

# 2. Install dependencies
npm install

# 3. Start the server
node server.js

# 4. Open in browser
# Visit http://localhost:5500
```

## ⚙️ Separate backend URL
The frontend already defaults to the deployed Render backend at:

```text
https://election-process-education-sy7l.onrender.com
```

If you want to override that locally, create `client/.env` with:

```env
VITE_API_BASE_URL=https://localhost:5500
```

Then rebuild the frontend so it uses the override URL.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| POST | `/api/chat` | AI assistant (send `{ message }`) |
| GET | `/api/quiz/questions` | All quiz questions |
| GET | `/api/quiz/answer/:id` | Reveal answer by question ID |
| POST | `/api/quiz/score` | Save score `{ name, score, total }` |
| GET | `/api/quiz/leaderboard` | Top 10 scores |
| GET | `/api/data/timeline` | Election timeline data |
| GET | `/api/data/steps?tab=voter` | Participation steps by role |
| GET | `/api/data/roles` | Key election roles |

## 📸 Preview

> Dark theme hero, interactive timeline, tabbed steps, quiz with leaderboard, and AI chatbot — all powered by the Express backend.

## 📄 License

MIT — free to use for civic education and awareness.
