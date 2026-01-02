/**
 * Session Module - Daily session management
 * HAM Radio Learning Platform
 */

import { getDueCards, getCardsBySection, processAnswer } from './srs.js';
import { saveState, loadSegment, loadQuestions, markSegmentCompleted } from './storage.js';

// ============================================================================
// Constants
// ============================================================================

const MAX_REVIEWS_PER_SESSION = 50;

// Session phases
export const SessionPhase = {
  REVIEW: 'review',
  LEARN: 'learn',
  QUESTIONS: 'questions',
  COMPLETE: 'complete'
};

// ============================================================================
// Session Initialization (T019)
// ============================================================================

/**
 * Get today's date string (YYYY-MM-DD)
 */
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Find the next segment to learn
 */
function findNextSegment(state, manifest) {
  for (const section of manifest.sections) {
    // Skip annexes
    if (section.id === 'annexes') continue;

    for (const lesson of section.lessons) {
      for (const segmentRef of lesson.segments) {
        if (!state.segments[segmentRef.id]?.completed) {
          return segmentRef.id;
        }
      }
    }
  }
  return null; // All segments complete
}

/**
 * Update learning streak
 */
function updateStreak(state) {
  const today = getTodayString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Check if this is a new day
  const lastSessionDate = state.session.date;

  if (lastSessionDate === yesterday) {
    state.stats.currentStreak++;
  } else if (lastSessionDate !== today) {
    state.stats.currentStreak = 1;
  }

  state.stats.totalSessionDays++;
  state.stats.longestStreak = Math.max(state.stats.longestStreak, state.stats.currentStreak);
}

// ============================================================================
// Session Flow Control (T020, T021)
// ============================================================================

/**
 * Get the next item to present in the session
 */
export async function getNextItem(session, state, manifest) {
  // Review phase
  if (session.phase === SessionPhase.REVIEW) {
    if (session.reviewQueue.length > 0) {
      const questionId = session.reviewQueue[0];
      // Extract segment ID from question ID (format: q-segmentId-xxx)
      const parts = questionId.split('-');
      const segmentId = parts.slice(1, -1).join('-');

      const questions = await loadQuestions(segmentId);
      if (questions) {
        const question = questions.questions.find(q => q.id === questionId);
        if (question) {
          return { type: 'review', question, card: state.cards[questionId] };
        }
      }
      // Skip invalid question
      session.reviewQueue.shift();
      return getNextItem(session, state, manifest);
    }

    // Move to learn phase
    session.phase = SessionPhase.LEARN;
    saveState(state);
  }

  // Learn phase
  if (session.phase === SessionPhase.LEARN) {
    if (session.newSegment && !session.segmentCompleted) {
      const segment = await loadSegment(session.newSegment);
      if (segment) {
        return { type: 'segment', segment };
      }
    }

    // Move to questions phase
    session.phase = SessionPhase.QUESTIONS;

    // Load questions for the segment (limit to MAX_SEGMENT_QUESTIONS)
    if (session.newSegment) {
      const questions = await loadQuestions(session.newSegment);
      if (questions && questions.questions) {
        // Shuffle and limit to 3 questions per segment
        const shuffled = [...questions.questions].sort(() => Math.random() - 0.5);
        session.segmentQuestions = shuffled.slice(0, MAX_SEGMENT_QUESTIONS);
        session.currentQuestionIndex = 0;
      }
    }

    saveState(state);
  }

  // Questions phase
  if (session.phase === SessionPhase.QUESTIONS) {
    if (session.currentQuestionIndex < session.segmentQuestions.length) {
      const question = session.segmentQuestions[session.currentQuestionIndex];
      return { type: 'question', question };
    }

    // All segment questions answered - check for interleaved reviews
    if (session.isInterleaved && session.remainingReviews && session.remainingReviews.length > 0) {
      // Add next batch of reviews (1 review after segment questions)
      const nextReviews = session.remainingReviews.splice(0, REVIEWS_BETWEEN_SEGMENTS);
      session.reviewQueue = nextReviews;
      session.phase = SessionPhase.REVIEW;
      saveState(state);
      return getNextItem(session, state, manifest);
    }

    // All questions answered, session complete
    session.phase = SessionPhase.COMPLETE;
    session.inProgress = false;
    saveState(state);
  }

  // Complete
  return { type: 'complete' };
}

/**
 * Complete an item and advance the session
 */
export function completeItem(session, state, result) {
  if (result.type === 'review') {
    // Remove from queue
    session.reviewQueue.shift();
    session.reviewedToday.push(result.questionId);

    // Process answer
    processAnswer(result.questionId, result.wasCorrect, state);
    session.questionsAnswered++;
  }

  if (result.type === 'segment') {
    session.segmentCompleted = true;
    markSegmentCompleted(session.newSegment, state);
  }

  if (result.type === 'question') {
    // Process answer
    processAnswer(result.questionId, result.wasCorrect, state);
    session.questionsAnswered++;
    session.currentQuestionIndex++;
  }

  saveState(state);
  return session;
}

/**
 * Check if session is complete
 */
export function isSessionComplete(session) {
  return session.phase === SessionPhase.COMPLETE || !session.inProgress;
}

// ============================================================================
// Session Resumption (T023)
// ============================================================================

/**
 * Check if there's an incomplete session to resume
 */
export function hasIncompleteSession(state) {
  const today = getTodayString();
  return state.session.date === today && state.session.inProgress;
}

/**
 * Resume an incomplete session
 */
export function resumeSession(state) {
  return state.session;
}

// ============================================================================
// Topic Review (T040, T041)
// ============================================================================

/**
 * Start a review session for specific cards (weak cards)
 */
export function startWeakCardsReview(questionIds, state) {
  state.session = {
    date: getTodayString(),
    inProgress: true,
    phase: SessionPhase.REVIEW,
    reviewQueue: [...questionIds],
    reviewedToday: [],
    newSegment: null,
    segmentCompleted: true,
    questionsAnswered: 0,
    currentQuestionIndex: 0,
    segmentQuestions: [],
    isWeakCardsReview: true
  };

  saveState(state);
  return state.session;
}

/**
 * Start a focused topic review session
 */
export function startTopicReview(sectionId, state, manifest) {
  const cards = getCardsBySection(sectionId, state, manifest);

  // Filter to non-mastered cards only
  const reviewCards = cards.filter(c => c.state !== 'mastered');
  const reviewQueue = reviewCards.map(c => c.questionId);

  state.session = {
    date: getTodayString(),
    inProgress: true,
    phase: SessionPhase.REVIEW,
    reviewQueue,
    reviewedToday: [],
    newSegment: null,
    segmentCompleted: true, // No new segment for topic review
    questionsAnswered: 0,
    currentQuestionIndex: 0,
    segmentQuestions: [],
    isTopicReview: true,
    topicId: sectionId
  };

  saveState(state);
  return state.session;
}

// ============================================================================
// Review-Only Session
// ============================================================================

/**
 * Start a review-only session (no new content)
 */
export function startReviewOnlySession(state) {
  const dueCards = getDueCards(state);
  const reviewQueue = dueCards.slice(0, MAX_REVIEWS_PER_SESSION).map(c => c.questionId);

  state.session = {
    date: getTodayString(),
    inProgress: true,
    phase: SessionPhase.REVIEW,
    reviewQueue,
    reviewedToday: [],
    newSegment: null,
    segmentCompleted: true, // No new segment
    questionsAnswered: 0,
    currentQuestionIndex: 0,
    segmentQuestions: [],
    isReviewOnly: true
  };

  saveState(state);
  return state.session;
}

// ============================================================================
// Interleaved Session Mode
// ============================================================================

const REVIEWS_BETWEEN_SEGMENTS = 1; // Number of reviews to mix in (1 old, 3 new, 1 old pattern)
const MAX_SEGMENT_QUESTIONS = 3; // Limit new questions per segment

/**
 * Start an interleaved session (reviews mixed with new content)
 */
export function startInterleavedSession(state, manifest) {
  const today = getTodayString();

  // Check if session exists for today
  if (state.session.date === today && state.session.inProgress) {
    return state.session;
  }

  const dueCards = getDueCards(state);
  const allReviews = dueCards.slice(0, MAX_REVIEWS_PER_SESSION).map(c => c.questionId);

  // Find next incomplete segment
  const nextSegment = findNextSegment(state, manifest);

  // Build interleaved queue: some reviews first, then segment, then questions
  const initialReviews = allReviews.splice(0, REVIEWS_BETWEEN_SEGMENTS);

  state.session = {
    date: today,
    inProgress: true,
    phase: initialReviews.length > 0 ? SessionPhase.REVIEW : SessionPhase.LEARN,
    reviewQueue: initialReviews,
    remainingReviews: allReviews, // Reviews to show after segment questions
    reviewedToday: [],
    newSegment: nextSegment,
    segmentCompleted: false,
    questionsAnswered: 0,
    currentQuestionIndex: 0,
    segmentQuestions: [],
    isInterleaved: true
  };

  updateStreak(state);
  saveState(state);
  return state.session;
}

// ============================================================================
// Continue to Next Lesson
// ============================================================================

/**
 * Start a session for the next lesson only (no reviews)
 * Used when user wants to continue learning after completing a lesson
 */
export function startNextLessonSession(state, manifest) {
  const today = getTodayString();

  // Find next incomplete segment
  const nextSegment = findNextSegment(state, manifest);

  if (!nextSegment) {
    // All lessons complete
    return {
      date: today,
      inProgress: false,
      phase: SessionPhase.COMPLETE,
      reviewQueue: [],
      reviewedToday: [],
      newSegment: null,
      segmentCompleted: true,
      questionsAnswered: 0,
      currentQuestionIndex: 0,
      segmentQuestions: []
    };
  }

  state.session = {
    date: today,
    inProgress: true,
    phase: SessionPhase.LEARN,
    reviewQueue: [],
    reviewedToday: [],
    newSegment: nextSegment,
    segmentCompleted: false,
    questionsAnswered: 0,
    currentQuestionIndex: 0,
    segmentQuestions: [],
    isContinuation: true
  };

  saveState(state);
  return state.session;
}

// ============================================================================
// Exam Mode
// ============================================================================

const EXAM_QUESTIONS = 20;
const EXAM_TIME_SECONDS = 30 * 60; // 30 minutes

/**
 * Get all questions for a specific exam type
 */
async function getExamQuestions(examType, manifest) {
  const allQuestions = [];

  // Determine which sections to include
  const targetSections = examType === 'technique'
    ? ['technique-bases-d-electricite', 'technique-composants-actifs', 'technique-radioelectricite']
    : examType === 'reglementation'
      ? ['reglementation']
      : null; // complete = all sections

  for (const section of manifest.sections) {
    if (section.id === 'annexes' || section.id === 'introduction') continue;

    // Check if section matches the exam type
    if (targetSections) {
      const sectionMatch = targetSections.some(t => section.id.includes(t) || section.id.startsWith('reg'));
      if (examType === 'technique' && section.id.startsWith('reg')) continue;
      if (examType === 'reglementation' && !section.id.startsWith('reg')) continue;
    }

    for (const lesson of section.lessons) {
      for (const segmentRef of lesson.segments) {
        try {
          const questions = await loadQuestions(segmentRef.id);
          if (questions && questions.questions) {
            allQuestions.push(...questions.questions);
          }
        } catch (e) {
          console.warn(`Could not load questions for ${segmentRef.id}:`, e);
        }
      }
    }
  }

  return allQuestions;
}

/**
 * Shuffle an array (Fisher-Yates)
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Start an exam session
 */
export async function startExamSession(examType, manifest) {
  const allQuestions = await getExamQuestions(examType, manifest);

  // Shuffle and pick random questions
  const shuffled = shuffleArray(allQuestions);
  const examQuestions = shuffled.slice(0, EXAM_QUESTIONS);

  const examSession = {
    type: examType,
    questions: examQuestions,
    currentIndex: 0,
    answers: [],
    startTime: Date.now(),
    timeLimit: EXAM_TIME_SECONDS,
    isComplete: false
  };

  return examSession;
}

/**
 * Answer an exam question
 */
export function answerExamQuestion(examSession, selectedAnswer) {
  const currentQuestion = examSession.questions[examSession.currentIndex];

  // Determine if correct
  const isCorrect = currentQuestion.type === 'true_false'
    ? selectedAnswer === currentQuestion.correct
    : selectedAnswer === currentQuestion.correct;

  // Record answer
  examSession.answers.push({
    question: currentQuestion,
    selectedAnswer,
    correct: isCorrect
  });

  examSession.currentIndex++;

  // Check if exam is complete
  if (examSession.currentIndex >= examSession.questions.length) {
    examSession.isComplete = true;
  }

  return examSession;
}

/**
 * Get remaining time for exam
 */
export function getExamTimeRemaining(examSession) {
  const elapsed = Math.floor((Date.now() - examSession.startTime) / 1000);
  return Math.max(0, examSession.timeLimit - elapsed);
}

/**
 * Check if exam time is up
 */
export function isExamTimeUp(examSession) {
  return getExamTimeRemaining(examSession) <= 0;
}

/**
 * Calculate exam results
 */
export function calculateExamResults(examSession) {
  const correctCount = examSession.answers.filter(a => a.correct).length;
  const incorrectCount = examSession.answers.length - correctCount;
  const timeUsed = Math.floor((Date.now() - examSession.startTime) / 1000);

  return {
    type: examSession.type,
    score: correctCount,
    total: EXAM_QUESTIONS,
    correctCount,
    incorrectCount,
    timeUsed,
    answers: examSession.answers,
    passed: correctCount >= 10
  };
}
