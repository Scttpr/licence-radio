/**
 * Storage Module - localStorage wrapper and content loading
 * HAM Radio Learning Platform
 */

const STORAGE_KEY = 'hamRadioLearning';
const SCHEMA_VERSION = 2;

// ============================================================================
// State Management (T011)
// ============================================================================

/**
 * Initialize default AppState structure
 */
export function initializeState() {
  return {
    version: SCHEMA_VERSION,
    lastAccessed: Date.now(),
    session: {
      date: null,
      inProgress: false,
      phase: 'review',
      reviewQueue: [],
      reviewedToday: [],
      newSegment: null,
      segmentCompleted: false,
      questionsAnswered: 0
    },
    cards: {},
    segments: {},
    stats: {
      totalSessionDays: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      averageAccuracy: 0,
      sectionProgress: {},
      dailyHistory: [],        // Array of {date, questionsAnswered, correct, sections}
      sectionAccuracy: {}      // Per-section accuracy: {sectionId: {totalAnswered, totalCorrect}}
    },
    settings: {
      notifications: {
        enabled: false,
        dailyReminderTime: '19:00',
        streakWarning: true,
        dueReviewsReminder: true
      }
    }
  };
}

/**
 * Get current app state, initializing if needed
 */
export function getState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const newState = initializeState();
      saveState(newState);
      return newState;
    }

    const state = JSON.parse(stored);

    // Version check for migrations
    if (state.version !== SCHEMA_VERSION) {
      return migrateState(state);
    }

    return state;
  } catch (e) {
    console.error('Error loading state:', e);
    return initializeState();
  }
}

/**
 * Save state to localStorage
 */
export function saveState(state) {
  try {
    state.lastAccessed = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving state:', e);
  }
}

/**
 * Migrate state from older schema versions
 */
function migrateState(oldState) {
  console.log('Migrating state from version', oldState.version, 'to', SCHEMA_VERSION);

  // Migrate from v1 to v2
  if (oldState.version === 1) {
    const migrated = {
      ...oldState,
      version: 2,
      stats: {
        ...oldState.stats,
        dailyHistory: oldState.stats.dailyHistory || [],
        sectionAccuracy: oldState.stats.sectionAccuracy || {}
      },
      settings: {
        notifications: {
          enabled: false,
          dailyReminderTime: '19:00',
          streakWarning: true,
          dueReviewsReminder: true
        }
      }
    };
    saveState(migrated);
    return migrated;
  }

  // Unknown version - reset to fresh state
  console.warn('Unknown state version, resetting to fresh state');
  return initializeState();
}

// ============================================================================
// Content Loading (T012)
// ============================================================================

let manifestCache = null;

/**
 * Load and parse content manifest
 */
export async function loadManifest() {
  if (manifestCache) {
    return manifestCache;
  }

  try {
    const response = await fetch('content/manifest.json');
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.status}`);
    }
    manifestCache = await response.json();
    return manifestCache;
  } catch (e) {
    console.error('Error loading manifest:', e);
    return null;
  }
}

/**
 * Load a specific segment by ID
 */
export async function loadSegment(segmentId) {
  try {
    const response = await fetch(`content/segments/${segmentId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load segment ${segmentId}: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Error loading segment:', e);
    return null;
  }
}

/**
 * Load questions for a specific segment
 */
export async function loadQuestions(segmentId) {
  try {
    const response = await fetch(`content/questions/${segmentId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load questions for ${segmentId}: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.error('Error loading questions:', e);
    return null;
  }
}

// ============================================================================
// Segment Progress (T028)
// ============================================================================

/**
 * Mark a segment as completed
 */
export function markSegmentCompleted(segmentId, state) {
  if (!state.segments[segmentId]) {
    state.segments[segmentId] = {
      segmentId,
      visited: true,
      completed: false,
      completedAt: null,
      questionsAnswered: 0
    };
  }

  state.segments[segmentId].completed = true;
  state.segments[segmentId].completedAt = Date.now();

  saveState(state);
  return state;
}

// ============================================================================
// Export/Import (T045 - placeholder)
// ============================================================================

/**
 * Export state as downloadable JSON
 */
export function exportState() {
  const state = getState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `ham-radio-progress-${new Date().toISOString().split('T')[0]}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Import state from JSON file
 */
export function importState(json) {
  try {
    const imported = JSON.parse(json);
    if (imported.version && imported.cards && imported.segments) {
      saveState(imported);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error importing state:', e);
    return false;
  }
}
