# Urjaa — Immersive Personal Digital Universe for Women's Wellness

> **"One person. One personal universe. One intelligent companion."**
> *"Track less. Understand more. Recommend better."*

Urjaa is a cycle-aware personal digital universe that adapts daily nutrition, kinetic movement, recovery, and hydration recommendations to how you feel today based on a rapid 20–30 second biometric check-in.

---

## 🌌 The Personal Universe Architecture

Urjaa transforms conventional scrolling dashboards into distinct connected digital environments ("Realms") revolving around a central **Personal Avatar Nexus**:

- **My Universe (`/universe` or `/home`)**: The central celestial sanctuary displaying your personal synthesized avatar, concentric orbital rings for your biological rhythm, live energy status, and entry portals to each realm.
- **Avatar Creation Studio (`/avatar-studio`)**: A 5-step digital synthesis flow where you upload a photograph to generate a personalized cosmic avatar across 4 visual styles (*Celestial Luminary*, *Quantum Voyager*, *Verdant Harmonic*, *Ethereal Soul*) and customizable aura spectrums (*Rose, Sapphire, Violet, Amber, Emerald*).
- **Aura AI Companion (`/companion` or slide-out drawer)**: An intelligent conversational companion attuned to your biological phase, energy levels, and logged symptoms, offering instant recommendations and 1-click action shortcuts.
- **Command Palette (`Ctrl+K`)**: Keyboard-driven spatial navigation to jump across all realms instantaneously.

---

## 🏛️ The 6 Interactive Realms

1. **Rhythm Sanctuary (`/cycle`)**:
   - 4-Phase hormonal calculations (*Menstrual, Follicular, Ovulatory, Luteal*) supporting variable cycle lengths (not just 28 days).
   - Transparent confidence scores, irregular cycle support, and hormonal waveform curves.
   - Interactive Period Flow Logger modal with history ledger.

2. **Kinetic Forge (`/workout` & `/workout/session/:id`)**:
   - 50+ seeded exercises across all muscle groups.
   - Looping SVG animation archetypes (`squat_pattern`, `push_pattern`, `plank_pattern`, `lunge_pattern`, `jumping_pattern`, `static_hold`, `stretch_pattern`).
   - Interactive 4-stage session state machine (`PREPARING` → `EXERCISE` → `REST` → `COMPLETE`).
   - Step-up / step-down progression and regression chains with quiet-mode (zero jumping) alternatives.
   - Compassionate Low-Motivation Mode for low-energy days.

3. **Alchemy Kitchen (`/nutrition`)**:
   - Micronutrient-dense meal plans synchronized with hormonal phases across 4 diets (*Vegetarian, Eggetarian, Non-vegetarian, Vegan*).
   - 1-Tap clean substitution laboratory with dietary rationale.
   - Adherence progress tracker without restrictive calorie counting.

4. **Biometric Pulse (`/check-in`)**:
   - 20-second kinetic flow tracking mood, energy levels, cramps, bloating, sleep quality, and flow.
   - Interactive Hydration Vortex tracker (+250ml quick increments).

5. **Temporal Orbit (`/calendar`)**:
   - Visual monthly grid with 9 filter lenses (*Cycle, Movement, Nutrition, Hydration, Mood, Energy, Sleep, Consistency, All*).
   - Streak tracking and supportive weighted non-punitive consistency scoring.
   - Expandable day detail drawer with comprehensive biometric logs.

6. **Neural Core (`/insights`)**:
   - Recharts-powered biological waveform graphs showing hormonal curves vs. daily energy stamina.
   - Consistency analytics, sleep correlations, and cycle regularity statistics.

7. **Identity Core (`/profile` & `/settings`)**:
   - Avatar management, lifestyle protocols, and PCOS / PCOD mode.
   - 1-Click GDPR-compliant health data export (`.json`) and permanent account deletion.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS, React Router v6, TanStack Query, Lucide Icons, Recharts.
- **Backend**: Go 1.22+, `net/http` modular architecture, JWT auth with bcrypt, structured logging, in-memory standalone fallback & PostgreSQL driver.
- **Database**: PostgreSQL 16 (with automated migrations & seeds).
- **Design System**: Cosmic dark atmosphere with rose, sapphire, nebula violet, and solar amber glows; glassmorphic panels; HTML5 Canvas celestial starfield with reduced-motion support.

---

## 🚀 Quick Start

### 1. Backend (Go)
```bash
cd backend
go mod tidy
go run cmd/api/main.go
```
*The backend API will start on `http://localhost:8080`. If PostgreSQL is not running locally, it seamlessly falls back to robust in-memory storage for standalone development.*

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser. You can click **"Instant Demo Explorer"** to enter the universe immediately as Maya.*

### 3. Production Build
```bash
cd frontend
npm run build
```

---

## 🩺 Medical Disclaimer

> *"Urjaa provides wellness and educational recommendations and does not replace professional medical care."*
