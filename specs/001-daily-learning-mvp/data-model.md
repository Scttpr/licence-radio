# Data Model: Daily Learning MVP

**Feature**: 001-daily-learning-mvp
**Date**: 2026-01-01

## Overview

This document defines the data structures for the learning progress tracking system.
All data is stored client-side in browser localStorage as JSON.

## Entities

### 1. Progress (Root Entity)

The main container for all learning progress data.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| version | number | Yes | Schema version for migrations (current: 1) |
| lastAccessed | number | Yes | Unix timestamp (ms) of last activity |
| currentLesson | string | No | Lesson ID where learner left off |
| lessons | object | Yes | Map of lesson ID → LessonProgress |

**Constraints**:
- `version` MUST be a positive integer
- `lastAccessed` MUST be updated on every state change
- `currentLesson` MUST be a valid lesson ID or null

### 2. LessonProgress

Tracks individual lesson state.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| visited | boolean | Yes | True if lesson page was opened |
| completed | boolean | Yes | True if scroll-to-bottom detected |
| completedAt | number | No | Unix timestamp (ms) when completed |

**Constraints**:
- `completed` can only be true if `visited` is true
- `completedAt` MUST be set when `completed` becomes true

### 3. Lesson (Static Reference)

Lessons are defined by the mdbook SUMMARY.md structure. Not stored in localStorage but
referenced by ID.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| id | string | URL path | Unique identifier (e.g., "ohm_joule") |
| title | string | SUMMARY.md | Display name (e.g., "Lois d'Ohm et de Joule") |
| section | string | SUMMARY.md | Parent section name |
| order | number | SUMMARY.md | Position in curriculum (0-indexed) |

**Lesson IDs** (derived from file names):
```
introduction          # Section: Introduction
classes_emission      # Section: Réglementation
frequences_puissances
alphabet_code_q
exploitation_indicatifs
bases_techniques
maths                 # Section: Technique - Bases d'électricité
ohm_joule
courants_alternatifs
transformateurs
decibels_lc
diodes                # Section: Technique - Composants actifs
transistors
amplificateurs        # Section: Technique - Radioélectricité
aop
propagation_antennes
lignes
synoptiques
modulations
annexes               # Section: Ressources
```

### 4. Section (Static Reference)

Sections group lessons logically. Not stored in localStorage.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| name | string | SUMMARY.md | Section display name |
| lessons | string[] | SUMMARY.md | Ordered list of lesson IDs |

**Sections**:
1. Introduction (1 lesson)
2. Réglementation (5 lessons)
3. Technique - Bases d'électricité (5 lessons)
4. Technique - Composants actifs (2 lessons)
5. Technique - Radioélectricité (6 lessons)
6. Ressources (1 lesson)

## State Transitions

### Lesson State Machine

```
┌─────────────┐    open page    ┌─────────────┐   scroll to    ┌─────────────┐
│ Not Started │ ──────────────► │   Visited   │ ──────────────►│  Completed  │
└─────────────┘                 └─────────────┘    bottom       └─────────────┘
                                      │                               │
                                      │         re-open page          │
                                      ◄───────────────────────────────┘
                                    (stays completed)
```

**Rules**:
- Lesson starts as "Not Started" (no entry in localStorage)
- Opening a lesson creates entry with `visited: true, completed: false`
- Scrolling to bottom sets `completed: true, completedAt: now`
- Completed lessons remain completed (no "un-complete" in MVP)
- Re-visiting a completed lesson does not change state

## localStorage Schema

### Key
```
radioLicenceProgress
```

### Value (JSON)
```json
{
  "version": 1,
  "lastAccessed": 1704067200000,
  "currentLesson": "courants_alternatifs",
  "lessons": {
    "introduction": {
      "visited": true,
      "completed": true,
      "completedAt": 1704020400000
    },
    "classes_emission": {
      "visited": true,
      "completed": true,
      "completedAt": 1704024000000
    },
    "frequences_puissances": {
      "visited": true,
      "completed": false
    }
  }
}
```

## Validation Rules

1. **Schema Version**: If `version` doesn't match current, run migration
2. **Lesson ID**: Must match one of the 20 defined lesson IDs
3. **Timestamps**: Must be valid Unix timestamps (> 0)
4. **Boolean Fields**: Must be true/false, not truthy/falsy strings
5. **Graceful Degradation**: If localStorage unavailable or corrupted, initialize fresh

## Migration Strategy

### Version 1 → Future
Reserved for future schema changes. When needed:
1. Check `version` field on load
2. Apply transformation function
3. Update `version` to current
4. Save migrated data

```javascript
function migrateProgress(data) {
  if (data.version === 1) {
    // Future: migrate v1 → v2
  }
  return data;
}
```
