# Nagare

Nagare is a minimalist productivity platform designed for focus and workflow management. It integrates a pomodoro-style focus timer, a Kanban-based task management system, and an AI-driven music experience in a unified Neobrutalist interface.

## Core Features

- **Enhanced Focus Timer**:
  - **Dual Modes**: Switch between **Flow Mode** (indefinite stopwatch) and **Pomodoro Mode** (structured deep work).
  - **Customizable Pomodoro**: Adjustable durations for Focus, Short Break, and Long Break sessions.
  - **Session Tracking**: Automatic cycle management with visual session counters.
  - **Immersive Full Screen**: Distraction-free interface with mouse-triggered controls for maximum concentration.
- **Kanban Task Management**: Organise workflows with persistent Todo, In Progress, and Done boards.
- **AI-Driven Music Experience**:
  - Global playback context that continues across all tabs.
  - Natural language mood analysis via Gemini AI.
  - Integrated YouTube Music search for high-quality audio streaming.
  - Floating mini-player for quick control while focused on other tasks.
- **Neobrutalist Design**: High-contrast, accessibility-focused interface with support for adaptive light/dark modes and custom color palettes (Soft Slate, Warm, Nordic).

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS / Vanilla CSS
- **Animation**: Framer Motion
- **AI Integration**: Google Gemini AI (Generative AI SDK)
- **Music Engine**: YouTube IFrame API / ytmusic-api
- **Persistence**: Browser LocalStorage for sessions and task states
- **License**: MIT
