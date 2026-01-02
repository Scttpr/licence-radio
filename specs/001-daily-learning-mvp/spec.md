# Feature Specification: Daily Learning MVP

**Feature Branch**: `001-daily-learning-mvp`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "I want a MVP to be able to follow all the content available in the documentation as a learning platform for everyday uses. My goal is to work everyday to get the lesson as fast as possible"

## User Scenarios & Testing

### User Story 1 - Access Daily Lesson (Priority: P1)

As a learner, I want to quickly access my next lesson so that I can continue my daily study
without friction.

**Why this priority**: This is the core functionality - without easy lesson access, the
platform has no value. Aligns with Constitution Principle IV (Daily Practice Flow) requiring
2-click access.

**Independent Test**: Can be fully tested by opening the learning platform and navigating to
the next lesson. Delivers immediate value by enabling structured daily study.

**Acceptance Scenarios**:

1. **Given** a learner opens the platform, **When** they are on the home page, **Then** they
   see a clear "Continue Learning" or "Next Lesson" action that is immediately visible.
2. **Given** a learner has not started the course, **When** they click the main action,
   **Then** they are taken to the first lesson (Introduction).
3. **Given** a learner has completed some lessons, **When** they click the main action,
   **Then** they are taken to the next unread lesson in the curriculum order.

---

### User Story 2 - Track Learning Progress (Priority: P2)

As a learner, I want to see my progress through the course so that I know how much I have
completed and how much remains.

**Why this priority**: Progress visibility motivates daily practice and helps learners
understand their position in the curriculum. Supports Constitution Principle IV.

**Independent Test**: Can be tested by completing a lesson and verifying the progress
indicator updates accordingly.

**Acceptance Scenarios**:

1. **Given** a learner views the course overview, **When** they look at the lesson list,
   **Then** they see checkmark icons next to completed lessons; lessons without checkmarks
   are either in-progress (visited) or not started.
2. **Given** a learner scrolls to the bottom of a lesson, **When** the bottom content is
   visible, **Then** the lesson is automatically marked complete and a checkmark appears.
3. **Given** a learner returns to the platform, **When** they view their progress, **Then**
   their previous progress is preserved and displayed accurately.

---

### User Story 3 - Navigate Lesson Structure (Priority: P3)

As a learner, I want to browse the full curriculum structure so that I can understand the
learning path and optionally jump to specific topics.

**Why this priority**: While sequential learning is primary, learners need visibility into
the full course structure. Supports both daily flow and topic review needs.

**Independent Test**: Can be tested by navigating through the table of contents and
accessing any lesson directly.

**Acceptance Scenarios**:

1. **Given** a learner is on any page, **When** they access the navigation menu, **Then**
   they see the complete course structure organized by sections (Réglementation, Technique -
   Bases, Technique - Composants, Technique - Radioélectricité, Ressources).
2. **Given** a learner clicks on a specific lesson in the navigation, **When** the page
   loads, **Then** they see the full lesson content with any mathematical formulas rendered
   correctly.
3. **Given** a learner is reading a lesson, **When** they want to move to the next or
   previous lesson, **Then** they can do so with a single click using navigation controls.

---

### User Story 4 - Review Previously Learned Content (Priority: P4)

As a learner, I want to easily revisit lessons I have already completed so that I can
reinforce my knowledge before the exam.

**Why this priority**: Supports Constitution Principle V (Knowledge Validation) - learners
must validate previous knowledge. Essential for exam preparation but secondary to initial
learning flow.

**Independent Test**: Can be tested by accessing a completed lesson and verifying it
displays with completion status visible.

**Acceptance Scenarios**:

1. **Given** a learner has completed several lessons, **When** they view the course
   structure, **Then** completed lessons are clearly marked but remain accessible.
2. **Given** a learner clicks on a completed lesson, **When** the page loads, **Then** they
   see the full lesson content and can review it freely.
3. **Given** a learner is reviewing a lesson, **When** they finish reviewing, **Then** they
   can return to their current position in the course with one click.

---

### Edge Cases

- What happens when the learner completes all lessons? Display a congratulations message
  and provide access to the annexes/formula sheet for exam preparation.
- How does the system handle lessons with complex mathematical formulas? Formulas are
  rendered using standard notation (LaTeX/KaTeX) per Constitution Principle III.
- What happens if local storage is cleared? Progress is lost; learner starts fresh.
  (Acceptable for MVP - no server-side persistence)

## Requirements

### Functional Requirements

- **FR-001**: System MUST display a clear primary action to access the next lesson from
  the home/landing page.
- **FR-002**: System MUST track lesson states using a binary model: visited (in-progress)
  and completed (scroll-to-bottom detected), persisted locally.
- **FR-003**: System MUST display checkmark icons next to completed lessons in the
  navigation menu.
- **FR-004**: System MUST render mathematical formulas correctly using standard
  mathematical notation.
- **FR-005**: System MUST provide navigation controls (next/previous) within lessons.
- **FR-006**: System MUST display the full course structure (17 lessons across 5 sections)
  in a navigable format.
- **FR-007**: System MUST preserve progress across browser sessions using local storage.
- **FR-008**: System MUST work fully offline after initial page load (per Constitution
  Principle VI).
- **FR-009**: System MUST resume learner at their current lesson page (top of lesson) when
  returning to the platform.

### Key Entities

- **Lesson**: A single learning unit (e.g., "Lois d'Ohm et de Joule"). Attributes: title,
  section, order in curriculum, content, completion status.
- **Section**: A grouping of related lessons (e.g., "Technique - Bases d'électricité").
  Contains 3-6 lessons.
- **Progress**: The learner's state in the course. Tracks: current lesson (for resume),
  set of visited lessons, set of completed lessons, last accessed timestamp.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Learners can reach their next lesson within 2 clicks from opening the
  platform.
- **SC-002**: Progress indicators accurately reflect lesson completion status 100% of the
  time after page refresh.
- **SC-003**: Mathematical formulas display correctly and legibly on desktop and mobile
  screens.
- **SC-004**: The platform loads and functions completely offline after the first visit.
- **SC-005**: Learners can navigate through all 17 lessons in curriculum order without
  errors.
- **SC-006**: Daily study sessions of 15-30 minutes are supported without friction (no
  re-login, no lost progress, no slow loads).

## Clarifications

### Session 2026-01-01

- Q: How should a lesson be marked as completed? → A: Automatic scroll-to-bottom detection
- Q: What defines "in-progress" status? → A: Visited but not completed (binary model)
- Q: Resume behavior on return? → A: Resume at lesson page (top of lesson)
- Q: Progress display style in navigation? → A: Checkmark icons next to completed lessons

## Assumptions

- The learner uses a modern browser with JavaScript and local storage enabled.
- The existing mdbook-generated content structure will be enhanced rather than replaced.
- Single user per browser instance (no multi-user/account system for MVP).
- Progress tracking is local-only; no cloud sync or backup for MVP.
- Mobile responsiveness is expected but native apps are out of scope.
