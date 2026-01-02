/**
 * SRS Module - SM-2 Spaced Repetition Algorithm
 * HAM Radio Learning Platform
 */

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const MAX_EASE_FACTOR = 3.0;

// Quality levels for SM-2
export const Quality = {
  AGAIN: 0,  // Complete blackout
  HARD: 2,   // Incorrect but remembered after
  GOOD: 4,   // Correct with hesitation
  EASY: 5    // Perfect recall
};

// Card states
export const CardState = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEWING: 'reviewing',
  MASTERED: 'mastered'
};

// ============================================================================
// Card Management (T014)
// ============================================================================

/**
 * Create a new card for a question
 */
export function createCard(questionId) {
  return {
    questionId,
    interval: 1,
    easeFactor: DEFAULT_EASE_FACTOR,
    dueDate: Date.now(),
    repetitions: 0,
    consecutiveCorrect: 0,
    state: CardState.NEW,
    lastReviewDate: null
  };
}

/**
 * Get all cards that are due for review today
 */
export function getDueCards(state) {
  const now = Date.now();
  const dueCards = [];

  for (const [questionId, card] of Object.entries(state.cards)) {
    if (card.dueDate <= now && card.state !== CardState.MASTERED) {
      dueCards.push(card);
    }
  }

  // Sort by due date (oldest first)
  dueCards.sort((a, b) => a.dueDate - b.dueDate);

  return dueCards;
}

/**
 * Update mastery state based on consecutive correct answers
 */
export function updateMasteryState(card) {
  if (card.consecutiveCorrect >= 3) {
    card.state = CardState.MASTERED;
  } else if (card.consecutiveCorrect >= 1) {
    card.state = CardState.REVIEWING;
  } else {
    card.state = CardState.LEARNING;
  }

  return card;
}

// ============================================================================
// SM-2 Algorithm Core (T013)
// ============================================================================

/**
 * Calculate the next review date and interval using SM-2 algorithm
 */
export function calculateNextReview(card, quality) {
  let { interval, easeFactor, repetitions } = card;

  // Update ease factor based on quality
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const efDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  easeFactor = Math.max(MIN_EASE_FACTOR, Math.min(MAX_EASE_FACTOR, easeFactor + efDelta));

  if (quality < 3) {
    // Incorrect answer - reset interval
    interval = 1;
    repetitions = 0;
  } else {
    // Correct answer - increase interval
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  }

  // Calculate next due date
  const dueDate = Date.now() + interval * 24 * 60 * 60 * 1000;

  return { interval, easeFactor, dueDate, repetitions };
}

/**
 * Update a card after answering a question
 */
export function updateCard(card, quality) {
  const { interval, easeFactor, dueDate, repetitions } = calculateNextReview(card, quality);

  card.interval = interval;
  card.easeFactor = easeFactor;
  card.dueDate = dueDate;
  card.repetitions = repetitions;
  card.lastReviewDate = Date.now();

  // Update consecutive correct count
  if (quality >= 3) {
    card.consecutiveCorrect = Math.min(3, card.consecutiveCorrect + 1);
  } else {
    card.consecutiveCorrect = 0;
  }

  // Update mastery state
  updateMasteryState(card);

  return card;
}

// ============================================================================
// Answer Processing (T032)
// ============================================================================

/**
 * Process an answer and update the card state
 */
export function processAnswer(questionId, wasCorrect, state) {
  // Get or create card
  if (!state.cards[questionId]) {
    state.cards[questionId] = createCard(questionId);
  }

  const card = state.cards[questionId];

  // Map correct/incorrect to quality
  const quality = wasCorrect ? Quality.GOOD : Quality.AGAIN;

  // Update card using SM-2
  updateCard(card, quality);

  // Update stats
  state.stats.totalQuestionsAnswered++;
  if (wasCorrect) {
    state.stats.totalCorrect++;
  }
  state.stats.averageAccuracy = Math.round(
    (state.stats.totalCorrect / state.stats.totalQuestionsAnswered) * 100
  );

  // Record daily history for statistics
  recordDailyActivity(questionId, wasCorrect, state);

  // Update section-specific accuracy
  updateSectionAccuracy(questionId, wasCorrect, state);

  return state;
}

/**
 * Record activity in daily history
 */
function recordDailyActivity(questionId, wasCorrect, state) {
  const today = new Date().toISOString().split('T')[0];

  // Initialize dailyHistory if needed
  if (!state.stats.dailyHistory) {
    state.stats.dailyHistory = [];
  }

  // Find or create today's entry
  let todayEntry = state.stats.dailyHistory.find(d => d.date === today);
  if (!todayEntry) {
    todayEntry = {
      date: today,
      questionsAnswered: 0,
      correct: 0,
      sections: {}
    };
    state.stats.dailyHistory.push(todayEntry);

    // Keep only last 90 days to prevent localStorage bloat
    if (state.stats.dailyHistory.length > 90) {
      state.stats.dailyHistory = state.stats.dailyHistory.slice(-90);
    }
  }

  todayEntry.questionsAnswered++;
  if (wasCorrect) todayEntry.correct++;

  // Track by section
  const sectionId = extractSectionFromQuestionId(questionId);
  if (sectionId) {
    if (!todayEntry.sections[sectionId]) {
      todayEntry.sections[sectionId] = { answered: 0, correct: 0 };
    }
    todayEntry.sections[sectionId].answered++;
    if (wasCorrect) todayEntry.sections[sectionId].correct++;
  }
}

/**
 * Update section-specific accuracy tracking
 */
function updateSectionAccuracy(questionId, wasCorrect, state) {
  const sectionId = extractSectionFromQuestionId(questionId);
  if (!sectionId) return;

  // Initialize sectionAccuracy if needed
  if (!state.stats.sectionAccuracy) {
    state.stats.sectionAccuracy = {};
  }

  if (!state.stats.sectionAccuracy[sectionId]) {
    state.stats.sectionAccuracy[sectionId] = { totalAnswered: 0, totalCorrect: 0 };
  }

  state.stats.sectionAccuracy[sectionId].totalAnswered++;
  if (wasCorrect) state.stats.sectionAccuracy[sectionId].totalCorrect++;
}

/**
 * Extract section ID from question ID
 */
function extractSectionFromQuestionId(questionId) {
  // Format: q-{segmentId}-{number}
  // Segment IDs: technique-bases-d-electricite-ohm-joule, reg-callsigns, intro-exam-structure
  const id = questionId.replace('q-', '');

  if (id.startsWith('technique-')) {
    // Return full technique subsection: technique-bases-d-electricite, etc.
    const parts = id.split('-');
    if (parts.length >= 4) {
      return parts.slice(0, 4).join('-');
    }
    return 'technique';
  } else if (id.startsWith('reg-')) {
    return 'reglementation';
  } else if (id.startsWith('intro-')) {
    return 'introduction';
  }
  return null;
}

// ============================================================================
// Stats Calculation (T034)
// ============================================================================

// Average questions per segment (used for estimating expected cards)
const ESTIMATED_QUESTIONS_PER_SEGMENT = 4;

/**
 * Calculate mastery statistics for a section
 */
export function calculateSectionStats(sectionId, state, manifest) {
  const section = manifest.sections.find(s => s.id === sectionId);
  if (!section) return null;

  let segmentsCompleted = 0;
  let segmentsTotal = 0;
  let cardsMastered = 0;
  let cardsTotal = 0;

  for (const lesson of section.lessons) {
    for (const segmentRef of lesson.segments) {
      segmentsTotal++;
      if (state.segments[segmentRef.id]?.completed) {
        segmentsCompleted++;
      }

      // Count cards for this segment
      for (const [questionId, card] of Object.entries(state.cards)) {
        if (questionId.startsWith(`q-${segmentRef.id}`)) {
          cardsTotal++;
          if (card.state === CardState.MASTERED) {
            cardsMastered++;
          }
        }
      }
    }
  }

  // Expected cards = segments × average questions per segment
  // This ensures uncompleted sections show 0% mastery
  const expectedCards = segmentsTotal * ESTIMATED_QUESTIONS_PER_SEGMENT;

  // Mastery based on expected cards, not just created cards
  const masteryPercentage = expectedCards > 0
    ? Math.round((cardsMastered / expectedCards) * 100)
    : 0;

  return {
    sectionId,
    segmentsCompleted,
    segmentsTotal,
    cardsMastered,
    cardsTotal,
    expectedCards,
    masteryPercentage
  };
}

/**
 * Calculate overall statistics across all sections
 */
export function calculateOverallStats(state, manifest) {
  const sectionStats = {};
  let totalMastered = 0;
  let totalCards = 0;
  let totalExpectedCards = 0;

  for (const section of manifest.sections) {
    // Skip annexes/introduction for overall mastery calculation
    if (section.id === 'annexes' || section.id === 'introduction') continue;

    const stats = calculateSectionStats(section.id, state, manifest);
    if (stats) {
      sectionStats[section.id] = stats;
      totalMastered += stats.cardsMastered;
      totalCards += stats.cardsTotal;
      totalExpectedCards += stats.expectedCards;
    }
  }

  // Overall mastery based on expected cards (accounts for uncompleted sections)
  const overallMastery = totalExpectedCards > 0
    ? Math.round((totalMastered / totalExpectedCards) * 100)
    : 0;

  return {
    sectionStats,
    overallMastery,
    totalMastered,
    totalCards,
    totalExpectedCards
  };
}

/**
 * Get cards filtered by section for topic review
 */
export function getCardsBySection(sectionId, state, manifest) {
  const section = manifest.sections.find(s => s.id === sectionId);
  if (!section) return [];

  const cards = [];
  for (const lesson of section.lessons) {
    for (const segmentRef of lesson.segments) {
      for (const [questionId, card] of Object.entries(state.cards)) {
        if (questionId.startsWith(`q-${segmentRef.id}`)) {
          cards.push(card);
        }
      }
    }
  }

  // Sort by mastery state (prioritize learning, then reviewing)
  const stateOrder = { [CardState.LEARNING]: 0, [CardState.REVIEWING]: 1, [CardState.MASTERED]: 2 };
  cards.sort((a, b) => stateOrder[a.state] - stateOrder[b.state]);

  return cards;
}

// ============================================================================
// Statistics Functions
// ============================================================================

/**
 * Get activity data for the last N days
 */
export function getDailyActivityStats(state, days = 30) {
  const history = state.stats.dailyHistory || [];
  const today = new Date();
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const entry = history.find(h => h.date === dateStr);
    result.push({
      date: dateStr,
      dayLabel: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
      questionsAnswered: entry?.questionsAnswered || 0,
      correct: entry?.correct || 0,
      accuracy: entry && entry.questionsAnswered > 0
        ? Math.round((entry.correct / entry.questionsAnswered) * 100)
        : null
    });
  }

  return result;
}

/**
 * Calculate accuracy trend (7-day rolling average)
 */
export function getAccuracyTrend(state, days = 30) {
  const dailyStats = getDailyActivityStats(state, days);
  const trend = [];

  for (let i = 6; i < dailyStats.length; i++) {
    const window = dailyStats.slice(i - 6, i + 1);
    const totalAnswered = window.reduce((sum, d) => sum + d.questionsAnswered, 0);
    const totalCorrect = window.reduce((sum, d) => sum + d.correct, 0);

    trend.push({
      date: dailyStats[i].date,
      dayLabel: dailyStats[i].dayLabel,
      rollingAccuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null
    });
  }

  return trend;
}

/**
 * Get summary statistics
 */
export function getStatsSummary(state, manifest) {
  const { overallMastery, totalMastered, totalCards, totalExpectedCards } = calculateOverallStats(state, manifest);
  const dailyStats = getDailyActivityStats(state, 7);
  const thisWeekQuestions = dailyStats.reduce((sum, d) => sum + d.questionsAnswered, 0);
  const thisWeekCorrect = dailyStats.reduce((sum, d) => sum + d.correct, 0);

  return {
    totalQuestionsAnswered: state.stats.totalQuestionsAnswered || 0,
    totalCorrect: state.stats.totalCorrect || 0,
    averageAccuracy: state.stats.averageAccuracy || 0,
    currentStreak: state.stats.currentStreak || 0,
    longestStreak: state.stats.longestStreak || 0,
    totalSessionDays: state.stats.totalSessionDays || 0,
    overallMastery,
    totalMastered,
    totalCards: totalExpectedCards, // Show expected cards for context
    thisWeekQuestions,
    thisWeekAccuracy: thisWeekQuestions > 0 ? Math.round((thisWeekCorrect / thisWeekQuestions) * 100) : 0
  };
}

// ============================================================================
// Weak Areas Analysis
// ============================================================================

/**
 * Identify weak cards based on easeFactor and state
 */
export function getWeakCards(state, manifest, limit = 20) {
  const weakCards = [];

  for (const [questionId, card] of Object.entries(state.cards)) {
    // Problem card criteria:
    // 1. Low easeFactor (< 2.0 indicates difficulty)
    // 2. Stuck in learning state with low consecutiveCorrect
    // 3. High repetitions but not mastered
    const isProblematic = (
      card.easeFactor < 2.0 ||
      (card.state === CardState.LEARNING && card.consecutiveCorrect === 0) ||
      (card.repetitions > 3 && card.state !== CardState.MASTERED)
    );

    if (isProblematic) {
      // Calculate urgency score (lower = more urgent)
      const urgencyScore = card.easeFactor * (card.consecutiveCorrect + 1);
      weakCards.push({ questionId, card, urgencyScore });
    }
  }

  // Sort by urgency (most urgent first)
  weakCards.sort((a, b) => a.urgencyScore - b.urgencyScore);
  return weakCards.slice(0, limit);
}

/**
 * Get sections below mastery threshold
 */
export function getWeakSections(state, manifest, threshold = 80) {
  const weakSections = [];

  for (const section of manifest.sections) {
    if (section.id === 'annexes' || section.id === 'introduction') continue;

    const stats = calculateSectionStats(section.id, state, manifest);
    // Show sections below threshold (including those not started yet)
    if (stats && stats.masteryPercentage < threshold) {
      weakSections.push({
        section,
        stats,
        gapToThreshold: threshold - stats.masteryPercentage
      });
    }
  }

  // Sort by gap (largest gap = most urgent)
  weakSections.sort((a, b) => b.gapToThreshold - a.gapToThreshold);
  return weakSections;
}

/**
 * Map question ID to segment/section metadata
 */
export function getQuestionMetadata(questionId, manifest) {
  // Parse: q-{segmentId}-{number}
  const parts = questionId.split('-');
  const segmentId = parts.slice(1, -1).join('-');

  for (const section of manifest.sections) {
    for (const lesson of section.lessons) {
      for (const segmentRef of lesson.segments) {
        if (segmentRef.id === segmentId) {
          return {
            sectionTitle: section.title,
            lessonTitle: lesson.title,
            segmentTitle: segmentRef.title,
            segmentId
          };
        }
      }
    }
  }
  return null;
}
