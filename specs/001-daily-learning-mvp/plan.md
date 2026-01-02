# Implementation Plan: Daily Learning MVP

**Branch**: `001-daily-learning-mvp` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-daily-learning-mvp/spec.md`

## Summary

Transform the existing mdbook-based HAM licence course into a daily learning platform with
progress tracking. The platform will enable learners to quickly access their next lesson
(2-click maximum), track completion status via scroll-to-bottom detection, and persist
progress locally. All features must work fully offline after initial load.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3 - browser-native, no build step
**Primary Dependencies**: mdbook (existing), mdbook-katex (for formulas), vanilla JS
**Storage**: Browser localStorage for progress persistence
**Testing**: Manual browser testing (MVP); automated tests out of scope for MVP
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
**Project Type**: Static site enhancement (mdbook customization)
**Performance Goals**: Page load < 2s, instant navigation between lessons
**Constraints**: Offline-capable after first visit, no server required, < 50KB JS
**Scale/Scope**: Single user, 17 lessons, 5 sections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Dead Simple | No feature requires manual | PASS | 2-click access, auto-completion |
| II. Learner First | Progressive structure | PASS | Existing curriculum preserved |
| III. Math Formulas | LaTeX/KaTeX rendering | PASS | mdbook-katex handles this |
| IV. Daily Practice | 2-click access, progress tracked | PASS | Core feature of MVP |
| V. Knowledge Validation | Review past content | PARTIAL | Review access yes; quizzes deferred |
| VI. Local-First | Offline after setup | PASS | Static site + localStorage |
| VII. Open Source | Documentation, clear license | PASS | Existing CC BY-NC-SA 4.0 |

**Gate Result**: PASS (Principle V partially met - self-assessment deferred to future feature)

## Project Structure

### Documentation (this feature)

```text
specs/001-daily-learning-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── introduction.md      # Existing lesson files
├── classes_emission.md
├── ... (17 lesson files)
└── SUMMARY.md           # Course structure

theme/
├── css/
│   └── progress.css     # Progress indicator styles
└── js/
    └── progress.js      # Progress tracking logic (localStorage, scroll detection)

book.toml                # mdbook configuration (existing, to be updated)
```

**Structure Decision**: Static site enhancement pattern. Extend mdbook's theme system with
custom JavaScript for progress tracking. No backend, no build pipeline for JS - keep it
minimal per Constitution Principle I (Dead Simple).

## Complexity Tracking

No violations. The approach uses:
- Existing mdbook infrastructure
- Browser-native localStorage (no external DB)
- Vanilla JavaScript (no frameworks)
- CSS for visual indicators (no complex state management)
