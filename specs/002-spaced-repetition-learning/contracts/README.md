# Contracts: Spaced Repetition Learning Platform

**Feature**: 002-spaced-repetition-learning
**Date**: 2026-01-01

## Overview

This feature is a **local-only static web application** with no backend API. All data is
stored in browser localStorage, and all content is bundled as static JSON files.

**There are no API contracts to define.**

## Internal Interfaces

The following internal JavaScript module interfaces are defined for implementation guidance:

### Storage Module (`storage.js`)

```typescript
interface StorageService {
  // Get current app state, initializing if needed
  getState(): AppState;

  // Save updated state to localStorage
  saveState(state: AppState): void;

  // Reset all progress (with user confirmation)
  resetProgress(): void;

  // Export state for backup
  exportState(): string;

  // Import state from backup
  importState(json: string): boolean;
}
```

### SRS Module (`srs.js`)

```typescript
interface SRSService {
  // Get all cards due for review today
  getDueCards(state: AppState): Card[];

  // Process answer and update card scheduling
  recordAnswer(card: Card, quality: AnswerQuality): Card;

  // Calculate next review date using SM-2
  calculateNextReview(card: Card, quality: AnswerQuality): { interval: number; dueDate: number; };

  // Get mastery statistics for a section
  getSectionMastery(sectionId: string, state: AppState): SectionStats;
}

type AnswerQuality = 'again' | 'hard' | 'good' | 'easy';
```

### Session Module (`session.js`)

```typescript
interface SessionService {
  // Start or resume today's session
  startSession(state: AppState, manifest: Manifest): SessionState;

  // Get next item to present (review card or new content)
  getNextItem(session: SessionState, state: AppState): SessionItem;

  // Mark current item complete and advance
  completeItem(session: SessionState, result: ItemResult): SessionState;

  // Check if session is complete for today
  isSessionComplete(session: SessionState): boolean;
}

type SessionItem =
  | { type: 'review'; card: Card; question: Question }
  | { type: 'segment'; segment: Segment }
  | { type: 'question'; question: Question }
  | { type: 'complete' };
```

### Renderer Module (`renderer.js`)

```typescript
interface RenderService {
  // Render segment content with KaTeX processing
  renderSegment(segment: Segment, container: HTMLElement): void;

  // Render question card with answer options
  renderQuestion(question: Question, onAnswer: AnswerCallback): void;

  // Render answer feedback
  renderFeedback(question: Question, wasCorrect: boolean): void;

  // Render progress dashboard
  renderDashboard(state: AppState, manifest: Manifest): void;
}

type AnswerCallback = (selectedAnswer: number | boolean) => void;
```

## File Format Contracts

See [data-model.md](./data-model.md) for complete schemas of:

- `manifest.json`: Content index
- `segments/*.json`: Lesson segment content
- `questions/*.json`: Pre-authored questions
- `localStorage['hamRadioLearning']`: Runtime state

## Build Output Contract

The build script produces a self-contained static site in `build/output/`:

```
build/output/
├── index.html              # Entry point
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── srs.js
│   ├── storage.js
│   ├── renderer.js
│   └── session.js
├── assets/
│   └── katex/              # KaTeX CSS and fonts
├── content/
│   ├── manifest.json
│   ├── segments/
│   └── questions/
└── sw.js                   # Service worker for offline
```

This output can be deployed to any static file host (GitHub Pages, Netlify, local file server).
