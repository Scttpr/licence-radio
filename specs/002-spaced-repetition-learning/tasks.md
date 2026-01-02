# Tasks: Spaced Repetition Learning Platform

**Input**: Design documents from `/specs/002-spaced-repetition-learning/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Not requested - manual browser testing only per plan.md

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

This is a static web application:
- Application: `app/` (index.html, css/, js/, assets/)
- Content: `content/` (segments/, questions/, manifest.json)
- Build: `build/` (build.js, output/)
- Source: `src/` (existing mdbook content, read-only)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create project structure, install dependencies, configure build tools

- [ ] T001 Create application directory structure: `app/`, `app/css/`, `app/js/`, `app/assets/`
- [ ] T002 Create content directory structure: `content/`, `content/segments/`, `content/questions/`
- [ ] T003 Create build directory structure: `build/`, `build/output/`
- [ ] T004 Initialize npm project with `package.json` in repository root
- [ ] T005 [P] Install Marked.js dependency: `npm install marked`
- [ ] T006 [P] Install KaTeX dependency: `npm install katex`
- [ ] T007 Copy KaTeX assets to `app/assets/katex/` from node_modules
- [ ] T008 Create base `app/index.html` with HTML structure, CSS/JS links, KaTeX include
- [ ] T009 [P] Create empty `app/css/styles.css` with CSS reset and variables
- [ ] T010 [P] Create empty module files: `app/js/main.js`, `app/js/storage.js`, `app/js/srs.js`, `app/js/renderer.js`, `app/js/session.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Implement localStorage wrapper in `app/js/storage.js`:
  - `getState()`: Initialize or retrieve AppState from localStorage
  - `saveState(state)`: Save AppState to localStorage with try-catch
  - `initializeState()`: Create default AppState structure per data-model.md
  - `resetProgress()`: Clear all progress data with confirmation
- [ ] T012 Implement content loading in `app/js/storage.js`:
  - `loadManifest()`: Fetch and parse `content/manifest.json`
  - `loadSegment(segmentId)`: Fetch segment JSON file
  - `loadQuestions(segmentId)`: Fetch questions JSON file
- [ ] T013 Implement SM-2 algorithm core in `app/js/srs.js`:
  - `calculateNextReview(card, quality)`: Compute interval and ease factor
  - `updateCard(card, quality)`: Apply SM-2 update to card
  - Quality levels: 'again' (0), 'hard' (2), 'good' (4), 'easy' (5)
- [ ] T014 Implement card state management in `app/js/srs.js`:
  - `createCard(questionId)`: Initialize new card with default values
  - `getDueCards(state)`: Return all cards with dueDate <= today
  - `updateMasteryState(card)`: Transition between new/learning/reviewing/mastered
- [ ] T015 Implement KaTeX rendering in `app/js/renderer.js`:
  - `renderMath(element)`: Process $...$ and $$...$$ with KaTeX auto-render
  - Handle KaTeX errors gracefully (show raw LaTeX if parse fails)
- [ ] T016 Implement application bootstrap in `app/js/main.js`:
  - Initialize storage on DOMContentLoaded
  - Load manifest and verify content availability
  - Route to appropriate view (session, dashboard, etc.)
- [ ] T017 Create build script `build/build.js`:
  - Parse `src/SUMMARY.md` to extract course structure
  - Read each markdown file from `src/`
  - Split content by H2/H3 headings into segments (target 800-1500 words)
  - Generate segment JSON files in `content/segments/`
  - Generate `content/manifest.json` with full content index
- [ ] T018 Run build script and verify segment generation:
  - Execute `node build/build.js`
  - Verify manifest.json created with correct structure
  - Verify segment files created for each lesson
  - Confirm total segment count is 40-50 (if outside range, adjust splitting thresholds in build.js)

**Checkpoint**: Foundation ready - storage works, SRS algorithm works, content builds

---

## Phase 3: User Story 1 - Daily Learning Session (Priority: P1)

**Goal**: Learner can start a daily session that presents reviews first, then 1 new segment

**Independent Test**: Open app → Click "Start Session" → See reviews (if any) → See new segment → Answer questions

### Implementation for User Story 1

- [ ] T019 [US1] Implement session initialization in `app/js/session.js`:
  - `startSession(state, manifest)`: Create or resume today's session
  - Check if session exists for today's date
  - If resuming: restore reviewQueue, newSegment state
  - If new: build reviewQueue from getDueCards(), cap at 50
- [ ] T020 [US1] Implement session flow control in `app/js/session.js`:
  - `getNextItem(session, state)`: Return next review card, segment, or question
  - `completeItem(session, result)`: Update session state after item completed
  - `isSessionComplete(session)`: Check if all reviews done and segment completed
- [ ] T021 [US1] Implement session phase transitions in `app/js/session.js`:
  - 'review' phase: Process reviewQueue until empty (max 50)
  - 'learn' phase: Present 1 new segment if not already done today
  - 'complete' phase: Session finished for today
- [ ] T022 [US1] Implement home view in `app/js/renderer.js`:
  - `renderHomeView(state, manifest)`: Show welcome and "Start Session" button
  - Display quick stats: streak, cards due today, progress %
  - 2-click access to session (open app = click 1, start session = click 2)
- [ ] T023 [US1] Implement session resumption in `app/js/session.js`:
  - Persist session state to localStorage on each item completion
  - On app load: detect incomplete session, offer to resume
  - `resumeSession(state)`: Restore session from saved state
- [ ] T024 [US1] Wire up main.js routing for home and session views:
  - Default route: home view with Start Session button
  - Session route: active session flow
  - Auto-redirect to session if incomplete session exists

**Checkpoint**: User Story 1 complete - daily session with reviews-first flow works

---

## Phase 4: User Story 2 - Content Consumption (Priority: P2)

**Goal**: Learner can read lesson segments with proper formatting and KaTeX rendering

**Independent Test**: Navigate to any segment → Content displays → Formulas render → Click Continue to proceed

### Implementation for User Story 2

- [ ] T025 [US2] Implement segment view in `app/js/renderer.js`:
  - `renderSegment(segment, container)`: Display segment title and content
  - Apply KaTeX rendering to math expressions
  - Add "Continue" button at bottom
  - Show reading progress indicator (segment X of Y in lesson)
- [ ] T026 [US2] Add segment navigation in `app/js/renderer.js`:
  - Track segment completion (scroll or explicit Continue click)
  - Update SegmentProgress in state when completed
  - Navigate to questions after segment completion
- [ ] T027 [US2] Add segment styling in `app/css/styles.css`:
  - Typography for lesson content (readable fonts, line height)
  - Code block and table styling
  - Formula display (inline and block)
  - Mobile-responsive layout
- [ ] T028 [US2] Implement segment completion tracking in `app/js/storage.js`:
  - `markSegmentCompleted(segmentId)`: Update SegmentProgress
  - Record completedAt timestamp
  - Save state after completion

**Checkpoint**: User Story 2 complete - content displays beautifully with math support

---

## Phase 5: User Story 3 - Active Recall via Questions (Priority: P2)

**Goal**: Learner answers questions with immediate feedback after completing a segment

**Independent Test**: Complete segment → Questions appear → Answer → See feedback with explanation

### Implementation for User Story 3

- [ ] T029 [US3] Implement question card view in `app/js/renderer.js`:
  - `renderQuestion(question, onAnswer)`: Display question prompt and options
  - Support multiple choice: 4 clickable option buttons
  - Support true/false: 2 clickable buttons
  - Apply KaTeX to prompt and options if they contain math
- [ ] T030 [US3] Implement answer feedback in `app/js/renderer.js`:
  - `renderFeedback(question, selectedAnswer, wasCorrect)`: Show result
  - Highlight correct answer in green, wrong answer in red
  - Display explanation text
  - Show "Next" button to proceed
- [ ] T031 [US3] Implement question flow in `app/js/session.js`:
  - After segment completion: present segment's questions in order
  - Track which questions answered in current session
  - Create/update cards for each answered question
- [ ] T032 [US3] Implement answer processing in `app/js/srs.js`:
  - `processAnswer(questionId, wasCorrect, state)`: Update card state
  - If new question: create card with initial values
  - Apply SM-2 algorithm based on correct/incorrect
  - Update mastery state (consecutiveCorrect counter)
- [ ] T033 [US3] Add question styling in `app/css/styles.css`:
  - Question card layout (centered, readable)
  - Option buttons (large touch targets, clear hover states)
  - Feedback colors (success green, error red)
  - Explanation box styling

**Checkpoint**: User Story 3 complete - questions work with immediate feedback and SRS tracking

---

## Phase 6: User Story 4 - Progress Dashboard (Priority: P3)

**Goal**: Learner sees overall progress, section mastery, and exam readiness indicator

**Independent Test**: Open dashboard → See section progress bars → See mastery levels → See streak stats

### Implementation for User Story 4

- [ ] T034 [US4] Implement stats calculation in `app/js/srs.js`:
  - `calculateSectionStats(sectionId, state, manifest)`: Compute mastery for section
  - `calculateOverallStats(state, manifest)`: Aggregate all sections
  - `isExamReady(state)`: Check if all sections reach mastery threshold (80%)
- [ ] T035 [US4] Implement dashboard view in `app/js/renderer.js`:
  - `renderDashboard(state, manifest)`: Full progress dashboard
  - Section-by-section progress bars with mastery %
  - Per-topic breakdown within each section
  - Streak counter and total sessions
- [ ] T036 [US4] Implement mastery visualization in `app/js/renderer.js`:
  - Color-coded mastery levels: learning (yellow), reviewing (blue), mastered (green)
  - Progress bars for each section
  - "Exam Ready" badge when overall mastery > 80%
- [ ] T037 [US4] Add dashboard navigation in `app/js/main.js`:
  - Add dashboard link/button to home view
  - Route handling for dashboard view
  - Back navigation to home
- [ ] T038 [US4] Add dashboard styling in `app/css/styles.css`:
  - Progress bar components
  - Section cards layout
  - Mastery badges and colors
  - Stats grid layout

**Checkpoint**: User Story 4 complete - progress tracking and visualization work

---

## Phase 7: User Story 5 - Topic-Based Review (Priority: P4)

**Goal**: Learner can select a weak topic and do focused review of that topic's questions

**Independent Test**: Open dashboard → Click weak topic → Answer topic questions → See updated mastery

### Implementation for User Story 5

- [ ] T039 [US5] Implement topic selection in `app/js/renderer.js`:
  - Make dashboard topic items clickable
  - Show "Review This Topic" button for topics with mastery < 80%
  - Pass selected topic to focused review mode
- [ ] T040 [US5] Implement focused review session in `app/js/session.js`:
  - `startTopicReview(sectionId, state)`: Create topic-focused review queue
  - Filter cards to only include selected section's questions
  - Prioritize cards with lower mastery states
- [ ] T041 [US5] Implement topic review flow in `app/js/session.js`:
  - Similar to daily session but limited to topic
  - No new content, only review
  - Update cards normally with SM-2
  - Return to dashboard when queue complete
- [ ] T042 [US5] Add topic review UI elements in `app/css/styles.css`:
  - Topic selection highlight
  - "Focused Review" mode indicator
  - Return to dashboard button

**Checkpoint**: User Story 5 complete - targeted topic review works

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, offline support, and cleanup

- [ ] T043 [P] Implement service worker in `app/sw.js`:
  - Cache-first strategy for all static assets
  - Cache app files, KaTeX assets, content JSON
  - Handle offline gracefully
- [ ] T044 Register service worker in `app/js/main.js`:
  - Check for service worker support
  - Register sw.js on first load
  - Handle update notifications
- [ ] T045 [P] Add progress export/import in `app/js/storage.js`:
  - `exportState()`: Download JSON backup of progress
  - `importState(json)`: Restore from backup file
  - Add UI buttons for export/import
- [ ] T046 [P] Add dark theme support in `app/css/styles.css`:
  - CSS variables for colors
  - `prefers-color-scheme` media query
  - Manual theme toggle option
- [ ] T047 Create sample questions for first 2 segments in `content/questions/`:
  - `content/questions/introduction-01.json`: 3-5 sample questions
  - `content/questions/classes_emission-01.json`: 3-5 sample questions
  - Follow question schema from data-model.md
- [ ] T048 [P] Verify offline functionality:
  - Load app with network
  - Disconnect network
  - Navigate, start session, answer questions
  - Verify all features work offline
- [ ] T049 [P] Verify localStorage persistence:
  - Complete some questions
  - Close browser completely
  - Reopen and verify progress preserved
- [ ] T050 [P] Test mobile responsiveness:
  - All buttons have 44px+ touch targets
  - Content readable on small screens
  - No horizontal scrolling
- [ ] T051 Run quickstart.md validation checklist
- [ ] T052 Build final output: copy app/ and content/ to build/output/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2
- **User Story 2 (Phase 4)**: Depends on Phase 2 (can run parallel with US1)
- **User Story 3 (Phase 5)**: Depends on Phase 2 + US2 (needs segment completion)
- **User Story 4 (Phase 6)**: Depends on Phase 2 + US3 (needs card data)
- **User Story 5 (Phase 7)**: Depends on US4 (needs dashboard)
- **Polish (Phase 8)**: Depends on all user stories

### User Story Dependencies

- **US1 (Daily Session)**: Independent after Foundational
- **US2 (Content)**: Independent after Foundational
- **US3 (Questions)**: Requires US2 (questions follow segment completion)
- **US4 (Dashboard)**: Requires US3 (needs card/mastery data to display)
- **US5 (Topic Review)**: Requires US4 (launched from dashboard)

### Parallel Opportunities

Within Phase 1:
- T005 + T006 (npm installs)
- T009 + T010 (empty file creation)

Within Phase 2:
- T011 + T015 (storage vs renderer)
- T013 + T014 (can develop together)

Across User Stories:
- US1 and US2 can proceed in parallel after Foundational

Within Phase 8:
- T043 + T045 + T046 (independent polish tasks)
- T048 + T049 + T050 (independent verification)

---

## Implementation Strategy

### MVP First (User Story 1 + 2 + 3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1 (daily session flow)
4. Complete Phase 4: User Story 2 (content display)
5. Complete Phase 5: User Story 3 (questions with feedback)
6. **STOP and VALIDATE**: Core learning loop works
7. Author questions for remaining segments
8. Deploy if ready

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. US1 + US2 + US3 → Core learning flow (MVP!)
3. US4 → Progress visualization
4. US5 → Targeted review
5. Polish → Offline, export, themes

### Single Developer Strategy

Execute phases sequentially in order. Each user story builds on previous.
Commit after each task or logical group. Test at each checkpoint.

---

## Notes

- All runtime code goes in `app/js/*.js` (5 modules)
- All styling in `app/css/styles.css` (single file)
- Content transformation via `build/build.js` (Node.js script)
- Questions must be manually authored in `content/questions/` (not auto-generated)
- Use `localStorage.removeItem('hamRadioLearning')` to reset progress during testing
- KaTeX must be loaded before any math rendering
- **Deferred to post-MVP**: FR-016 (fill-in-blank questions) and FR-017 (matching questions) - MVP supports multiple choice and true/false only
