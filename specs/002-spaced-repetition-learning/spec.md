# Feature Specification: Spaced Repetition Learning Platform

**Feature Branch**: `002-spaced-repetition-learning`
**Created**: 2026-01-01
**Status**: Draft
**Input**: User description: "A dedicated learning platform for HAM radio licence preparation that: 1) Splits existing course content into short, digestible lessons (5-10 min each), 2) Generates questions from the content for active recall, 3) Implements spaced repetition to review previous material daily, 4) Tracks mastery per topic. Goal: work everyday to pass the licence exam as fast as possible through active recall rather than passive reading."

## Clarifications

### Session 2026-01-01

- Q: How should questions be generated from content? → A: Pre-authored questions created manually alongside content
- Q: What triggers mastery state transitions? → A: Mastered after 3 consecutive correct answers
- Q: How much new content per daily session? → A: 1 new segment per session (after completing reviews)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Daily Learning Session (Priority: P1)

As a learner, I want to start a daily learning session that presents new content and reviews past material, so that I can maintain consistent progress toward my HAM licence exam.

**Why this priority**: This is the core value proposition - enabling daily active learning that combines new material with spaced review. Without this, the platform has no purpose.

**Independent Test**: Can be fully tested by opening the app, starting a daily session, and verifying it presents a mix of new content and review questions based on the learner's progress.

**Acceptance Scenarios**:

1. **Given** a learner with no previous progress, **When** they start a daily session, **Then** they see the first lesson content followed by 3-5 questions about that content
2. **Given** a learner who completed lessons yesterday, **When** they start a daily session, **Then** they see review questions for due items before any new content
3. **Given** a learner mid-session, **When** they close and reopen the app, **Then** they can resume exactly where they left off

---

### User Story 2 - Content Consumption (Priority: P2)

As a learner, I want to read short, focused lesson segments (5-10 minutes each), so that I can learn in manageable chunks that fit my schedule.

**Why this priority**: Learning content must be consumable before questions can be generated. This provides the foundation for active recall.

**Independent Test**: Can be fully tested by navigating to any lesson and verifying it displays properly segmented content with clear progression.

**Acceptance Scenarios**:

1. **Given** a lesson with multiple concepts, **When** the learner views it, **Then** it is split into segments of approximately 5-10 minutes reading time
2. **Given** a segment contains mathematical formulas, **When** displayed, **Then** formulas render correctly with proper notation
3. **Given** a learner completes a segment, **When** they click "Continue", **Then** they proceed to the next segment or to questions

---

### User Story 3 - Active Recall via Questions (Priority: P2)

As a learner, I want to answer questions about what I just learned, so that I can actively test my understanding and identify gaps.

**Why this priority**: Active recall is the core mechanism for effective learning. Questions must be answered immediately after content to maximize retention.

**Independent Test**: Can be fully tested by completing a lesson segment and verifying appropriate questions appear with immediate feedback.

**Acceptance Scenarios**:

1. **Given** a completed lesson segment, **When** questions appear, **Then** they directly relate to concepts from that segment
2. **Given** a question is displayed, **When** the learner answers, **Then** they receive immediate feedback (correct/incorrect with explanation)
3. **Given** an incorrect answer, **When** feedback is shown, **Then** the relevant concept is highlighted for review

---

### User Story 4 - Progress Dashboard (Priority: P3)

As a learner, I want to see my overall progress and mastery levels, so that I can understand how close I am to exam readiness.

**Why this priority**: Visual progress tracking motivates continued learning and helps learners identify weak areas.

**Independent Test**: Can be fully tested by completing several sessions and verifying the dashboard accurately reflects mastery levels and progress.

**Acceptance Scenarios**:

1. **Given** the learner has completed some lessons, **When** they view the dashboard, **Then** they see progress per section (Reglementation, Technique, etc.)
2. **Given** varying performance on questions, **When** viewing mastery, **Then** each topic shows a mastery level (e.g., learning, reviewing, mastered)
3. **Given** all lessons complete, **When** viewing the dashboard, **Then** an "exam ready" indicator appears when mastery thresholds are met

---

### User Story 5 - Topic-Based Review (Priority: P4)

As a learner, I want to review specific topics I'm struggling with, so that I can focus my study time on weak areas.

**Why this priority**: Targeted review enables efficient exam preparation by focusing effort where it's needed most.

**Independent Test**: Can be fully tested by selecting a topic with low mastery and verifying targeted review questions appear.

**Acceptance Scenarios**:

1. **Given** the dashboard shows weak topics, **When** the learner selects one, **Then** they enter a focused review session for that topic
2. **Given** a review session, **When** completed, **Then** mastery levels update based on performance

---

### Edge Cases

- What happens when a learner answers all questions correctly? Fast-track to next difficulty level, extend review intervals
- What happens when a learner consistently fails a concept? Reduce intervals, re-present the source content, flag for attention
- How does the system handle lessons with formulas that are hard to convert to questions? Include formula recognition and calculation questions
- What happens if the learner doesn't practice for several days? Accumulate overdue reviews, cap daily review count to prevent overwhelm
- How does the system handle the annexes (reference material)? Exclude from spaced repetition, make available as reference during study

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST parse existing markdown course content and split into segments of 5-10 minute reading time
- **FR-002**: System MUST present 3-5 pre-authored questions per lesson segment for active recall (questions are manually created alongside content)
- **FR-003**: System MUST implement spaced repetition scheduling (SM-2 algorithm or similar) for review timing
- **FR-004**: System MUST track mastery level per topic based on question performance (card transitions to "mastered" after 3 consecutive correct answers; resets to "learning" on incorrect answer)
- **FR-005**: System MUST present due review items before new content in daily sessions; limit new content to 1 segment per session
- **FR-006**: System MUST render mathematical formulas correctly (LaTeX/KaTeX support)
- **FR-007**: System MUST persist all progress and scheduling data locally
- **FR-008**: System MUST work completely offline after initial load
- **FR-009**: System MUST provide immediate feedback on question answers
- **FR-010**: System MUST display progress dashboard with section-level and topic-level mastery
- **FR-011**: System MUST allow targeted review of specific weak topics
- **FR-012**: System MUST support session resumption if interrupted
- **FR-013**: System MUST cap daily review items to prevent overwhelm (maximum 50 review items per session)

### Question Types

- **FR-014**: System MUST support multiple choice questions
- **FR-015**: System MUST support true/false questions
- **FR-016**: System SHOULD support fill-in-the-blank for formulas and key terms
- **FR-017**: System SHOULD support matching questions (e.g., Q-codes to meanings)

### Content Structure

The platform will process the following existing course structure:
- **Reglementation** (5 lessons): regulations, frequencies, Q-codes, operating conditions
- **Technique - Bases d'electricite** (5 lessons): math, Ohm's law, AC circuits, transformers
- **Technique - Composants actifs** (2 lessons): diodes, transistors
- **Technique - Radioelectricite** (6 lessons): amplifiers, op-amps, propagation, antennas, transmission lines, modulation
- **Annexes** (1 reference): formulas and resources (not part of spaced repetition)

### Key Entities

- **Lesson Segment**: A portion of course content sized for 5-10 minute reading; has title, content, parent lesson, order
- **Question**: An active recall item generated from segment content; has type, prompt, answer, explanation, difficulty
- **Card**: A spaced repetition item linking a question to scheduling data; has due date, interval, ease factor, repetition count, consecutive correct count (mastered at 3)
- **Topic**: A grouping of related segments for mastery tracking; maps to course sections
- **Learner Progress**: Aggregate state including completed segments, card states, mastery levels per topic
- **Session**: A daily learning instance combining due reviews and new content; tracks items presented and performance

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Learners can start a daily session within 2 clicks from app open
- **SC-002**: Average lesson segment reading time is between 5-10 minutes (measured by content length)
- **SC-003**: Questions achieve 80% relevance rating (questions directly test segment concepts)
- **SC-004**: System supports full offline functionality after initial content load
- **SC-005**: Learners can track progress across all 18 lessons and 5 sections
- **SC-006**: Mastery tracking shows meaningful differentiation (learning, reviewing, mastered states)
- **SC-007**: Review intervals follow spaced repetition principles (increasing intervals for correct answers)
- **SC-008**: Application loads and is interactive in under 3 seconds
- **SC-009**: 90% of learners can navigate the interface without instructions (dead simple design)

## Assumptions

- Existing markdown content from F6GPX course is authoritative and complete for exam preparation
- Learners have basic computer literacy (can use a web browser)
- Daily practice sessions target 15-30 minutes
- Questions are pre-authored manually alongside lesson content to ensure exam relevance and accuracy
- SM-2 or similar spaced repetition algorithm provides appropriate review scheduling
- French language interface matches course content language

## Out of Scope

- Exam simulation mode (full-length practice exams)
- Social features (leaderboards, study groups)
- Cloud sync across devices
- Adaptive difficulty based on learning patterns
- Audio/video content
- Mobile native apps (web-only for MVP)
