# API Specification

## Overview

Belong exposes a REST API consumed by both the web and mobile applications.

Base URL

```
/api/v1
```

Authentication is performed using JWT Bearer Tokens.

---

# Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and receive JWT |
| POST | /auth/logout | Logout current user |
| GET | /auth/me | Get authenticated user |

---

# Home

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /home | Returns the homepage data |

Returns:

- Current lesson
- Learning path
- Current module
- Daily goal
- Recent activity
- Active character

---

# Profile

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /profile | Get user profile |
| PUT | /profile | Update profile |

Returns:

- User information
- XP
- Level
- Learning streak
- Speaking statistics
- Character relationships
- Achievements

---

# Modules

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /modules | Get all learning modules |
| GET | /modules/{id} | Get module details |

---

# Lessons

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /lessons/{id} | Get lesson details |
| POST | /lessons/{id}/start | Start lesson |
| POST | /lessons/{id}/complete | Complete lesson |

Each lesson returns:

- Vocabulary
- Grammar
- Exercises
- Speaking activity
- Assigned character

---

# Vocabulary

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /vocabulary | Get vocabulary notebook |
| GET | /vocabulary/{id} | Get vocabulary details |
| GET | /vocabulary/search | Search vocabulary |
| GET | /vocabulary/topic/{topic} | Filter vocabulary by topic |

---

# Grammar

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /grammar/{id} | Get grammar explanation |

---

# Exercises

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /lessons/{id}/exercises | Get lesson exercises |
| POST | /exercises/{id}/submit | Submit exercise |

---

# Speaking

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /speaking/start | Start speaking session |
| POST | /speaking/end | End speaking session |
| GET | /speaking/history | Get previous conversations |

---

# WebSocket

```
/ws/speaking/{session_id}
```

Used for:

- Real-time speech streaming
- AI responses
- Live transcripts

---

# Speaking Evaluation

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /evaluations/{conversation_id} | Get conversation feedback |
| GET | /evaluations/history | Get previous evaluations |

Returns:

- Grammar score
- Vocabulary score
- Pronunciation score
- Fluency score
- Personalized feedback

---

# Character Calls

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /calls | Get call history |
| POST | /calls/{id}/accept | Accept incoming call |
| POST | /calls/{id}/decline | Decline incoming call |

---

# Notifications

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /notifications | Get notifications |
| PUT | /notifications/{id}/read | Mark notification as read |

---

# Media

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /audio/vocabulary/{id} | Get pronunciation audio |
| GET | /characters/{id}/avatar | Get character avatar |

---

# Response Format

Successful response

```json
{
    "success": true,
    "data": {}
}
```

Error response

```json
{
    "success": false,
    "message": "Description of the error."
}
```

---

# Authentication

Protected endpoints require:

```
Authorization: Bearer <token>
```