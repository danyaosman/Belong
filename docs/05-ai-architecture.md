# AI Architecture

## Overview

Belong uses a modular AI architecture to deliver structured, voice-based language learning. Rather than relying on a single LLM prompt, the system combines deterministic application logic with AI services to provide consistent conversations while maintaining lesson objectives.

---

# AI Components

## Speech-to-Text

Converts user speech into text.

Technology:

- ElevenLabs Scribe

---

## Large Language Model

Generates character dialogue and evaluates learner responses.

Technology:

- Gemini 2.5 Flash

---

## Text-to-Speech

Converts AI responses into natural speech.

Technology:

- ElevenLabs

---

## Agent Framework

Coordinates the AI workflow and controls conversation flow.

Technology:

- LangGraph

---

## Retrieval-Augmented Generation (RAG)

Retrieves lesson content before generating responses.

Knowledge includes:

- Vocabulary
- Grammar
- Lesson objectives
- Example dialogues
- Character information

Technology:

- Qdrant

---

# Conversation Flow

Every conversation follows the same pipeline.

```text
User Speech
      │
      ▼
Speech-to-Text
      │
      ▼
LangGraph Orchestrator
      │
      ▼
Lesson Context Retrieval
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

# Orchestrator

The LangGraph orchestrator controls the conversation workflow.

Responsibilities:

- Determine the active lesson
- Retrieve lesson content
- Retrieve character information
- Maintain conversation state
- Generate structured prompts
- Save conversation history

---

# AI Agents

## Lesson Agent

Provides lesson-specific information.

Responsibilities:

- Retrieve vocabulary
- Retrieve grammar
- Retrieve lesson objectives

---

## Character Agent

Maintains each character's personality.

Responsibilities:

- Apply character personality
- Maintain conversation style
- Continue story progression

---

## Memory Agent

Maintains long-term conversation memory.

Responsibilities:

- Previous conversations
- Relationship progress
- Story state

---

## Evaluation Agent

Analyzes completed conversations.

Evaluates:

- Grammar
- Vocabulary
- Pronunciation
- Fluency
- Lesson objectives

Returns structured feedback to the learner.

---

# Design Principles

The AI system is designed to:

- Keep lessons curriculum-driven.
- Limit AI responses to the current lesson scope.
- Separate business logic from language generation.
- Produce consistent and explainable conversations.
- Minimize unnecessary LLM usage.