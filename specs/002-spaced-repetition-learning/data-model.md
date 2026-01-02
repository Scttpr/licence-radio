# Data Model: Spaced Repetition Learning Platform

**Feature**: 002-spaced-repetition-learning
**Date**: 2026-01-01

## Overview

This document defines the data structures for the spaced repetition learning platform. All
data is stored client-side in browser localStorage as JSON. Content (segments and questions)
is bundled as static JSON files at build time.

---

## Content Entities (Static, Build-Time)

### Manifest

Root index of all content, loaded at app initialization.

```typescript
interface Manifest {
  version: string;              // Content version for cache invalidation
  generatedAt: number;          // Unix timestamp of build
  sections: Section[];          // Course sections in order
  totalSegments: number;        // Quick count for progress calculation
  totalQuestions: number;       // Quick count for stats
}

interface Section {
  id: string;                   // e.g., "reglementation"
  title: string;                // e.g., "Réglementation"
  lessons: Lesson[];            // Lessons in curriculum order
}

interface Lesson {
  id: string;                   // e.g., "classes_emission"
  title: string;                // e.g., "Classes d'émission"
  sourceFile: string;           // Original markdown file
  segments: SegmentRef[];       // References to segment files
}

interface SegmentRef {
  id: string;                   // e.g., "classes_emission-01"
  title: string;                // Segment heading
  file: string;                 // Path to segment JSON
  questionFile: string;         // Path to questions JSON
  wordCount: number;            // For reading time estimate
  order: number;                // Position in lesson
}
```

### Segment

A portion of lesson content, sized for 5-10 minute reading.

```typescript
interface Segment {
  id: string;                   // Unique identifier
  lessonId: string;             // Parent lesson
  sectionId: string;            // Parent section
  title: string;                // Segment heading
  content: string;              // HTML content (processed markdown)
  wordCount: number;            // For reading time
  order: number;                // Position in lesson
  prev: string | null;          // Previous segment ID
  next: string | null;          // Next segment ID
}
```

**File location**: `content/segments/{segment-id}.json`

### Question

A pre-authored question for active recall.

```typescript
interface Question {
  id: string;                   // Unique identifier, e.g., "q-classes_emission-01-001"
  segmentId: string;            // Associated segment
  type: QuestionType;           // Question format
  prompt: string;               // Question text (may include LaTeX)
  options?: string[];           // For multiple_choice type
  correct: number | boolean;    // Index for MC, boolean for T/F
  explanation: string;          // Shown after answer
  difficulty?: 'easy' | 'medium' | 'hard';  // Optional difficulty tag
}

type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
```

**File location**: `content/questions/{segment-id}.json` (array of questions per segment)

---

## Runtime Entities (localStorage)

### AppState

Root state object stored in localStorage.

```typescript
interface AppState {
  version: number;              // Schema version for migrations
  lastAccessed: number;         // Unix timestamp
  session: SessionState;        // Current session state
  cards: Record<string, Card>;  // SRS cards keyed by question ID
  segments: Record<string, SegmentProgress>;  // Segment completion status
  stats: LearningStats;         // Aggregate statistics
}
```

**Storage key**: `hamRadioLearning`

### SessionState

Tracks the current or most recent daily session.

```typescript
interface SessionState {
  date: string;                 // ISO date string (YYYY-MM-DD)
  inProgress: boolean;          // Is session active?
  phase: 'review' | 'learn' | 'complete';  // Current session phase
  reviewQueue: string[];        // Question IDs pending review
  reviewedToday: string[];      // Question IDs reviewed this session
  newSegment: string | null;    // Current new segment (max 1 per session)
  segmentCompleted: boolean;    // Has new segment been completed?
  questionsAnswered: number;    // Count for session
}
```

### Card

Spaced repetition state for a single question.

```typescript
interface Card {
  questionId: string;           // Reference to question
  interval: number;             // Days until next review
  easeFactor: number;           // SM-2 ease factor (default 2.5)
  dueDate: number;              // Unix timestamp for next review
  repetitions: number;          // Total times reviewed
  consecutiveCorrect: number;   // Streak for mastery (mastered at 3)
  state: CardState;             // Current learning state
  lastReviewDate: number;       // Unix timestamp of last review
}

type CardState = 'new' | 'learning' | 'reviewing' | 'mastered';
```

**State Transitions**:
- `new` → `learning`: First time answered
- `learning` → `reviewing`: 1 correct answer
- `reviewing` → `mastered`: 3 consecutive correct answers
- Any state → `learning`: Incorrect answer (resets consecutiveCorrect)

### SegmentProgress

Completion status for a content segment.

```typescript
interface SegmentProgress {
  segmentId: string;
  visited: boolean;             // Has segment been opened?
  completed: boolean;           // Has segment been fully read?
  completedAt: number | null;   // Unix timestamp of completion
  questionsAnswered: number;    // Questions answered from this segment
}
```

### LearningStats

Aggregate learning statistics for dashboard.

```typescript
interface LearningStats {
  totalSessionDays: number;     // Unique days with sessions
  currentStreak: number;        // Consecutive days practiced
  longestStreak: number;        // Best streak achieved
  totalQuestionsAnswered: number;
  totalCorrect: number;
  averageAccuracy: number;      // Percentage
  sectionProgress: Record<string, SectionStats>;
}

interface SectionStats {
  sectionId: string;
  segmentsCompleted: number;
  segmentsTotal: number;
  cardsMastered: number;
  cardsTotal: number;
  masteryPercentage: number;    // Calculated from mastered/total
}
```

---

## Validation Rules

### Content Validation (Build-Time)

1. All segment IDs must be unique across the entire content set
2. All question IDs must be unique and follow pattern: `q-{segmentId}-{nnn}`
3. Each segment must have at least 3 questions (per FR-002)
4. Multiple choice questions must have exactly 4 options
5. `correct` index must be valid for the options array
6. All LaTeX expressions must parse successfully with KaTeX
7. Word counts must be between 300-2000 (targeting 5-10 min read)

### Runtime Validation

1. AppState version must match current schema version (or trigger migration)
2. Card.easeFactor must be >= 1.3 and <= 3.0
3. Card.interval must be >= 1
4. Card.consecutiveCorrect must be >= 0 and <= 3 (capped at mastery)
5. Session.reviewQueue must only contain valid question IDs
6. All referenced segment/question IDs must exist in manifest

---

## State Transitions

### Card State Machine

```
┌─────────┐   first answer   ┌──────────┐   1 correct   ┌───────────┐
│   NEW   │ ───────────────► │ LEARNING │ ────────────► │ REVIEWING │
└─────────┘                  └──────────┘               └───────────┘
                                   ▲                          │
                                   │                          │ 3 consecutive
                            incorrect                         │ correct
                                   │                          ▼
                             ┌─────┴─────┐              ┌──────────┐
                             │           │◄─────────────│ MASTERED │
                             └───────────┘   incorrect  └──────────┘
```

### Session Flow

```
┌───────────────┐
│ Session Start │
└───────┬───────┘
        │
        ▼
┌───────────────┐     no reviews due     ┌────────────────┐
│ Check Reviews │ ─────────────────────► │ New Segment    │
└───────┬───────┘                        └───────┬────────┘
        │                                        │
        │ reviews exist                          │
        ▼                                        ▼
┌───────────────┐     all reviewed       ┌────────────────┐
│ Review Phase  │ ─────────────────────► │ Questions      │
└───────┬───────┘                        └───────┬────────┘
        │                                        │
        │ max 50 reviews                         │
        ▼                                        ▼
┌───────────────┐                        ┌────────────────┐
│ New Segment   │                        │ Session Done   │
└───────────────┘                        └────────────────┘
```

---

## Migration Strategy

Schema migrations are triggered when `AppState.version` doesn't match the current version.

```typescript
interface Migration {
  fromVersion: number;
  toVersion: number;
  migrate: (oldState: unknown) => AppState;
}

const migrations: Migration[] = [
  // Add migrations here as schema evolves
  // { fromVersion: 1, toVersion: 2, migrate: migrateV1toV2 }
];
```

**Migration Rules**:
1. Never delete data without user confirmation
2. Add sensible defaults for new fields
3. Log migration success/failure
4. Keep backup of old state until migration confirmed successful
