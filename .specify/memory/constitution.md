<!--
  SYNC IMPACT REPORT
  ==================
  Version change: 0.0.0 → 1.0.0 (initial ratification)

  Added principles:
  - I. Dead Simple
  - II. Learner Experience First
  - III. Math Formula Support
  - IV. Daily Practice Flow
  - V. Knowledge Validation
  - VI. Local-First Deployment
  - VII. Open Source Excellence

  Added sections:
  - Content Standards
  - Development Workflow
  - Governance

  Removed sections: None (initial version)

  Templates requiring updates:
  - .specify/templates/plan-template.md: N/A (no constitution-specific gates defined yet)
  - .specify/templates/spec-template.md: N/A (generic template compatible)
  - .specify/templates/tasks-template.md: N/A (generic template compatible)
  - .specify/templates/checklist-template.md: N/A (generic template compatible)
  - .specify/templates/agent-file-template.md: N/A (generic template compatible)

  Follow-up TODOs: None
-->

# Licence Radio Amateur Course Constitution

## Core Principles

### I. Dead Simple

All features, UI elements, and content MUST be immediately understandable without prior
training. Complexity is the enemy of learning.

- No feature requires a manual to use
- Navigation MUST be intuitive and consistent
- Configuration MUST have sensible defaults that work out of the box
- If a learner hesitates, the design has failed

**Rationale**: HAM licence candidates come from diverse technical backgrounds. Friction in
the learning tool directly impedes the learning goal.

### II. Learner Experience First

Every decision MUST prioritize the end-user's learning journey over developer convenience
or technical elegance.

- Content MUST be structured for progressive understanding
- No unnecessary jargon or unexplained acronyms
- Lessons MUST be concise and focused on exam-relevant material
- Nothing invented, nothing long without clear purpose

**Rationale**: The goal is accelerated HAM licence access, not comprehensive radio theory
education.

### III. Math Formula Support

Mathematical formulas MUST be rendered clearly and professionally using standard notation.

- Use LaTeX/KaTeX or equivalent for formula rendering
- Formulas MUST display correctly on all target platforms
- Complex equations MUST include step-by-step breakdowns when pedagogically useful
- Formula references MUST be easily accessible (e.g., formula sheets)

**Rationale**: Technical HAM content requires accurate representation of Ohm's law,
resonance formulas, impedance calculations, and similar mathematical concepts.

### IV. Daily Practice Flow

The system MUST facilitate a consistent daily learning habit with minimal friction.

- Accessing the next lesson MUST require no more than 2 clicks from the home state
- Daily progress MUST be visually tracked
- Session length SHOULD be optimized for 15-30 minute daily practice
- Lesson resumption MUST be seamless

**Rationale**: Consistent daily practice is more effective than sporadic intensive study
for exam preparation.

### V. Knowledge Validation

Learners MUST be able to validate both current and previous knowledge easily.

- Each lesson SHOULD include self-assessment opportunities
- Spaced repetition or similar review mechanisms MUST be available for past content
- Validation exercises MUST provide immediate feedback
- Progress tracking MUST distinguish between new learning and review

**Rationale**: Retention requires active recall. Passive reading is insufficient for exam
success.

### VI. Local-First Deployment

The system MUST be deployable and fully functional on a local machine without external
dependencies during use.

- Installation MUST be achievable with standard tooling (e.g., `cargo install mdbook`)
- Offline access MUST work completely after initial setup
- No mandatory cloud services, accounts, or telemetry
- All content MUST be bundled and accessible locally

**Rationale**: Learners may study in environments with limited or no internet access
(portable operations, remote locations).

### VII. Open Source Excellence

The project MUST exemplify open source best practices.

- Documentation MUST be comprehensive and up-to-date
- Contribution guidelines MUST be clear
- License MUST be explicitly stated (CC BY-NC-SA 4.0 for content)
- Changes MUST be tracked in version control with meaningful commit messages
- README MUST provide quick-start instructions that work

**Rationale**: Open source ensures longevity, community contributions, and transparency.

## Content Standards

All course content MUST adhere to the following standards:

- **Accuracy**: Technical information MUST be correct and aligned with current French
  amateur radio regulations (ANFR requirements)
- **Attribution**: Original author credit (F6GPX - Jean-Luc Fortin) MUST be maintained
- **Specificity**: Content MUST focus on exam-relevant material only
- **Efficiency**: No padding, no filler, no tangential information
- **Accessibility**: Text MUST be readable; diagrams MUST have alt-text where applicable

## Development Workflow

Development of features and content MUST follow these guidelines:

- **Minimal Changes**: Only implement what is directly required
- **User Testing**: Changes affecting learner experience SHOULD be validated with real
  users when possible
- **Documentation First**: User-facing features MUST be documented before or alongside
  implementation
- **Mobile Consideration**: Layouts SHOULD work on mobile devices for portable study
- **Performance**: Pages MUST load quickly; no heavy JavaScript frameworks unless
  strictly necessary

## Governance

This constitution establishes the non-negotiable principles for the Licence Radio Amateur
Course project.

**Amendment Process**:
1. Proposed changes MUST be documented with rationale
2. Changes to Core Principles require explicit justification of why the original
   principle is insufficient
3. All amendments MUST be versioned and dated

**Compliance**:
- All contributions (code, content, documentation) MUST be reviewed against these
  principles
- Violations MUST be corrected before merging
- When in doubt, simplicity wins

**Version**: 1.0.0 | **Ratified**: 2026-01-01 | **Last Amended**: 2026-01-01
