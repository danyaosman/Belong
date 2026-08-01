# Functional Requirements

This document defines the functional requirements for Belong. Each requirement represents a feature the system must support.

---

# FR-1 User Management

### FR-1.1 Authentication
- Users shall be able to register an account.
- Users shall be able to log in and log out.
- Users shall remain authenticated between sessions.

### FR-1.2 User Profile
- Users shall be able to edit their profile.
- Users shall choose a target language.
- Users shall track their learning progress.

---

# FR-2 Curriculum

### FR-2.1 Lessons
- The system shall provide a predefined curriculum from beginner to advanced.
- Lessons shall unlock sequentially.
- Each lesson shall contain vocabulary, grammar, exercises, and a speaking session.

### FR-2.2 Lesson Progress
- The system shall save lesson completion.
- Users may revisit completed lessons.

---

# FR-3 Vocabulary

### FR-3.1 Vocabulary Notebook
- Learned vocabulary shall be automatically added to the user's notebook.
- Vocabulary shall be grouped by lesson and topic.
- Users shall be able to search and filter vocabulary.

### FR-3.2 Vocabulary Details
Each vocabulary entry shall include:
- Translation
- Pronunciation
- Example sentence
- Audio pronunciation

---

# FR-4 Grammar

- Each lesson shall introduce one or more grammar concepts.
- Grammar explanations shall include examples.
- Users shall complete grammar exercises before the speaking activity.

---

# FR-5 Exercises

The system shall provide:
- Multiple choice questions
- Matching exercises
- Fill-in-the-blank exercises
- Sentence ordering exercises

Exercises shall be completed before unlocking the speaking session.

---

# FR-6 Speaking Conversations

### FR-6.1 Voice Interaction
- Users shall communicate using speech.
- Speech shall be converted into text.
- AI responses shall be generated as speech.

### FR-6.2 Conversation
- Conversations shall follow the lesson objectives.
- AI shall remain within the vocabulary and grammar scope of the current lesson.
- Users may request hints during conversations.

---

# FR-7 AI Characters

Each AI character shall have:
- Name
- Avatar
- Voice
- Personality
- Occupation
- Bio

---

# FR-8 Story System

- Characters shall progress through predefined storylines.
- Story progression shall continue across lessons.

---

# FR-9 Speaking Evaluation

After each conversation, the system shall evaluate:
- Grammar
- Vocabulary
- Pronunciation
- Fluency
- Lesson objectives

Feedback shall include suggested corrections and improvement areas.

---

# FR-10 Character Calls

- Characters may initiate optional conversations.
- Users may accept or decline incoming calls.

---

# FR-11 Progress Tracking

The system shall track:
- Completed lessons
- Vocabulary learned
- Grammar learned
- Speaking scores
- Learning streaks

---

# FR-12 Dashboard

The dashboard shall display:
- Current lesson
- Lesson path
- Learning progress

---

# FR-13 AI System

The AI system shall:
- Generate character dialogue.
- Retrieve lesson context using RAG.
- Maintain conversation memory.
- Evaluate learner responses.
- Produce structured feedback.

Application logic shall remain deterministic and controlled by the backend orchestrator.

---

# FR-14 Notifications

The system shall:
- Notify users of incoming character calls.
- Remind users to continue lessons.
- Display achievement notifications.

---

# FR-15 Administration

Administrators shall be able to:
- Create lessons
- Edit lesson content
- Manage vocabulary
- Manage grammar content
- Manage characters