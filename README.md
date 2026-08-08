 ii need a readme.md ahaha

# REMEMBER: 

UI (presentation)
        │
        ▼
Use Case (application)
        │
        ▼
Planning Engine (domain)
        │
        ▼
Repository / Google Calendar / Storage
(infrastructure)

I would like Daily OS to evolve like this

Today:

Presentation

↓

Next:

Presentation
 ├── theme
 ├── providers
 ├── navigation
 └── shell

↓

Later:

Presentation
Application
Domain
Infrastructure

Notice that Application, Domain, and Infrastructure can stay almost empty for a while. That's completely normal.

Dashboard
│
├── 📅 Today's Plan
├── ✅ Today's Tasks
├── ⏰ Next Events
├── 🎯 Top Priorities
├── 📈 Progress
└── 💡 AI Suggestions


# FUTURE 

the app opens like this:

👋 Good morning, André.

Here's your day.

Then immediately:

─────────────────────────────
🕘 NOW
Continue React Native Theme
Estimated: 45 min

Next
📅 Physiotherapy - 14:00

Top 3 Priorities
1. Daily OS
2. LeetCode
3. Engineering Lab

Energy
███████░░░ 7/10

Today's Progress
███░░░░░░░ 30%
─────────────────────────────

No menus.

No hunting.

No deciding.

The app has already decided what matters right now.

wowow

This also fits your long-term vision

Later, your AI planning engine can generate this automatically.

Good morning, André.

You slept 7h 42m.

Energy looks medium.

You have physiotherapy at 14:00.

Finish Issue #6 before lunch.

Skip LeetCode until this evening.

Estimated productive time: 5h 20m.

The AI isn't replacing you—it becomes your executive assistant.

presentation/
│
├── components/   ← reusable UI
├── hooks/        ← presentation hooks
├── navigation/   ← Expo Router / navigation
├── providers/    ← ThemeProvider, QueryProvider...
├── screens/      ← DashboardScreen, PlannerScreen...
├── shell/        ← AppShell
└── theme/        ← colors, spacing, typography
