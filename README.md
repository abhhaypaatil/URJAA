# Urjaa — Cycle-Aware Women's Wellness Platform

> **"Track less. Understand more. Recommend better."**

Urjaa is a cycle-aware women's wellness web platform that adjusts daily nutrition, workout, recovery, and hydration recommendations to how you feel today based on a fast 20–30 second check-in.

---

## Key Features

- **Cycle Intelligence**: 4-Phase hormonal calculation (Menstrual, Follicular, Ovulatory, Luteal) supporting variable cycle lengths (not just 28 days) with explicit confidence scores and irregular cycle support.
- **20–30 Second Daily Check-in**: Fast tracking for mood, energy, pelvic cramps, bloating, sleep quality, water intake, and nutrition adherence.
- **Cycle-Aware Nutrition**: Micro- and macro-nutrient recommendations adapted to dietary preferences (Vegetarian, Eggetarian, Non-vegetarian, Vegan) with 1-tap substitutions.
- **Guided Workout Engine (MVP)**:
  - 50+ exercises seeded across all muscle groups.
  - Reusable SVG/CSS looping animation archetypes (`squat_pattern`, `push_pattern`, `plank_pattern`, `lunge_pattern`, `jumping_pattern`, `static_hold`, `stretch_pattern`).
  - Interactive session state machine (`PREPARING` → `EXERCISE` → `REST` → `COMPLETE`).
  - Progression & regression chains for exercise replacement (Easier, Harder, Quiet, Low-impact).
  - Rule-based post-workout progression adjustment.
- **Visual Month Calendar**: Dedicated `/calendar` route with 9 filter modes, streak tracking, weighted non-punitive consistency scores, and day detail modal/bottom-sheet.
- **PCOS / PCOD Mode**: Optional mode modifying workouts and meals with a single unified medical disclaimer.
- **Sapphire & Rose Design System**: Light / Dark / System themes with persistent preferences.
- **Privacy & Safety**: 1-click health data export and permanent account deletion.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router v6, TanStack Query, Lucide Icons, Recharts.
- **Backend**: Go 1.22+, `net/http` modular architecture, JWT auth with bcrypt, structured logging.
- **Database**: PostgreSQL 16 (with automated migrations & seeds).
- **DevOps**: Docker, Docker Compose, Nginx.

---

## Quick Start

### 1. Running with Docker Compose (Full Stack)

```bash
docker compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8080](http://localhost:8080)
- PostgreSQL: `localhost:5432`

---

### 2. Local Development

#### Backend (Go)
```bash
cd backend
go run cmd/api/main.go
```
To run tests:
```bash
cd backend
go test ./...
```

#### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## Medical Disclaimer

> *"Urjaa provides wellness and educational recommendations and does not replace professional medical care."*
