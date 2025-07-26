CampusLink – Smart Campus Companion

CampusLink is a full-stack web application designed to streamline student and faculty interactions within a campus environment. It provides features like announcements, document management, polls, timetable viewing, leave/OD requests, and more — all within a single portal.

AI Assistant – Built from Scratch

One of the most unique aspects of CampusLink is the custom-built AI chatbot integrated into the platform.

Features of the AI Assistant:
Built from scratch using vanilla React and JavaScript APIs (e.g., Web Speech API).

Capable of both speech recognition and text-to-speech (TTS).

Accepts text or voice input and responds dynamically via an external AI inference endpoint.

Can be used for help, FAQs, or even student assistance.

Intelligent Message Prioritization using Dijkstra's Algorithm:
The chatbot internally simulates a graph-based approach to handle responses, where:

Each possible conversation or topic is treated as a node.

The edges between nodes represent the semantic similarity or transition cost.

When a user asks a question, the bot uses Dijkstra’s Algorithm to compute the shortest path to the most relevant response node.

This approach ensures efficient, prioritized, and context-aware replies, especially when handling complex queries or help navigation.

Tech Stack
Frontend: React.js, Chart.js, Firebase Auth
Backend (AI): Custom API with Dijkstra-based logic
Database: Firebase Firestore
Voice/AI Tools: Web Speech API (SpeechRecognition + SpeechSynthesis)
