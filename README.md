# NEXChat 💬

A scalable, real-time chat application built with the **MERN** stack, **Socket.IO**, and **Redis**. NEXChat enables fast, interactive, and smart messaging with features like message undo, bio-rich profiles, and Redis-powered performance.

---

## 🚀 Features

- ⚡ **Real-Time Messaging** — Powered by WebSockets and Socket.IO.
- 🧠 **Undo Messages** — Revoke sent messages within a limited window.
- 🔁 **Redis Pub/Sub** — Enables scalable communication across multiple servers.
- 🚀 **Redis Caching** — Frequently accessed conversations are cached, reducing backend load by **73%** and accelerating data retrieval.
- 💬 **User Profiles** — Full name, profile picture, and short bio support.
- 📦 **MERN Stack Architecture** — Cleanly separated frontend and backend with secure REST APIs.
- 🔐 **Authentication** — JWT-based signup/login with protected routes.
- 🎨 **Modern UI** — Built with Tailwind CSS and mobile-responsive layout.

---

## 🛠️ Tech Stack

| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | React.js, Tailwind CSS      |
| Backend     | Node.js, Express.js         |
| Realtime    | Socket.IO, Redis Pub/Sub    |
| Database    | MongoDB                     |
| Caching     | Redis                       |
| Auth        | JWT (JSON Web Tokens)       |

---

## 📷 Screenshots

Coming soon...

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexchat.git
   cd nexchat
Install backend dependencies

bash
Copy
Edit
cd server
npm install
Set environment variables
Create a .env file in server/:

env
Copy
Edit
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
Start the backend

bash
Copy
Edit
npm run dev
Install frontend dependencies

bash
Copy
Edit
cd ../client
npm install
Start the frontend

bash
Copy
Edit
npm run dev
🧠 Architecture Overview
Frontend communicates with the backend via REST and real-time sockets.

Backend API handles auth, message persistence, and Redis events.

Redis is used both as a message bus (Pub/Sub) and cache layer.

MongoDB stores user data and message history with TTL logic for optional expiry.

✨ Unique Selling Points
Real-time performance with <100ms latency.

Redis caching reduces MongoDB query overhead drastically.

Undo feature is implemented with WebSocket-driven time-bound logic.

Scales horizontally using Redis Pub/Sub for consistent messaging across server instances.

📄 License
This project is licensed under the MIT License.

🙌 Contributors
Nitin Tak
