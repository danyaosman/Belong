# System Architecture

## Overview

Belong follows a client-server architecture consisting of three main components:

- Frontend (Web & Mobile)
- Backend API
- AI Services

The frontend communicates with the backend through REST APIs, while the backend manages business logic, database operations, and AI orchestration.

---

# High-Level Architecture

```text
                 Web (Next.js)
                       │
                       │
                 Mobile (React Native)
                       │
                       ▼
                 FastAPI Backend
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   PostgreSQL      AI Services     Qdrant
      Database      (LangGraph)   Vector DB
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
        Gemini              ElevenLabs
         (LLM)              STT / TTS
```

---

# Components

## Frontend

The frontend provides the user interface for both web and mobile platforms.

Responsibilities:

- User authentication
- Lesson interface
- Speaking interface
- Vocabulary notebook
- Dashboard
- Progress tracking

Technologies:

- Next.js
- React Native
- TypeScript

---

## Backend

The backend is responsible for all application logic.

Responsibilities:

- Authentication
- Lesson management
- User progress
- Character management
- API endpoints
- AI orchestration

Technologies:

- FastAPI
- SQLAlchemy
- PostgreSQL

---

## Database

PostgreSQL stores all persistent application data.

Examples:

- Users
- Lessons
- Vocabulary
- Characters
- Story progress
- Conversation history

---

## AI Services

The AI layer powers conversations and learner feedback.

Responsibilities:

- Speech recognition
- Character dialogue
- Lesson-aware conversations
- Speaking evaluation
- Retrieval-Augmented Generation (RAG)

Technologies:

- Gemini 2.5 Flash
- ElevenLabs
- LangGraph
- LangChain
- Qdrant

---

# Communication Flow

A typical conversation follows this sequence:

```text
User Speech
      │
      ▼
Speech-to-Text
      │
      ▼
FastAPI Backend
      │
      ▼
LangGraph Orchestrator
      │
      ▼
Gemini
      │
      ▼
Text-to-Speech
      │
      ▼
User
```

---

# Project Structure

```text
belong/

backend/
frontend-web/
frontend-mobile/
docs/
assets/
docker/
```

---

# Design Principles

The system is designed around the following principles:

- Separation of concerns
- Modular architecture
- API-first development
- Reusable AI services
- Scalable backend design