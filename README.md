# Real-Time Messaging Web Application

A full-stack messaging application built to explore authentication, persistent conversations, REST APIs, and real-time communication using Socket.IO.

## Overview

ChatSpace allows users to create accounts, log in securely, search for other users, start conversations, and exchange messages in real time. Messages are stored in MongoDB, so conversation history remains available when users return.

This project was built as a hands-on learning experience to understand how frontend, backend, database, and real-time technologies work together in a complete web application.

## Features

- **User Authentication:** Register and log in using email and password.
- **Secure Password Storage:** Passwords are hashed using bcrypt.
- **JWT Authentication:** Protected API routes and authenticated socket connections.
- **User Search:** Search for registered users by username or email.
- **Conversations:** Create or reopen conversations with other users.
- **Real-Time Messaging:** Send and receive messages instantly using Socket.IO.
- **Message Persistence:** Store messages and conversation details in MongoDB Atlas.
- **Responsive UI:** Clean, black-and-gray interface for the login, registration, and chat pages.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Real-Time Communication | Socket.IO |
| Authentication | JSON Web Tokens (JWT), bcrypt |
| HTTP Requests | Axios |
| Development Tools | Git, GitHub, npm |

## Application Architecture

```text
React Frontend
      |
      | REST API requests (Axios)
      v
Node.js + Express Backend
      |
      | Mongoose
      v
MongoDB Atlas

React Frontend <---- Socket.IO ----> Backend
                     Real-time events
```

REST APIs handle authentication, user search, conversations, and message persistence. Socket.IO delivers new messages to users connected to the relevant conversation.

## Project Structure

```text
Real-time-messaging-web-application/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── conversationController.js
│   │   │   ├── messageController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── Conversation.js
│   │   │   ├── Message.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── conversationRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChatWindow.jsx
    │   │   └── Sidebar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB Atlas account or accessible MongoDB deployment
- Git

### 1. Clone the repository

```bash
git clone https://github.com/karuna-ss/Real-time-messaging-web-application.git
cd Real-time-messaging-web-application
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d
```

Replace the MongoDB URI and JWT secret with your own values. Never commit `.env` to GitHub.

### 3. Start the backend

From the `backend/` directory, run:

```bash
npm run dev
```

The backend should start at `http://localhost:5000` once the database connection succeeds.

### 4. Configure the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Ensure the frontend API service points to `http://localhost:5000/api`. If Vite selects a different port, update `CLIENT_URL` in the backend `.env` to match the frontend origin, then restart the backend.

## How to Use

1. Create an account using the registration page.
2. Log in with your credentials.
3. Search for another registered user by username or email.
4. Select the user to open a conversation.
5. Send messages and see them delivered in real time.
6. Reopen the conversation to access saved message history.

For testing, use two separate browser sessions with two different accounts.

## Security Considerations

- Passwords are hashed before storage.
- JWTs protect authenticated API endpoints and Socket.IO connections.
- Conversation membership is checked before users can access messages or join conversation rooms.
- Environment variables are used for database credentials and authentication secrets.
- `.env` files must remain excluded from version control.

## Future Improvements

- Online and offline presence with last-seen timestamps.
- Typing indicators.
- Message read receipts and delivery status.
- Profile pictures and media sharing.
- Unread-message counts and notifications.
- Message editing and deletion.
- Deployment for public access.

## What I Learned

Building ChatSpace helped me understand how React communicates with an Express backend, how MongoDB stores users and conversations, how JWT authentication protects resources, and how Socket.IO enables real-time communication alongside REST APIs.

## Author

**Karuna S S**

[GitHub Repository](https://github.com/karuna-ss/Real-time-messaging-web-application)

---

*Built as a full-stack learning project.*

### Note on AWS S3

An earlier version of ChatSpace included **AWS S3 for media storage**. However, after my AWS Free Tier period ended, I removed the S3 integration to avoid incurring additional costs. The current version focuses on text-based real-time messaging, authentication, conversation management, and persistent message storage using MongoDB Atlas.
