# Contracts: Daily Learning MVP

**Feature**: 001-daily-learning-mvp
**Date**: 2026-01-01

## Overview

This feature does not require API contracts as it is a purely client-side implementation.

- **No backend**: All data stored in browser localStorage
- **No REST/GraphQL APIs**: Static site served by mdbook
- **No external services**: Offline-first design

## Client-Side Interface

The "contract" for this feature is the JavaScript module interface:

### progress.js Module

```javascript
// Initialize or retrieve progress from localStorage
function getProgress(): Progress

// Save progress to localStorage
function saveProgress(progress: Progress): void

// Mark current lesson as visited
function markLessonVisited(lessonId: string): void

// Mark current lesson as completed (scroll-to-bottom detected)
function markLessonComplete(lessonId: string): void

// Check if a lesson is completed
function isLessonComplete(lessonId: string): boolean

// Get the next incomplete lesson ID for "Continue" button
function getNextLesson(): string | null

// Get completion percentage (completed / total lessons)
function getCompletionPercentage(): number
```

### Type Definitions

See [data-model.md](./data-model.md) for full type definitions.

## Future API Considerations

If backend sync is added in the future, the localStorage structure is designed to be
easily serializable and can be sent to a REST endpoint:

```
POST /api/progress
Content-Type: application/json

{
  "version": 1,
  "lessons": { ... }
}
```

This is out of scope for MVP.
