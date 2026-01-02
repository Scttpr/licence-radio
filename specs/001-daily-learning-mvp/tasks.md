# Tasks: Daily Learning MVP

**Input**: Design documents from `/specs/001-daily-learning-mvp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Not requested - manual browser testing only per plan.md

**Organization**: Tasks are grouped by user story to enable independent implementation
and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

This is a static site enhancement project (mdbook customization):
- Theme files: `theme/css/`, `theme/js/`
- Configuration: `book.toml`
- Content: `src/` (existing, not modified)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create theme directory structure and configure mdbook for custom assets

- [x] T001 Create theme directory structure: `theme/css/` and `theme/js/`
- [x] T002 Update `book.toml` to include additional-css and additional-js references
- [x] T003 [P] Create empty `theme/css/progress.css` placeholder file
- [x] T004 [P] Create empty `theme/js/progress.js` placeholder file
- [x] T005 Verify mdbook builds successfully with new theme structure: `mdbook build`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core progress tracking infrastructure that ALL user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement localStorage wrapper functions in `theme/js/progress.js`:
  - `getProgress()`: Initialize or retrieve progress from localStorage
  - `saveProgress(progress)`: Save progress to localStorage with try-catch
  - `initializeProgress()`: Create default progress structure (version, lessons map)
- [x] T007 Implement lesson ID extraction in `theme/js/progress.js`:
  - `getCurrentLessonId()`: Extract lesson ID from current page URL
  - `LESSON_ORDER`: Define array of lesson IDs in curriculum order (from SUMMARY.md)
- [x] T008 Implement page initialization in `theme/js/progress.js`:
  - `DOMContentLoaded` event listener
  - Mark current lesson as visited on page load
  - Update `currentLesson` in progress state
- [x] T009 Add base CSS variables and utility classes in `theme/css/progress.css`:
  - Checkmark icon styles (`.checkmark`)
  - Completed lesson indicator (`.completed`)
  - Continue button base styles (`.continue-btn`)

**Checkpoint**: Foundation ready - localStorage works, lesson detection works, base styles exist

---

## Phase 3: User Story 1 - Access Daily Lesson (Priority: P1)

**Goal**: Learner can access their next lesson within 2 clicks from home page

**Independent Test**: Open site → Click "Continue Learning" → Lands on correct lesson

### Implementation for User Story 1

- [x] T010 [US1] Implement `getNextLesson()` function in `theme/js/progress.js`:
  - Iterate through LESSON_ORDER array
  - Return first lesson ID where `completed` is false or no entry exists
  - Return null if all lessons complete
- [x] T011 [US1] Implement `injectContinueButton()` function in `theme/js/progress.js`:
  - Check if on introduction/home page
  - Get next lesson target from `getNextLesson()`
  - Create and inject "Continue Learning" button element
  - Set href to next lesson path
- [x] T012 [US1] Add Continue Learning button styles in `theme/css/progress.css`:
  - Prominent button styling (size, color, position)
  - Hover/focus states for accessibility
  - Mobile-responsive sizing
- [x] T013 [US1] Implement course completion handling in `theme/js/progress.js`:
  - If `getNextLesson()` returns null, show congratulations message
  - Link to annexes page for exam preparation

**Checkpoint**: User Story 1 complete - 2-click access to next lesson works

---

## Phase 4: User Story 2 - Track Learning Progress (Priority: P2)

**Goal**: Learner sees checkmarks next to completed lessons in sidebar

**Independent Test**: Complete a lesson → Refresh → Checkmark visible in sidebar

### Implementation for User Story 2

- [x] T014 [US2] Implement scroll-to-bottom detection in `theme/js/progress.js`:
  - Create sentinel element at end of main content
  - Setup IntersectionObserver with threshold 1.0
  - Call `markLessonComplete()` when sentinel intersects
  - Unobserve after first trigger
- [x] T015 [US2] Implement `markLessonComplete(lessonId)` function in `theme/js/progress.js`:
  - Update lesson entry with `completed: true, completedAt: Date.now()`
  - Save progress to localStorage
  - Trigger UI update
- [x] T016 [US2] Implement `updateSidebarProgress()` function in `theme/js/progress.js`:
  - Query all sidebar lesson links (`.chapter li a`)
  - For each completed lesson, add `.completed` class
  - Inject checkmark span element (`<span class="checkmark">✓</span>`)
- [x] T017 [US2] Add checkmark icon styles in `theme/css/progress.css`:
  - Green checkmark color
  - Proper spacing next to lesson title
  - Visibility on both light and dark themes

**Checkpoint**: User Story 2 complete - scroll completion + checkmarks work

---

## Phase 5: User Story 3 - Navigate Lesson Structure (Priority: P3)

**Goal**: Learner can browse full curriculum and navigate between lessons

**Independent Test**: Click any lesson in sidebar → Content loads → Next/Prev work

### Implementation for User Story 3

- [x] T018 [US3] Verify existing mdbook navigation in sidebar displays all sections:
  - Réglementation (5 lessons)
  - Technique - Bases d'électricité (5 lessons)
  - Technique - Composants actifs (2 lessons)
  - Technique - Radioélectricité (6 lessons)
  - Ressources (1 lesson)
- [x] T019 [US3] Verify mdbook next/previous navigation controls work:
  - Previous lesson button functional
  - Next lesson button functional
  - Proper lesson ordering maintained
- [x] T020 [US3] Enhance navigation state tracking in `theme/js/progress.js`:
  - Update `currentLesson` on every page navigation
  - Ensure sidebar highlights current lesson

**Checkpoint**: User Story 3 complete - full navigation works with progress tracking

---

## Phase 6: User Story 4 - Review Previously Learned Content (Priority: P4)

**Goal**: Learner can revisit completed lessons and return to current position

**Independent Test**: Complete lessons → Click completed lesson → Review → Return

### Implementation for User Story 4

- [x] T021 [US4] Ensure completed lessons remain clickable in `theme/js/progress.js`:
  - Do not disable or hide completed lesson links
  - Completed class should style but not block access
- [x] T022 [US4] Implement "Return to Current Lesson" feature in `theme/js/progress.js`:
  - When viewing a completed lesson, show return button
  - Link to `currentLesson` from progress state
- [x] T023 [US4] Add return button styles in `theme/css/progress.css`:
  - Subtle but visible return action
  - Position that doesn't interfere with content
  - Mobile-friendly touch target

**Checkpoint**: User Story 4 complete - review + return flow works

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T024 [P] Verify offline functionality: load site, disconnect, navigate lessons
- [x] T025 [P] Verify localStorage persistence: complete lessons, close browser, reopen
- [x] T026 [P] Test on mobile viewport: all buttons accessible, checkmarks visible
- [x] T027 Run quickstart.md validation checklist
- [x] T028 Clean up any console.log statements in `theme/js/progress.js`
- [x] T029 Verify dark theme compatibility for all progress indicators

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2
- **User Story 2 (Phase 4)**: Depends on Phase 2 (can run parallel with US1)
- **User Story 3 (Phase 5)**: Depends on Phase 2 (mostly verification)
- **User Story 4 (Phase 6)**: Depends on Phase 2 + US2 (needs completion tracking)
- **Polish (Phase 7)**: Depends on all user stories

### User Story Dependencies

- **US1 (Access Daily Lesson)**: Independent after Foundational
- **US2 (Track Progress)**: Independent after Foundational
- **US3 (Navigate Structure)**: Independent after Foundational (mostly mdbook native)
- **US4 (Review Content)**: Requires US2 (needs completion tracking to identify "completed" lessons)

### Within Each Phase

Tasks without [P] marker must be executed sequentially.
Tasks with [P] marker can run in parallel within the same phase.

### Parallel Opportunities

- T003 + T004 can run in parallel (different files)
- T024 + T025 + T026 can run in parallel (independent verification)

---

## Parallel Example: Setup Phase

```bash
# After T001 and T002 complete, launch in parallel:
Task: "Create empty theme/css/progress.css placeholder file"
Task: "Create empty theme/js/progress.js placeholder file"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Access Daily Lesson)
4. **STOP and VALIDATE**: Test 2-click access works
5. Deploy if ready - learners can start using immediately

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. User Story 1 → Deploy MVP (2-click access)
3. User Story 2 → Deploy (adds checkmarks)
4. User Story 3 → Deploy (verify navigation)
5. User Story 4 → Deploy (adds review flow)
6. Polish → Final release

### Single Developer Strategy

Execute phases sequentially in order. Each user story builds on previous.
Commit after each task or logical group. Test at each checkpoint.

---

## Notes

- All code goes in 2 files: `theme/js/progress.js` and `theme/css/progress.css`
- No build step required - vanilla JS/CSS
- Test in browser console during development
- Use `localStorage.removeItem('radioLicenceProgress')` to reset progress
- mdbook already provides sidebar, navigation, KaTeX - leverage existing features
