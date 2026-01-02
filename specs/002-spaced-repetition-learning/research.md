# Research: Spaced Repetition Learning Platform

**Feature**: 002-spaced-repetition-learning
**Date**: 2026-01-01

## Research Areas

### 1. SM-2 Spaced Repetition Algorithm

**Decision**: Implement SM-2 algorithm with slight modifications for web context

**Rationale**: SM-2 is the foundational algorithm behind Anki and most modern SRS systems. It's
well-documented, battle-tested, and provides the right balance of complexity vs effectiveness
for our single-user learning platform.

**Algorithm Summary**:
- Each card has: interval (days), ease factor (EF, default 2.5), repetition count
- After correct answer: interval = previous_interval × EF
- After incorrect answer: interval resets to 1 day, EF reduced
- Quality rating (0-5) affects EF adjustment

**Modifications for this project**:
- Simplify to 4 quality levels: Again (0), Hard (2), Good (4), Easy (5)
- Store dates as Unix timestamps for localStorage compatibility
- Add consecutive correct count for mastery tracking (per spec: mastered at 3)

**Alternatives Considered**:
- Leitner System: Simpler but less adaptive; rejected for inferior retention outcomes
- FSRS (Free Spaced Repetition Scheduler): More modern but significantly more complex;
  rejected as over-engineering for ~200 questions
- Anki integration: Would require Anki installation; rejected per local-first principle

---

### 2. Markdown Parsing and Content Segmentation

**Decision**: Use Marked.js for parsing, custom segmentation by heading structure

**Rationale**: Marked.js is lightweight (~35KB), well-maintained, and handles GitHub-flavored
markdown including tables. Segmentation will split content at H2/H3 boundaries to create
natural learning chunks.

**Segmentation Strategy**:
1. Parse markdown to HTML using Marked.js
2. Split at `## ` (H2) headings for major segments
3. If segment > 1500 words, further split at `### ` (H3) headings
4. Target: 800-1500 words per segment (~5-10 min reading time at 150 wpm)
5. Preserve LaTeX delimiters for KaTeX processing

**Content Transformation Pipeline**:
```
src/*.md → parse markdown → split by headings → extract metadata → JSON segments
```

**Alternatives Considered**:
- Remark/unified ecosystem: More powerful but heavier dependency chain
- Manual segmentation: More control but doesn't scale; rejected for maintenance burden
- mdbook's chapter structure: Already lesson-level; we need finer granularity

---

### 3. Formula Rendering with KaTeX

**Decision**: Bundle KaTeX with auto-render extension for inline and block math

**Rationale**: KaTeX renders faster than MathJax (300x faster per benchmarks), has smaller
bundle size (~300KB with fonts), and works offline once loaded. The existing mdbook content
already uses LaTeX syntax (`$...$` and `$$...$$`).

**Implementation**:
- Include KaTeX CSS and JS in app/assets/
- Use auto-render to process `$...$` (inline) and `$$...$$` (block) after content load
- Pre-process during build to validate all formulas parse correctly

**Alternatives Considered**:
- MathJax: Slower rendering, larger bundle; rejected for performance
- Server-side rendering: Would require build-time processing; considered but adds complexity
- ASCII math: Not suitable for technical formulas; rejected

---

### 4. Question Format and Storage

**Decision**: JSON format with question types, co-located with segment files

**Rationale**: JSON is native to JavaScript, easy to edit manually for pre-authored questions,
and can be validated at build time. Co-locating questions with segments simplifies the
content authoring workflow.

**Question Schema**:
```json
{
  "segmentId": "01-introduction-01",
  "questions": [
    {
      "id": "q001",
      "type": "multiple_choice",
      "prompt": "Question text with $formula$ support",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "Why A is correct..."
    },
    {
      "id": "q002",
      "type": "true_false",
      "prompt": "Statement to evaluate",
      "correct": true,
      "explanation": "Explanation..."
    }
  ]
}
```

**Alternatives Considered**:
- Markdown with frontmatter: Harder to validate; rejected
- SQLite: Overkill for ~200 questions; rejected per simplicity principle
- Embedded in segment JSON: Considered but separating allows independent updates

---

### 5. Offline Capability

**Decision**: Service Worker with cache-first strategy for static assets

**Rationale**: Service Workers enable true offline functionality after first load. Cache-first
ensures instant loads for returning users. All content is static and can be fully cached.

**Implementation**:
- Register service worker on first load
- Cache: index.html, CSS, JS, KaTeX assets, all segment/question JSON files
- Update strategy: Check for manifest version on each visit; prompt user if update available
- Fallback: App works without service worker (just no offline support)

**Cache Size Estimate**:
- App code: ~100KB
- KaTeX: ~300KB
- Content (50 segments × 5KB avg): ~250KB
- Questions (50 files × 2KB avg): ~100KB
- Total: ~750KB (well within browser cache limits)

**Alternatives Considered**:
- Application Cache (deprecated): No longer supported; rejected
- IndexedDB for content: Adds complexity for no benefit; rejected
- No offline: Violates constitution principle VI; rejected

---

### 6. Progress Storage Schema

**Decision**: Single localStorage key with versioned JSON structure

**Rationale**: Single key simplifies backup/restore and version migration. JSON allows
structured data. Version field enables future schema migrations.

**Storage Schema**:
```json
{
  "version": 1,
  "lastAccessed": 1704067200000,
  "session": {
    "inProgress": false,
    "currentSegment": null,
    "reviewQueue": [],
    "completedToday": []
  },
  "cards": {
    "q001": {
      "interval": 4,
      "easeFactor": 2.5,
      "dueDate": 1704326400000,
      "repetitions": 3,
      "consecutiveCorrect": 2,
      "state": "reviewing"
    }
  },
  "segments": {
    "01-introduction-01": {
      "completed": true,
      "completedAt": 1704153600000
    }
  }
}
```

**Storage Key**: `hamRadioLearning`

**Alternatives Considered**:
- Multiple localStorage keys: Harder to manage atomically; rejected
- IndexedDB: More powerful but overkill for single-user; rejected
- File-based export: Good for backup but not primary storage; will add as feature

---

### 7. UI Framework Decision

**Decision**: Vanilla JavaScript with ES6 modules, no framework

**Rationale**: The application has a simple UI (content display, question cards, progress
dashboard). A framework would add unnecessary complexity and bundle size. Vanilla JS with
modern features (modules, template literals, classes) provides sufficient structure.

**UI Components** (implemented as JS modules):
- `ContentView`: Displays segment content with KaTeX rendering
- `QuestionCard`: Shows question, captures answer, displays feedback
- `ProgressDashboard`: Mastery levels, section progress, exam readiness
- `SessionManager`: Orchestrates daily session flow

**Alternatives Considered**:
- React/Vue/Svelte: Overkill for this scope; violates constitution performance principle
- Lit/Web Components: Reasonable but adds learning curve; rejected for simplicity
- jQuery: Outdated patterns; rejected

---

## Summary of Technical Decisions

| Area | Decision | Key Rationale |
|------|----------|---------------|
| SRS Algorithm | SM-2 (modified) | Well-proven, appropriate complexity |
| Markdown Parser | Marked.js | Lightweight, GFM support |
| Math Rendering | KaTeX | Fast, offline-capable |
| Question Format | JSON files | Native JS, easy authoring |
| Offline | Service Worker | True offline per constitution |
| Storage | localStorage (JSON) | Simple, sufficient for scope |
| UI | Vanilla JS | No framework overhead |

All technical decisions align with Constitution principles, particularly:
- **Dead Simple**: No frameworks, minimal dependencies
- **Local-First**: Everything works offline
- **Performance**: Small bundle, fast rendering
