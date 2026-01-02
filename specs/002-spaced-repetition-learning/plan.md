# Implementation Plan: Spaced Repetition Learning Platform

**Branch**: `002-spaced-repetition-learning` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-spaced-repetition-learning/spec.md`

## Summary

Build a dedicated spaced repetition learning platform for HAM radio licence preparation. The
platform parses existing markdown course content, splits it into 5-10 minute segments, presents
pre-authored questions for active recall, and schedules reviews using the SM-2 algorithm. All
progress is stored locally in the browser for offline-first operation.

## Technical Context

**Language/Version**: JavaScript (ES6+), HTML5, CSS3 - browser-native with minimal build step
**Primary Dependencies**: KaTeX (formula rendering), Marked.js (markdown parsing), vanilla JS for SRS
**Storage**: Browser localStorage for progress; content bundled as static JSON
**Testing**: Manual browser testing for MVP; Playwright for future E2E tests
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
**Project Type**: Static web application (single-page app pattern)
**Performance Goals**: Page load < 3s, instant navigation, < 100KB JS total
**Constraints**: Offline-capable after first load, no server required, mobile-responsive
**Scale/Scope**: Single user, 18 lessons split into ~40-50 segments, ~200 questions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Dead Simple | No feature requires manual | PASS | 2-click daily session start, obvious UI |
| II. Learner First | Progressive structure | PASS | Segments ordered by curriculum, SRS prioritizes weak areas |
| III. Math Formulas | LaTeX/KaTeX rendering | PASS | KaTeX library included |
| IV. Daily Practice | 2-click access, progress tracked | PASS | Core feature - reviews first, then 1 new segment |
| V. Knowledge Validation | Spaced repetition, immediate feedback | PASS | SM-2 algorithm, pre-authored questions |
| VI. Local-First | Offline after setup | PASS | Static site + localStorage, no server |
| VII. Open Source | Documentation, clear license | PASS | Existing CC BY-NC-SA 4.0 |

**Gate Result**: PASS - All constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/002-spaced-repetition-learning/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API, local-only)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── index.html           # Main entry point
├── css/
│   └── styles.css       # Application styles
├── js/
│   ├── main.js          # Application bootstrap
│   ├── srs.js           # SM-2 spaced repetition logic
│   ├── storage.js       # localStorage wrapper
│   ├── renderer.js      # Content and question rendering
│   └── session.js       # Daily session management
└── assets/
    └── katex/           # KaTeX library files

content/
├── segments/            # Generated JSON: lesson segments
│   ├── 01-introduction.json
│   ├── 02-classes-emission.json
│   └── ...
├── questions/           # Pre-authored questions per segment
│   ├── 01-introduction.json
│   └── ...
└── manifest.json        # Content index and metadata

build/
├── build.js             # Content processor script
└── output/              # Generated static site

src/                     # Existing mdbook content (input, read-only)
├── introduction.md
├── classes_emission.md
└── ...
```

**Structure Decision**: Static web application with build-time content processing. The `app/`
directory contains the runtime application. The `content/` directory holds processed segments
and pre-authored questions. A simple Node.js build script transforms source markdown into
segment JSON files. Final output deployed to `build/output/` as a self-contained static site.

## Complexity Tracking

No violations. The approach uses:
- Minimal vanilla JavaScript (no frameworks)
- Browser-native localStorage
- Static file hosting (GitHub Pages compatible)
- Build step limited to content transformation (markdown → JSON)
