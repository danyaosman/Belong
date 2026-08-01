# Database Design

## Overview

Belong uses a relational PostgreSQL database to store user data, lesson content, learning progress, character information, and conversation history.

The database is designed to support a structured curriculum while maintaining persistent AI character interactions.

---

# Core Entities

## User

Stores user account information and learning preferences.

Main data:

- Profile information
- Authentication
- Current lesson
- Learning progress
- User Preferences

---

## Lesson

Represents a lesson within the curriculum.

Main data:

- Title
- Difficulty
- Topic
- Lesson order

Each lesson contains vocabulary, grammar, exercises, and a speaking activity.

---

## Vocabulary

Stores all vocabulary introduced throughout the curriculum.

Main data:

- Word
- Translation
- Pronunciation
- Example sentence
- Audio file
- Topic
- Lesson

---

## Grammar

Stores grammar concepts taught in each lesson.

Main data:

- Title
- Explanation
- Examples
- Lesson

---

## Exercise

Stores lesson exercises.

Supported exercise types:

- Multiple Choice
- Matching
- Fill in the Blank
- Sentence Ordering

Exercise content is stored as JSON to support different exercise formats.

---

## Character

Represents AI characters that interact with learners.

Main data:

- Name
- Personality
- Occupation
- Avatar
- Voice
- Bio

---

## Progress

Tracks each user's learning progress.

Main data:

- Completed lessons
- XP
- Speaking scores
- Learning streak
- Last activity

---

## Conversation

Stores completed speaking sessions.

Main data:

- User
- Character
- Lesson
- Transcript
- Evaluation
- Date

---

# Relationships

- A User completes many Lessons.
- A Lesson contains many Vocabulary words.
- A Lesson contains many Grammar topics.
- A Lesson contains many Exercises.
- A User participates in many Conversations.
- A Character participates in many Conversations.
- A User has one Progress record.

---

# External Storage

Large files are stored outside the database.

Examples:

- Character avatars
- Vocabulary pronunciation audio
- Conversation audio recordings

The database stores only file URLs.

---

# Design Principles

The database is designed to:

- Minimize data duplication
- Maintain referential integrity
- Support scalable lesson content
- Separate structured data from media files
- Support future feature expansion