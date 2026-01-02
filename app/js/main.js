/**
 * Main Application Entry Point
 * HAM Radio Learning Platform
 */

import { getState, saveState, loadManifest, exportState, importState } from './storage.js';
import {
  getNextItem,
  completeItem,
  isSessionComplete,
  hasIncompleteSession,
  resumeSession,
  startTopicReview,
  startReviewOnlySession,
  startInterleavedSession,
  startNextLessonSession,
  startWeakCardsReview,
  startExamSession,
  answerExamQuestion,
  getExamTimeRemaining,
  isExamTimeUp,
  calculateExamResults,
  SessionPhase
} from './session.js';
import {
  renderHomeView,
  renderSegment,
  renderQuestion,
  renderFeedback,
  renderDashboard,
  renderSessionComplete,
  renderLoading,
  renderError,
  renderExamStart,
  renderExamQuestion,
  renderExamResults,
  showFormulaReference,
  renderStatisticsView,
  renderWeakAreasDashboard
} from './renderer.js';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  initNotifications,
  stopNotifications,
  scheduleDailyReminder,
  startStreakWarningChecker,
  getNotificationStatusText
} from './notifications.js';

// ============================================================================
// Application State
// ============================================================================

let appState = null;
let manifest = null;
let currentSession = null;
let mainContent = null;
let examSession = null;
let examTimer = null;

// ============================================================================
// Application Views
// ============================================================================

/**
 * Show the home view
 */
function showHome() {
  updateHeader('home');
  renderHomeView(
    appState,
    manifest,
    mainContent,
    handleStartSession,
    showDashboard,
    handleReviewNow,
    showExamMode,
    handleResumeSession
  );
}

/**
 * Show the progress dashboard
 */
function showDashboard() {
  updateHeader('dashboard', { title: 'Progression' });
  renderDashboard(
    appState,
    manifest,
    mainContent,
    showHome,
    handleTopicReview,
    handleViewSegment
  );
}

/**
 * Handle viewing a specific segment (re-read mode)
 */
async function handleViewSegment(segmentId) {
  const { loadSegment } = await import('./storage.js');
  const segment = await loadSegment(segmentId);

  if (!segment) {
    renderError(mainContent, 'Segment non trouvé');
    return;
  }

  updateHeader('segment', { title: segment.title });
  renderSegment(segment, mainContent, () => {
    showDashboard();
  }, true); // true = read-only mode (back to dashboard)
}

/**
 * Show statistics view
 */
function showStatistics() {
  updateHeader('stats', { title: 'Statistiques' });
  renderStatisticsView(
    appState,
    manifest,
    mainContent,
    showHome
  );
}

/**
 * Show weak areas dashboard
 */
function showWeakAreas() {
  updateHeader('weak', { title: 'Points faibles' });
  renderWeakAreasDashboard(
    appState,
    manifest,
    mainContent,
    {
      onBack: showHome,
      onReviewSection: handleTopicReview,
      onReviewCards: handleWeakCardReview
    }
  );
}

/**
 * Check if there's a next lesson available
 */
function hasNextLesson() {
  for (const section of manifest.sections) {
    if (section.id === 'annexes') continue;
    for (const lesson of section.lessons) {
      for (const segmentRef of lesson.segments) {
        if (!appState.segments[segmentRef.id]?.completed) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Show session complete screen
 */
function showSessionComplete() {
  const hasNext = hasNextLesson();
  renderSessionComplete(appState, mainContent, showHome, handleContinueToNext, hasNext);
}

/**
 * Handle continuing to next lesson
 */
async function handleContinueToNext() {
  renderLoading(mainContent, 'Chargement de la leçon suivante...');

  try {
    // Start a fresh session for the next segment (no reviews, just learning)
    currentSession = startNextLessonSession(appState, manifest);
    await showNextItem();
  } catch (error) {
    console.error('Error continuing to next lesson:', error);
    renderError(mainContent, 'Impossible de charger la leçon suivante.');
  }
}

// ============================================================================
// Session Handlers
// ============================================================================

/**
 * Calculate progress for current session
 */
function calculateSessionProgress(session, isReview) {
  if (!session) return null;

  if (isReview) {
    // For reviews: count reviewed + remaining in queue
    const reviewed = session.reviewedToday?.length || 0;
    const remaining = session.reviewQueue?.length || 0;
    const totalRemaining = session.remainingReviews?.length || 0;
    const total = reviewed + remaining + totalRemaining;
    return {
      current: reviewed + 1,
      total: total
    };
  } else {
    // For segment questions
    const current = (session.currentQuestionIndex || 0) + 1;
    const total = session.segmentQuestions?.length || 0;
    return {
      current: current,
      total: total
    };
  }
}

/**
 * Get segment title from question ID
 * Question ID format: q-segmentId-xxx (e.g., q-tech-maths-001)
 */
function getSegmentTitleFromQuestion(questionId, manifest) {
  if (!questionId || !manifest) return null;

  // Extract segment ID: remove 'q-' prefix and last '-xxx' suffix
  const parts = questionId.split('-');
  if (parts.length < 3) return null;

  // Remove 'q' prefix and last number suffix
  const segmentId = parts.slice(1, -1).join('-');

  // Find segment in manifest
  for (const section of manifest.sections) {
    for (const lesson of section.lessons) {
      for (const segment of lesson.segments) {
        if (segment.id === segmentId) {
          return segment.title;
        }
      }
    }
  }
  return null;
}

/**
 * Start a new learning session (with interleaved reviews)
 */
async function handleStartSession() {
  renderLoading(mainContent, 'Démarrage de la session...');

  try {
    // Always start a fresh session (user chose "New session")
    currentSession = startInterleavedSession(appState, manifest);
    await showNextItem();
  } catch (error) {
    console.error('Error starting session:', error);
    renderError(mainContent, 'Impossible de démarrer la session. Veuillez réessayer.');
  }
}

/**
 * Resume an incomplete session
 */
async function handleResumeSession() {
  renderLoading(mainContent, 'Reprise de la session...');

  try {
    if (hasIncompleteSession(appState)) {
      currentSession = resumeSession(appState);
      await showNextItem();
    } else {
      // Fallback to new session if no incomplete session found
      handleStartSession();
    }
  } catch (error) {
    console.error('Error resuming session:', error);
    renderError(mainContent, 'Impossible de reprendre la session. Veuillez réessayer.');
  }
}

/**
 * Start a review-only session (no new content)
 */
async function handleReviewNow() {
  renderLoading(mainContent, 'Chargement des révisions...');

  try {
    currentSession = startReviewOnlySession(appState);
    await showNextItem();
  } catch (error) {
    console.error('Error starting review session:', error);
    renderError(mainContent, 'Impossible de démarrer les révisions. Veuillez réessayer.');
  }
}

/**
 * Start a topic-focused review session
 */
async function handleTopicReview(sectionId) {
  renderLoading(mainContent, 'Chargement du thème...');

  try {
    currentSession = startTopicReview(sectionId, appState, manifest);
    await showNextItem();
  } catch (error) {
    console.error('Error starting topic review:', error);
    renderError(mainContent, 'Impossible de charger le thème. Veuillez réessayer.');
  }
}

/**
 * Start a review session for specific weak cards
 */
async function handleWeakCardReview(questionIds) {
  renderLoading(mainContent, 'Chargement des cartes...');

  try {
    currentSession = startWeakCardsReview(questionIds, appState);
    await showNextItem();
  } catch (error) {
    console.error('Error starting weak card review:', error);
    renderError(mainContent, 'Impossible de charger les cartes. Veuillez réessayer.');
  }
}

/**
 * Display the next item in the session
 */
async function showNextItem() {
  if (!currentSession) {
    showHome();
    return;
  }

  if (isSessionComplete(currentSession)) {
    showSessionComplete();
    return;
  }

  renderLoading(mainContent, 'Chargement...');

  try {
    const item = await getNextItem(currentSession, appState, manifest);

    switch (item.type) {
      case 'review':
      case 'question':
        const isReview = item.type === 'review';
        const progress = calculateSessionProgress(currentSession, isReview);
        const progressText = progress ? `${progress.current}/${progress.total}` : '';
        const segmentTitle = getSegmentTitleFromQuestion(item.question.id, manifest);
        const cardState = appState.cards[item.question.id]?.state || null;
        updateHeader('study', {
          title: isReview ? 'Révision' : 'Question',
          progress: progressText
        });
        renderQuestion(item.question, mainContent, (selectedAnswer) => {
          handleAnswer(item.question, selectedAnswer);
        }, isReview, progress, segmentTitle, cardState);
        break;

      case 'segment':
        updateHeader('segment', { title: item.segment.title || 'Leçon' });
        renderSegment(item.segment, mainContent, () => {
          handleSegmentComplete();
        });
        break;

      case 'complete':
        showSessionComplete();
        break;

      default:
        console.error('Unknown item type:', item.type);
        showHome();
    }
  } catch (error) {
    console.error('Error getting next item:', error);
    renderError(mainContent, 'Erreur lors du chargement. Veuillez réessayer.');
  }
}

/**
 * Handle answer submission
 */
function handleAnswer(question, selectedAnswer) {
  // Determine if answer is correct
  const wasCorrect = question.type === 'true_false'
    ? selectedAnswer === question.correct
    : selectedAnswer === question.correct;

  // Show feedback
  renderFeedback(question, selectedAnswer, wasCorrect, mainContent, () => {
    // Complete the item
    const resultType = currentSession.phase === SessionPhase.REVIEW ? 'review' : 'question';
    completeItem(currentSession, appState, {
      type: resultType,
      questionId: question.id,
      wasCorrect
    });

    // Show next item
    showNextItem();
  });
}

/**
 * Handle segment completion
 */
function handleSegmentComplete() {
  completeItem(currentSession, appState, {
    type: 'segment'
  });

  showNextItem();
}

// ============================================================================
// Exam Mode
// ============================================================================

/**
 * Show exam start screen
 */
function showExamMode() {
  updateHeader('dashboard', { title: 'Mode Examen' });
  renderExamStart(
    mainContent,
    handleStartExam,
    showHome
  );
}

/**
 * Start an exam
 */
async function handleStartExam(examType) {
  renderLoading(mainContent, 'Préparation de l\'examen...');

  try {
    examSession = await startExamSession(examType, manifest);

    if (examSession.questions.length === 0) {
      renderError(mainContent, 'Pas assez de questions disponibles pour cet examen.');
      return;
    }

    // Start the timer
    startExamTimer();

    // Show first question
    showExamQuestion();
  } catch (error) {
    console.error('Error starting exam:', error);
    renderError(mainContent, 'Impossible de démarrer l\'examen.');
  }
}

/**
 * Start exam timer
 */
function startExamTimer() {
  if (examTimer) {
    clearInterval(examTimer);
  }

  examTimer = setInterval(() => {
    if (!examSession || examSession.isComplete) {
      clearInterval(examTimer);
      return;
    }

    if (isExamTimeUp(examSession)) {
      clearInterval(examTimer);
      finishExam();
    } else {
      // Just update the display if we're on a question
      const timerElement = document.querySelector('.exam-timer');
      if (timerElement) {
        const remaining = getExamTimeRemaining(examSession);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Add warning classes
        timerElement.classList.remove('time-warning', 'time-critical');
        if (remaining < 120) {
          timerElement.classList.add('time-critical');
        } else if (remaining < 300) {
          timerElement.classList.add('time-warning');
        }
      }
    }
  }, 1000);
}

/**
 * Show current exam question
 */
function showExamQuestion() {
  if (!examSession || examSession.isComplete) {
    finishExam();
    return;
  }

  const currentQuestion = examSession.questions[examSession.currentIndex];
  const timeRemaining = getExamTimeRemaining(examSession);
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressText = `${examSession.currentIndex + 1}/${examSession.questions.length}`;

  updateHeader('exam', {
    timer: timerText,
    progress: progressText
  });

  renderExamQuestion(
    currentQuestion,
    examSession.currentIndex,
    examSession.questions.length,
    timeRemaining,
    mainContent,
    handleExamAnswer
  );
}

/**
 * Handle exam answer
 */
function handleExamAnswer(selectedAnswer) {
  answerExamQuestion(examSession, selectedAnswer);

  if (examSession.isComplete) {
    finishExam();
  } else {
    showExamQuestion();
  }
}

/**
 * Finish exam and show results
 */
function finishExam() {
  if (examTimer) {
    clearInterval(examTimer);
    examTimer = null;
  }

  const results = calculateExamResults(examSession);

  renderExamResults(
    results,
    mainContent,
    () => showExamMode(), // Retry
    showHome              // Back to home
  );

  // Clean up exam session
  examSession = null;
}

// ============================================================================
// Navigation
// ============================================================================

// ============================================================================
// Contextual Header Navigation
// ============================================================================

let currentView = 'home';
let headerBackHandler = null;

/**
 * Update header based on current view context
 */
function updateHeader(view, options = {}) {
  currentView = view;
  const backBtn = document.getElementById('header-back');
  const title = document.getElementById('header-title');
  const center = document.getElementById('header-center');

  // Reset
  center.innerHTML = '';

  switch (view) {
    case 'home':
      backBtn.style.display = 'none';
      title.textContent = 'Licence Radio';
      headerBackHandler = null;
      break;

    case 'study':
      backBtn.style.display = 'flex';
      title.textContent = options.title || 'Étude';
      headerBackHandler = () => {
        // Save session state instead of discarding it
        if (currentSession && currentSession.inProgress) {
          appState.session = currentSession;
          saveState(appState);
        }
        currentSession = null;
        showHome();
      };
      if (options.progress) {
        center.innerHTML = `<span class="header-progress">${options.progress}</span>`;
      }
      break;

    case 'exam':
      backBtn.style.display = 'flex';
      title.textContent = 'Examen';
      headerBackHandler = () => {
        if (confirm('Quitter l\'examen en cours ?')) {
          if (examTimer) {
            clearInterval(examTimer);
            examTimer = null;
          }
          examSession = null;
          showHome();
        }
      };
      if (options.timer) {
        center.innerHTML = `<span class="header-timer">${options.timer}</span>`;
      }
      if (options.progress) {
        center.innerHTML += `<span class="header-progress">${options.progress}</span>`;
      }
      break;

    case 'dashboard':
    case 'stats':
    case 'weak':
      backBtn.style.display = 'flex';
      title.textContent = options.title || 'Progression';
      headerBackHandler = showHome;
      break;

    case 'segment':
      backBtn.style.display = 'flex';
      title.textContent = options.title || 'Leçon';
      headerBackHandler = () => {
        // Save session state instead of discarding it
        if (currentSession && currentSession.inProgress) {
          appState.session = currentSession;
          saveState(appState);
        }
        currentSession = null;
        showHome();
      };
      break;

    default:
      backBtn.style.display = 'none';
      title.textContent = 'Licence Radio';
      headerBackHandler = null;
  }
}

/**
 * Set up header button handlers
 */
function setupNavigation() {
  // Back button
  document.getElementById('header-back')?.addEventListener('click', () => {
    if (headerBackHandler) {
      headerBackHandler();
    } else {
      showHome();
    }
  });

  // Formula button
  document.getElementById('btn-formulas')?.addEventListener('click', showFormulaReference);

  // Settings button
  document.getElementById('btn-settings')?.addEventListener('click', showSettings);
}

// ============================================================================
// Service Worker
// ============================================================================

/**
 * Register service worker for offline support
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      console.log('Service Worker registered:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

/**
 * Show update notification
 */
function showUpdateNotification() {
  const notification = document.createElement('div');
  notification.className = 'update-notification';
  notification.innerHTML = `
    <span>Une nouvelle version est disponible.</span>
    <button class="btn btn-primary btn-small" id="update-btn">Mettre à jour</button>
  `;
  document.body.appendChild(notification);

  document.getElementById('update-btn').addEventListener('click', () => {
    window.location.reload();
  });
}

// ============================================================================
// Settings & Data Management
// ============================================================================

/**
 * Show settings modal
 */
function showSettings() {
  const notifSettings = appState.settings?.notifications || {};
  const notifSupported = isNotificationSupported();
  const notifPermission = getNotificationPermission();
  const notifStatusText = getNotificationStatusText();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Paramètres</h3>
        <button class="modal-close" id="close-settings">&times;</button>
      </div>
      <div class="modal-content">
        <div class="settings-section">
          <h4>Thème</h4>
          <div class="theme-toggle">
            <button class="btn btn-secondary ${!isDarkMode() ? 'active' : ''}" id="theme-light">Clair</button>
            <button class="btn btn-secondary ${isDarkMode() ? 'active' : ''}" id="theme-dark">Sombre</button>
          </div>
        </div>

        <div class="settings-section">
          <h4>Notifications</h4>
          <p class="settings-desc notification-status">${notifStatusText}</p>
          ${notifSupported ? `
            <div class="notification-settings">
              <div class="setting-row">
                <label for="notif-enabled">Activer les rappels</label>
                <input type="checkbox" id="notif-enabled"
                  ${notifSettings.enabled ? 'checked' : ''}
                  ${notifPermission === 'denied' ? 'disabled' : ''}>
              </div>
              <div class="setting-row ${!notifSettings.enabled ? 'disabled' : ''}">
                <label for="notif-time">Heure du rappel quotidien</label>
                <input type="time" id="notif-time"
                  value="${notifSettings.dailyReminderTime || '19:00'}"
                  ${!notifSettings.enabled ? 'disabled' : ''}>
              </div>
              <div class="setting-row ${!notifSettings.enabled ? 'disabled' : ''}">
                <label for="notif-streak">Alerte si serie en danger</label>
                <input type="checkbox" id="notif-streak"
                  ${notifSettings.streakWarning !== false ? 'checked' : ''}
                  ${!notifSettings.enabled ? 'disabled' : ''}>
              </div>
              <div class="setting-row ${!notifSettings.enabled ? 'disabled' : ''}">
                <label for="notif-due">Rappel revisions en attente</label>
                <input type="checkbox" id="notif-due"
                  ${notifSettings.dueReviewsReminder !== false ? 'checked' : ''}
                  ${!notifSettings.enabled ? 'disabled' : ''}>
              </div>
            </div>
          ` : '<p class="settings-desc">Les notifications ne sont pas supportees par ce navigateur.</p>'}
        </div>

        <div class="settings-section">
          <h4>Données</h4>
          <p class="settings-desc">Exportez votre progression pour la sauvegarder ou l'importer sur un autre appareil.</p>
          <div class="settings-buttons">
            <button class="btn btn-secondary" id="export-data">Exporter</button>
            <label class="btn btn-secondary" for="import-file">Importer</label>
            <input type="file" id="import-file" accept=".json" style="display: none;">
          </div>
        </div>

        <div class="settings-section">
          <h4>Réinitialisation</h4>
          <p class="settings-desc">Attention : cette action supprimera toute votre progression.</p>
          <button class="btn btn-danger" id="reset-progress">Réinitialiser</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close button
  document.getElementById('close-settings').addEventListener('click', () => {
    overlay.remove();
  });

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  // Theme buttons
  document.getElementById('theme-light').addEventListener('click', () => {
    setTheme('light');
    overlay.remove();
    showSettings();
  });

  document.getElementById('theme-dark').addEventListener('click', () => {
    setTheme('dark');
    overlay.remove();
    showSettings();
  });

  // Notification settings
  if (notifSupported) {
    const enabledCheckbox = document.getElementById('notif-enabled');
    const timeInput = document.getElementById('notif-time');
    const streakCheckbox = document.getElementById('notif-streak');
    const dueCheckbox = document.getElementById('notif-due');

    enabledCheckbox?.addEventListener('change', async (e) => {
      if (e.target.checked) {
        // Request permission when enabling
        const granted = await requestNotificationPermission();
        if (!granted) {
          e.target.checked = false;
          document.querySelector('.notification-status').textContent = getNotificationStatusText();
          return;
        }
      }

      // Update settings
      if (!appState.settings) appState.settings = {};
      if (!appState.settings.notifications) {
        appState.settings.notifications = {
          enabled: false,
          dailyReminderTime: '19:00',
          streakWarning: true,
          dueReviewsReminder: true
        };
      }
      appState.settings.notifications.enabled = e.target.checked;
      saveState(appState);

      // Re-init or stop notifications
      if (e.target.checked) {
        scheduleDailyReminder(appState);
        startStreakWarningChecker(appState);
      } else {
        stopNotifications();
      }

      // Refresh modal to update disabled states
      overlay.remove();
      showSettings();
    });

    timeInput?.addEventListener('change', (e) => {
      if (!appState.settings?.notifications) return;
      appState.settings.notifications.dailyReminderTime = e.target.value;
      saveState(appState);
      scheduleDailyReminder(appState);
    });

    streakCheckbox?.addEventListener('change', (e) => {
      if (!appState.settings?.notifications) return;
      appState.settings.notifications.streakWarning = e.target.checked;
      saveState(appState);
      if (e.target.checked) {
        startStreakWarningChecker(appState);
      }
    });

    dueCheckbox?.addEventListener('change', (e) => {
      if (!appState.settings?.notifications) return;
      appState.settings.notifications.dueReviewsReminder = e.target.checked;
      saveState(appState);
    });
  }

  // Export button
  document.getElementById('export-data').addEventListener('click', () => {
    exportState();
  });

  // Import file
  document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (importState(event.target.result)) {
          appState = getState();
          overlay.remove();
          showHome();
          alert('Données importées avec succès !');
        } else {
          alert('Erreur lors de l\'importation. Vérifiez le fichier.');
        }
      };
      reader.readAsText(file);
    }
  });

  // Reset button
  document.getElementById('reset-progress').addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser votre progression ? Cette action est irréversible.')) {
      localStorage.removeItem('hamRadioLearning');
      appState = getState();
      overlay.remove();
      showHome();
    }
  });
}

// ============================================================================
// Theme Management
// ============================================================================

/**
 * Check if dark mode is active
 */
function isDarkMode() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Set theme
 */
function setTheme(theme) {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Initialize theme
 */
function initTheme() {
  const theme = isDarkMode() ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
}

// ============================================================================
// Application Bootstrap
// ============================================================================

/**
 * Initialize the application
 */
async function init() {
  mainContent = document.getElementById('main-content');

  if (!mainContent) {
    console.error('Main content container not found');
    return;
  }

  // Initialize theme
  initTheme();

  // Register service worker
  registerServiceWorker();

  renderLoading(mainContent, 'Initialisation...');

  try {
    // Load state from localStorage
    appState = getState();

    // Load content manifest
    manifest = await loadManifest();

    if (!manifest) {
      renderError(mainContent, 'Impossible de charger le contenu. Veuillez vérifier votre connexion.');
      return;
    }

    // Set up navigation
    setupNavigation();

    // Initialize notifications
    initNotifications(appState);

    // Show home view
    showHome();

  } catch (error) {
    console.error('Initialization error:', error);
    renderError(mainContent, 'Erreur lors de l\'initialisation. Veuillez rafraîchir la page.');
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
