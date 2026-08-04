# Product Vision

# Belong

## Overview

Many people feel out of place when using a new language. Belong aims to help in learning Turkish through experiencing realistic scenarios you might face, but you practice them by conversing with AI characters!

Belong places conversation at the center of the learning experience. Users follow a structured curriculum from beginner to advanced levels, where each lesson introduces new vocabulary and grammar. The application combines a fixed educational curriculum with AI-driven dialogue, allowing learners to practice speaking naturally while maintaining consistent learning objectives.

---

# Problem Statement

Many language learning applications provide limited opportunities for realistic speaking practice. While users may learn vocabulary and grammar, they often lack confidence when communicating in real conversations.

On the other hand, AI chat applications allow free conversation but usually lack educational structure, introduce vocabulary that exceeds the learner's level, and do not provide a clear progression path.

Belong aims to bridge this gap by combining a structured curriculum with intelligent conversational AI.

---

# Vision

To create an engaging language learning experience where users improve their speaking ability by engaging with a set of characters in an evolving storyline.

The goal is to make language practice feel like participating in everyday life rather than studying a textbook.

---

# Goals

The primary goals of Belong are:

- Develop speaking confidence through realistic voice conversations.
- Teach vocabulary and grammar within meaningful contexts.
- Provide a structured learning path from beginner to advanced proficiency.
- Encourage long-term engagement through recurring AI characters and an evolving storyline.
- Demonstrate modern AI engineering concepts including agent orchestration, Retrieval-Augmented Generation (RAG), long-term memory, and speech technologies.

---

# Target Audience

Belong is designed for English-speaking and Arabic-speaking learners who want to learn Turkish for everyday life.

Primary users include:

- International university students
- Professionals working in Türkiye
- Tourists planning extended stays
- Immigrants and expats
- Self-learners interested in Turkish

---

# Core Learning Philosophy

Each lesson consists of:

1. Vocabulary introduction
2. Grammar explanation
3. Short practice exercises
4. AI voice conversation
5. Speaking evaluation
6. Vocabulary review

The AI enhances the learning experience but does not replace the curriculum.

---

# Core Features

## Structured Curriculum

Users progress through a predefined sequence of lessons covering everyday situations from beginner to advanced levels.

Examples include:

- Greetings
- Introducing yourself
- Ordering food
- Shopping
- Asking for directions
- University
- Job interviews
- Healthcare
- Travel
- Public Transport
- Renting an Apartment

---

## AI Voice Conversations

The primary feature of Belong is real-time voice conversations with AI characters.

Users speak naturally using their microphone while AI characters respond using synthesized speech, creating an experience similar to a phone or video call with a friend.

---

## Persistent AI Characters

Each AI character has:

- A unique personality
- Occupation
- Speaking style
- Voice
- Storyline
- Relationship with the learner

Characters remember previous interactions, allowing conversations to evolve naturally over time.

---

## Story Progression

Each character follows an ongoing storyline that develops throughout the curriculum.

Rather than meeting a new character every lesson, users build familiarity with recurring characters whose lives continue as lessons progress.

---

## Vocabulary Notebook

Every vocabulary word introduced during lessons is automatically added to the learner's vocabulary notebook.

Each entry contains:

- Translation
- Pronunciation
- Example sentence
- Topic
- Lesson
- Audio pronunciation

Vocabulary can be searched and filtered by topic.

---

## Speaking Evaluation

After each conversation, the system evaluates:

- Grammar usage
- Vocabulary usage
- Pronunciation
- Fluency
- Lesson objectives

Learners receive actionable feedback and suggestions for improvement.

---

## Character Calls

Characters may occasionally initiate conversations by calling the learner.

These optional conversations reinforce previous lessons while continuing each character's storyline.

---

# AI Vision

Belong is designed as an AI-native application rather than simply integrating an LLM into a traditional language learning platform.

The AI system is responsible for:

- Conducting conversations
- Maintaining character personalities
- Retrieving lesson context using RAG
- Evaluating learner responses
- Generating personalized feedback

Application logic such as lesson progression, curriculum, and story state is managed by the backend.

---

# Technology Overview

Frontend

- Next.js (Web)
- React Native + Expo (Mobile)

Backend

- FastAPI
- PostgreSQL
- SQLAlchemy

AI

- Gemini 2.5 Flash
- ElevenLabs Speech-to-Text
- ElevenLabs Text-to-Speech
- LangGraph
- LangChain
- Qdrant

Deployment

- Docker
- Vercel
- Railway
- Supabase
