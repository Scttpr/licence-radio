/**
 * Renderer Module - UI rendering functions
 * HAM Radio Learning Platform
 */

import { getDueCards, CardState, calculateOverallStats, calculateSectionStats, getDailyActivityStats, getAccuracyTrend, getStatsSummary, getWeakCards, getWeakSections, getQuestionMetadata } from './srs.js';

// ============================================================================
// KaTeX Rendering (T015)
// ============================================================================

/**
 * Render math expressions in an element using KaTeX
 */
export function renderMath(element) {
  if (typeof renderMathInElement === 'function') {
    try {
      renderMathInElement(element, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false,
        errorColor: '#cc0000'
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
    }
  }
}

// ============================================================================
// Home View (T022)
// ============================================================================

/**
 * Render the home view with dashboard
 */
export function renderHomeView(state, manifest, container, onStartSession, onOpenDashboard, onReviewNow, onExamMode, onResumeSession = null) {
  const dueCards = getDueCards(state);
  const dueCount = Math.min(dueCards.length, 50);

  // Calculate progress
  const totalSegments = manifest?.totalSegments || 0;
  const completedSegments = Object.values(state.segments).filter(s => s.completed).length;
  const progressPercent = totalSegments > 0
    ? Math.round((completedSegments / totalSegments) * 100)
    : 0;

  // Calculate section stats
  const { sectionStats, overallMastery } = calculateOverallStats(state, manifest);

  // Review urgency styling
  const reviewUrgent = dueCount >= 10;
  const reviewClass = reviewUrgent ? 'stat-urgent' : (dueCount > 0 ? 'stat-pending' : '');

  // Exam readiness
  const examReady = overallMastery >= 80;
  const examReadyClass = examReady ? 'ready' : (overallMastery >= 50 ? 'progress' : 'start');

  // Build section progress HTML
  const sectionsHtml = manifest.sections
    .filter(s => s.id !== 'annexes')
    .map(section => {
      const stats = sectionStats[section.id] || { masteryPercentage: 0, segmentsCompleted: 0, segmentsTotal: 0 };
      const masteryClass = stats.masteryPercentage >= 80 ? 'mastered'
        : stats.masteryPercentage >= 40 ? 'reviewing'
        : 'learning';

      return `
        <div class="section-progress-item">
          <div class="section-progress-header">
            <span class="section-progress-name">${section.title}</span>
            <span class="section-progress-percent">${stats.masteryPercentage}%</span>
          </div>
          <div class="section-progress-bar">
            <div class="section-progress-fill ${masteryClass}" style="width: ${stats.masteryPercentage}%"></div>
          </div>
        </div>
      `;
    }).join('');

  // Streak flame emoji based on streak length
  const streakEmoji = state.stats.currentStreak >= 7 ? '🔥' : (state.stats.currentStreak >= 3 ? '✨' : '📅');

  // Check for incomplete session
  const today = new Date().toISOString().split('T')[0];
  const hasIncompleteSession = state.session.date === today && state.session.inProgress;

  container.innerHTML = `
    <div class="dashboard-home">
      <!-- Header with Streak -->
      <div class="dashboard-header-card">
        <div class="streak-display">
          <span class="streak-emoji">${streakEmoji}</span>
          <div class="streak-info">
            <span class="streak-count">${state.stats.currentStreak}</span>
            <span class="streak-label">jour${state.stats.currentStreak !== 1 ? 's' : ''} consécutif${state.stats.currentStreak !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="header-stats">
          <div class="header-stat">
            <span class="header-stat-value">${state.stats.totalQuestionsAnswered || 0}</span>
            <span class="header-stat-label">Questions</span>
          </div>
          <div class="header-stat">
            <span class="header-stat-value">${state.stats.averageAccuracy || 0}%</span>
            <span class="header-stat-label">Précision</span>
          </div>
        </div>
      </div>

      <!-- Main Progress Card -->
      <div class="progress-card">
        <div class="progress-card-header">
          <h3>Progression globale</h3>
          <span class="exam-badge ${examReadyClass}">
            ${examReady ? '🎓 Prêt pour l\'examen' : `${overallMastery}% maîtrisé`}
          </span>
        </div>
        <div class="main-progress-bar">
          <div class="main-progress-fill" style="width: ${overallMastery}%"></div>
        </div>
        <div class="progress-details">
          <span>${completedSegments}/${totalSegments} segments complétés</span>
          <span>${Object.keys(state.cards).length} cartes créées</span>
        </div>
      </div>

      <!-- Today's Actions -->
      <div class="today-card">
        <h3>Aujourd'hui</h3>
        ${hasIncompleteSession ? `
          <div class="resume-session-alert">
            <span class="resume-icon">⏸️</span>
            <span class="resume-text">Session en pause</span>
          </div>
        ` : dueCount > 0 ? `
          <div class="review-alert-inline ${reviewUrgent ? 'urgent' : ''}">
            <span class="review-count">${dueCount}</span>
            <span class="review-text">carte${dueCount > 1 ? 's' : ''} à réviser</span>
          </div>
        ` : `
          <div class="review-alert-inline done">
            <span class="review-icon">✓</span>
            <span class="review-text">Révisions à jour !</span>
          </div>
        `}

        <div class="action-buttons">
          ${hasIncompleteSession ? `
            <button class="btn btn-primary btn-large" id="resume-session">
              Reprendre la session
            </button>
            <button class="btn btn-secondary" id="start-session">
              Nouvelle session
            </button>
          ` : `
            <button class="btn btn-primary btn-large" id="start-session">
              ${dueCount > 0 ? 'Commencer la session' : 'Continuer à apprendre'}
            </button>
            ${dueCount > 0 ? `
              <button class="btn btn-secondary" id="review-now">
                Réviser uniquement
              </button>
            ` : ''}
          `}
        </div>
      </div>

      <!-- Exam Mode Card -->
      <div class="exam-card">
        <div class="exam-card-content">
          <div class="exam-card-icon">📝</div>
          <div class="exam-card-info">
            <h4>Mode Examen</h4>
            <p>Testez-vous en conditions réelles</p>
          </div>
        </div>
        <button class="btn btn-secondary" id="start-exam">
          Commencer
        </button>
      </div>

      <!-- Section Progress -->
      <div class="sections-card">
        <div class="sections-card-header">
          <h3>Par section</h3>
          <button class="btn-link" id="open-dashboard">Voir détails →</button>
        </div>
        <div class="sections-progress-list">
          ${sectionsHtml}
        </div>
      </div>

      <!-- Quick Tips -->
      ${overallMastery < 30 ? `
        <div class="tips-card">
          <span class="tips-icon">💡</span>
          <p>Conseil : Étudiez un peu chaque jour pour de meilleurs résultats. La régularité est la clé !</p>
        </div>
      ` : ''}
    </div>
  `;

  document.getElementById('start-session').addEventListener('click', onStartSession);
  document.getElementById('open-dashboard').addEventListener('click', onOpenDashboard);

  const resumeBtn = document.getElementById('resume-session');
  if (resumeBtn && onResumeSession) {
    resumeBtn.addEventListener('click', onResumeSession);
  }

  const reviewBtn = document.getElementById('review-now');
  if (reviewBtn && onReviewNow) {
    reviewBtn.addEventListener('click', onReviewNow);
  }

  const examBtn = document.getElementById('start-exam');
  if (examBtn && onExamMode) {
    examBtn.addEventListener('click', onExamMode);
  }
}

// ============================================================================
// Segment View (T025, T026)
// ============================================================================

/**
 * Render a lesson segment
 */
export function renderSegment(segment, container, onContinue, readOnly = false) {
  const buttonText = readOnly ? 'Retour' : 'Continuer';
  const buttonClass = readOnly ? 'btn btn-secondary btn-large' : 'btn btn-primary btn-large';

  container.innerHTML = `
    <div class="segment-view">
      <div class="segment-header">
        <h2 class="segment-title">${segment.title}</h2>
      </div>

      <div class="segment-content">
        ${segment.content}
      </div>

      <div class="segment-footer">
        <button class="${buttonClass}" id="segment-continue">
          ${buttonText}
        </button>
      </div>
    </div>
  `;

  // Render math expressions
  renderMath(container.querySelector('.segment-content'));

  document.getElementById('segment-continue').addEventListener('click', onContinue);
}

// ============================================================================
// Question View (T029)
// ============================================================================

/**
 * Render a question card
 * @param {Object} progress - Optional progress info {current, total, type}
 */
export function renderQuestion(question, container, onAnswer, isReview = false, progress = null, segmentTitle = null, cardState = null) {
  const optionsHtml = question.type === 'true_false'
    ? `
      <button class="option-btn" data-answer="true">Vrai</button>
      <button class="option-btn" data-answer="false">Faux</button>
    `
    : question.options.map((opt, idx) => `
        <button class="option-btn" data-answer="${idx}">${opt}</button>
      `).join('');

  // Determine badge based on card state
  let badgeHtml;
  if (!cardState || cardState === 'new') {
    badgeHtml = '<div class="question-badge new-badge">Nouveau</div>';
  } else if (isReview) {
    badgeHtml = '<div class="question-badge review-badge">Révision</div>';
  } else {
    badgeHtml = '<div class="question-badge seen-badge">Déjà vu</div>';
  }

  const progressHtml = progress && progress.total > 0
    ? `<div class="question-progress">${progress.current} / ${progress.total}</div>`
    : '';

  const segmentHtml = segmentTitle
    ? `<div class="question-segment">${segmentTitle}</div>`
    : '';

  container.innerHTML = `
    <div class="question-view">
      <div class="question-card">
        <div class="question-header">
          ${badgeHtml}
          ${progressHtml}
        </div>
        ${segmentHtml}
        <div class="question-prompt">${question.prompt}</div>
        <div class="question-options">
          ${optionsHtml}
        </div>
        <div id="feedback-container"></div>
      </div>
    </div>
  `;

  // Render math in question
  renderMath(container.querySelector('.question-prompt'));
  renderMath(container.querySelector('.question-options'));

  // Add click handlers
  container.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.dataset.answer;
      const selectedAnswer = question.type === 'true_false'
        ? answer === 'true'
        : parseInt(answer);
      onAnswer(selectedAnswer);
    });
  });
}

// ============================================================================
// Feedback View (T030)
// ============================================================================

/**
 * Render answer feedback
 */
export function renderFeedback(question, selectedAnswer, wasCorrect, container, onNext) {
  const feedbackContainer = container.querySelector('#feedback-container') || container;

  // Highlight correct/incorrect options
  const options = container.querySelectorAll('.option-btn');
  options.forEach(btn => {
    btn.disabled = true;
    const answer = question.type === 'true_false'
      ? btn.dataset.answer === 'true'
      : parseInt(btn.dataset.answer);

    if (question.type === 'true_false') {
      if (answer === question.correct) {
        btn.classList.add('correct');
      } else if (answer === selectedAnswer && !wasCorrect) {
        btn.classList.add('incorrect');
      }
    } else {
      if (answer === question.correct) {
        btn.classList.add('correct');
      } else if (answer === selectedAnswer && !wasCorrect) {
        btn.classList.add('incorrect');
      }
    }
  });

  // Show feedback card
  const feedbackHtml = `
    <div class="feedback-card ${wasCorrect ? 'feedback-correct' : 'feedback-incorrect'}">
      <div class="feedback-title">
        ${wasCorrect ? '✓ Correct !' : '✗ Incorrect'}
      </div>
      <div class="feedback-explanation">
        ${question.explanation}
      </div>
      <button class="btn btn-primary" id="feedback-next">
        Suivant
      </button>
    </div>
  `;

  feedbackContainer.innerHTML = feedbackHtml;
  renderMath(feedbackContainer);

  document.getElementById('feedback-next').addEventListener('click', onNext);
}

// ============================================================================
// Dashboard View (T035, T036)
// ============================================================================

/**
 * Render the progress dashboard
 */
export function renderDashboard(state, manifest, container, onBack, onTopicReview, onViewSegment) {
  const { sectionStats, overallMastery } = calculateOverallStats(state, manifest);

  const sectionsHtml = manifest.sections
    .filter(s => s.id !== 'annexes')
    .map(section => {
      const stats = sectionStats[section.id] || {
        segmentsCompleted: 0,
        segmentsTotal: 0,
        masteryPercentage: 0
      };

      const masteryClass = stats.masteryPercentage >= 80 ? 'mastery-mastered'
        : stats.masteryPercentage >= 40 ? 'mastery-reviewing'
        : 'mastery-learning';

      const masteryLabel = stats.masteryPercentage >= 80 ? 'Maîtrisé'
        : stats.masteryPercentage >= 40 ? 'En révision'
        : 'En apprentissage';

      // Build segments list for this section
      const segmentsHtml = section.lessons.flatMap(lesson =>
        lesson.segments.map(segment => {
          const isCompleted = state.segments[segment.id]?.completed;
          return `
            <div class="segment-item ${isCompleted ? 'completed' : ''}" data-segment="${segment.id}">
              <span class="segment-status">${isCompleted ? '✓' : '○'}</span>
              <span class="segment-title">${segment.title}</span>
            </div>
          `;
        })
      ).join('');

      return `
        <div class="section-card" data-section="${section.id}">
          <div class="section-card-header" data-toggle="${section.id}">
            <span class="section-title">${section.title}</span>
            <div class="section-header-right">
              <span class="mastery-badge ${masteryClass}">${masteryLabel}</span>
              <span class="expand-icon">▼</span>
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar progress-bar-mastered" style="width: ${stats.masteryPercentage}%"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--font-size-sm); color: var(--color-text-light);">
            <span>${stats.segmentsCompleted}/${stats.segmentsTotal} segments</span>
            <span>${stats.masteryPercentage}% maîtrisé</span>
          </div>
          <div class="segment-list" id="segments-${section.id}" style="display: none;">
            ${segmentsHtml}
          </div>
          ${stats.masteryPercentage < 80 ? `
            <button class="btn btn-secondary" style="margin-top: var(--spacing-sm); width: 100%;" data-review="${section.id}">
              Réviser ce thème
            </button>
          ` : ''}
        </div>
      `;
    }).join('');

  const examReadyHtml = overallMastery >= 80
    ? '<div class="exam-ready-badge">🎓 Prêt pour l\'examen !</div>'
    : '';

  container.innerHTML = `
    <div class="dashboard-view">
      <div class="dashboard-header">
        <h2 class="dashboard-title">Ma progression</h2>
        <p>Maîtrise globale: ${overallMastery}%</p>
        ${examReadyHtml}
      </div>

      <div class="overall-progress">
        <div class="progress-bar-container">
          <div class="progress-bar progress-bar-mastered" style="width: ${overallMastery}%"></div>
        </div>
      </div>

      <div class="section-list">
        ${sectionsHtml}
      </div>

      <div style="margin-top: var(--spacing-xl); text-align: center;">
        <button class="btn btn-secondary" id="dashboard-back">
          Retour à l'accueil
        </button>
      </div>
    </div>
  `;

  document.getElementById('dashboard-back').addEventListener('click', onBack);

  // Add section expand/collapse handlers
  container.querySelectorAll('[data-toggle]').forEach(header => {
    header.addEventListener('click', () => {
      const sectionId = header.dataset.toggle;
      const segmentList = document.getElementById(`segments-${sectionId}`);
      const icon = header.querySelector('.expand-icon');
      if (segmentList.style.display === 'none') {
        segmentList.style.display = 'block';
        icon.textContent = '▲';
      } else {
        segmentList.style.display = 'none';
        icon.textContent = '▼';
      }
    });
  });

  // Add segment view handlers
  container.querySelectorAll('[data-segment]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      onViewSegment(item.dataset.segment);
    });
  });

  // Add topic review handlers
  container.querySelectorAll('[data-review]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onTopicReview(btn.dataset.review);
    });
  });
}

// ============================================================================
// Session Complete View
// ============================================================================

/**
 * Render session complete message
 */
export function renderSessionComplete(state, container, onBack, onContinue, hasNextLesson) {
  container.innerHTML = `
    <div class="home-view">
      <div class="card" style="text-align: center;">
        <h2 style="color: var(--color-success); margin-bottom: var(--spacing-md);">
          🎉 Leçon terminée !
        </h2>
        <p style="margin-bottom: var(--spacing-lg);">
          ${hasNextLesson ? 'Excellent travail ! Continuez sur votre lancée.' : 'Félicitations ! Vous avez terminé toutes les leçons.'}
        </p>
        <div class="home-stats" style="margin-bottom: var(--spacing-lg);">
          <div class="stat-item">
            <div class="stat-value">${state.session.questionsAnswered}</div>
            <div class="stat-label">Questions répondues</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${state.stats.currentStreak}</div>
            <div class="stat-label">Jours consécutifs</div>
          </div>
        </div>
        <div class="session-complete-actions">
          ${hasNextLesson ? `
            <button class="btn btn-primary btn-large" id="session-continue">
              Leçon suivante →
            </button>
          ` : ''}
          <button class="btn ${hasNextLesson ? 'btn-secondary' : 'btn-primary'}" id="session-complete-back">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('session-complete-back').addEventListener('click', onBack);

  const continueBtn = document.getElementById('session-continue');
  if (continueBtn && onContinue) {
    continueBtn.addEventListener('click', onContinue);
  }
}

// ============================================================================
// Loading View
// ============================================================================

/**
 * Render loading state
 */
export function renderLoading(container, message = 'Chargement...') {
  container.innerHTML = `<div class="loading">${message}</div>`;
}

// ============================================================================
// Error View
// ============================================================================

/**
 * Render error state
 */
export function renderError(container, message) {
  container.innerHTML = `
    <div class="card" style="text-align: center; color: var(--color-error);">
      <h3>Erreur</h3>
      <p>${message}</p>
      <button class="btn btn-secondary" onclick="location.reload()">
        Réessayer
      </button>
    </div>
  `;
}

// ============================================================================
// Exam Mode Views
// ============================================================================

/**
 * Render exam start screen
 */
export function renderExamStart(container, onStart, onBack) {
  container.innerHTML = `
    <div class="exam-start-view">
      <div class="exam-start-card">
        <h2>Mode Examen</h2>
        <div class="exam-info">
          <p>Simulez les conditions réelles de l'examen radioamateur :</p>
          <ul>
            <li>20 questions par épreuve</li>
            <li>30 minutes maximum</li>
            <li>10/20 minimum pour réussir</li>
            <li>Pas de retour en arrière</li>
          </ul>
        </div>
        <div class="exam-options">
          <button class="btn btn-primary btn-large" id="start-technique">
            Épreuve Technique
          </button>
          <button class="btn btn-primary btn-large" id="start-reglementation">
            Épreuve Réglementation
          </button>
          <button class="btn btn-primary btn-large" id="start-complete">
            Examen Complet (2 épreuves)
          </button>
        </div>
        <button class="btn btn-secondary" id="exam-back" style="margin-top: var(--spacing-lg);">
          Retour
        </button>
      </div>
    </div>
  `;

  document.getElementById('start-technique').addEventListener('click', () => onStart('technique'));
  document.getElementById('start-reglementation').addEventListener('click', () => onStart('reglementation'));
  document.getElementById('start-complete').addEventListener('click', () => onStart('complete'));
  document.getElementById('exam-back').addEventListener('click', onBack);
}

/**
 * Render exam question with timer
 */
export function renderExamQuestion(question, currentIndex, totalQuestions, timeRemaining, container, onAnswer) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeClass = timeRemaining < 300 ? 'time-warning' : (timeRemaining < 120 ? 'time-critical' : '');

  const optionsHtml = question.type === 'true_false'
    ? `
      <button class="option-btn exam-option" data-answer="true">Vrai</button>
      <button class="option-btn exam-option" data-answer="false">Faux</button>
    `
    : question.options.map((opt, idx) => `
        <button class="option-btn exam-option" data-answer="${idx}">${opt}</button>
      `).join('');

  container.innerHTML = `
    <div class="exam-view">
      <div class="exam-header">
        <div class="exam-progress">
          Question ${currentIndex + 1}/${totalQuestions}
        </div>
        <div class="exam-timer ${timeClass}">
          ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
        </div>
      </div>
      <div class="exam-progress-bar">
        <div class="exam-progress-fill" style="width: ${((currentIndex + 1) / totalQuestions) * 100}%"></div>
      </div>
      <div class="exam-question-card">
        <div class="exam-question-prompt">${question.prompt}</div>
        <div class="exam-question-options">
          ${optionsHtml}
        </div>
      </div>
    </div>
  `;

  // Render math in question
  renderMath(container.querySelector('.exam-question-prompt'));
  renderMath(container.querySelector('.exam-question-options'));

  // Add click handlers
  container.querySelectorAll('.exam-option').forEach(btn => {
    btn.addEventListener('click', () => {
      // Visual feedback
      container.querySelectorAll('.exam-option').forEach(b => b.disabled = true);
      btn.classList.add('selected');

      const answer = btn.dataset.answer;
      const selectedAnswer = question.type === 'true_false'
        ? answer === 'true'
        : parseInt(answer);

      // Short delay before moving to next question
      setTimeout(() => onAnswer(selectedAnswer), 300);
    });
  });
}

/**
 * Render exam results
 */
export function renderExamResults(results, container, onRetry, onBack) {
  const passed = results.score >= 10;
  const percentage = Math.round((results.score / results.total) * 100);

  // Build question review HTML
  const reviewHtml = results.answers.map((answer, idx) => {
    const isCorrect = answer.correct;
    return `
      <div class="exam-review-item ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="exam-review-number">${idx + 1}</div>
        <div class="exam-review-content">
          <div class="exam-review-question">${answer.question.prompt}</div>
          ${!isCorrect ? `
            <div class="exam-review-explanation">${answer.question.explanation}</div>
          ` : ''}
        </div>
        <div class="exam-review-icon">${isCorrect ? '✓' : '✗'}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="exam-results-view">
      <div class="exam-results-card">
        <div class="exam-results-header ${passed ? 'passed' : 'failed'}">
          <div class="exam-results-icon">${passed ? '🎉' : '📚'}</div>
          <h2>${passed ? 'Félicitations !' : 'Continuez à réviser'}</h2>
          <p class="exam-results-subtitle">
            ${passed ? 'Vous avez réussi cette épreuve' : 'Vous n\'avez pas atteint le score minimum'}
          </p>
        </div>

        <div class="exam-score-display">
          <div class="exam-score-main">
            <span class="exam-score-value">${results.score}</span>
            <span class="exam-score-separator">/</span>
            <span class="exam-score-total">${results.total}</span>
          </div>
          <div class="exam-score-percent">${percentage}%</div>
          <div class="exam-score-label">
            ${passed ? 'Score obtenu' : 'Minimum requis : 10/20'}
          </div>
        </div>

        <div class="exam-stats">
          <div class="exam-stat">
            <span class="exam-stat-value">${results.correctCount}</span>
            <span class="exam-stat-label">Bonnes réponses</span>
          </div>
          <div class="exam-stat">
            <span class="exam-stat-value">${results.incorrectCount}</span>
            <span class="exam-stat-label">Erreurs</span>
          </div>
          <div class="exam-stat">
            <span class="exam-stat-value">${Math.floor(results.timeUsed / 60)}:${String(results.timeUsed % 60).padStart(2, '0')}</span>
            <span class="exam-stat-label">Temps utilisé</span>
          </div>
        </div>

        <div class="exam-review-section">
          <h3>Récapitulatif des réponses</h3>
          <div class="exam-review-list">
            ${reviewHtml}
          </div>
        </div>

        <div class="exam-results-actions">
          <button class="btn btn-primary btn-large" id="exam-retry">
            Recommencer
          </button>
          <button class="btn btn-secondary" id="exam-home">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  `;

  // Render math in review
  renderMath(container.querySelector('.exam-review-list'));

  document.getElementById('exam-retry').addEventListener('click', onRetry);
  document.getElementById('exam-home').addEventListener('click', onBack);
}

// ============================================================================
// Statistics View
// ============================================================================

/**
 * Render study statistics view
 */
export function renderStatisticsView(state, manifest, container, onBack) {
  const summary = getStatsSummary(state, manifest);
  const dailyActivity = getDailyActivityStats(state, 14); // Last 2 weeks
  const accuracyTrend = getAccuracyTrend(state, 21);

  // Build simple bar chart (CSS-based, no external lib)
  const maxQuestions = Math.max(...dailyActivity.map(d => d.questionsAnswered), 1);

  const activityChartHtml = dailyActivity.map(day => {
    const height = (day.questionsAnswered / maxQuestions) * 100;
    const isToday = day.date === new Date().toISOString().split('T')[0];
    return `
      <div class="activity-bar-container" title="${day.questionsAnswered} questions le ${day.dayLabel}">
        <div class="activity-bar ${isToday ? 'today' : ''}" style="height: ${Math.max(height, 2)}%">
          ${day.questionsAnswered > 0 ? `<span class="bar-value">${day.questionsAnswered}</span>` : ''}
        </div>
        <span class="bar-label">${day.dayLabel.slice(0, 3)}</span>
      </div>
    `;
  }).join('');

  // Accuracy trend display - only show days with data
  const validTrend = accuracyTrend.filter(t => t.rollingAccuracy !== null).slice(-7);
  const trendHtml = validTrend.length > 0
    ? validTrend.map(t => `
        <div class="trend-point">
          <span class="trend-value">${t.rollingAccuracy}%</span>
          <span class="trend-date">${t.dayLabel.slice(0, 6)}</span>
        </div>
      `).join('')
    : '<p class="empty-state">Pas assez de donnees (besoin de 7 jours)</p>';

  container.innerHTML = `
    <div class="statistics-view">
      <div class="dashboard-header">
        <h2>Statistiques d'apprentissage</h2>
      </div>

      <!-- Summary Cards -->
      <div class="stats-summary-grid">
        <div class="stat-card">
          <div class="stat-card-value">${summary.currentStreak}</div>
          <div class="stat-card-label">Jours consecutifs</div>
          <div class="stat-card-sub">Record: ${summary.longestStreak}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value">${summary.totalQuestionsAnswered}</div>
          <div class="stat-card-label">Questions totales</div>
          <div class="stat-card-sub">Cette semaine: ${summary.thisWeekQuestions}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value">${summary.averageAccuracy}%</div>
          <div class="stat-card-label">Precision globale</div>
          <div class="stat-card-sub">Cette semaine: ${summary.thisWeekAccuracy}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-value">${summary.overallMastery}%</div>
          <div class="stat-card-label">Maitrise globale</div>
          <div class="stat-card-sub">${summary.totalMastered}/${summary.totalCards} cartes</div>
        </div>
      </div>

      <!-- Activity Chart -->
      <div class="chart-card">
        <h3>Activite quotidienne (14 jours)</h3>
        <div class="activity-chart">
          ${activityChartHtml}
        </div>
      </div>

      <!-- Accuracy Trend -->
      <div class="chart-card">
        <h3>Tendance de precision (moyenne 7 jours)</h3>
        <div class="accuracy-trend">
          ${trendHtml}
        </div>
      </div>

      <div style="text-align: center; margin-top: var(--spacing-xl);">
        <button class="btn btn-secondary" id="stats-back">Retour</button>
      </div>
    </div>
  `;

  document.getElementById('stats-back').addEventListener('click', onBack);
}

// ============================================================================
// Weak Areas Dashboard
// ============================================================================

/**
 * Render weak areas dashboard
 */
export function renderWeakAreasDashboard(state, manifest, container, callbacks) {
  const { onBack, onReviewSection, onReviewCards } = callbacks;

  const weakSections = getWeakSections(state, manifest);
  const weakCards = getWeakCards(state, manifest, 10);

  const sectionsHtml = weakSections.length === 0
    ? '<p class="empty-state">Aucune section faible. Excellent travail !</p>'
    : weakSections.map(({ section, stats, gapToThreshold }) => `
        <div class="weak-section-card">
          <div class="weak-section-header">
            <span class="section-name">${section.title}</span>
            <span class="mastery-percent urgent">${stats.masteryPercentage}%</span>
          </div>
          <div class="progress-bar-container small">
            <div class="progress-bar progress-bar-warning" style="width: ${stats.masteryPercentage}%"></div>
          </div>
          <div class="weak-section-details">
            <span>${stats.cardsMastered}/${stats.cardsTotal} cartes maitrisees</span>
            <span class="gap-badge">-${gapToThreshold}% du seuil</span>
          </div>
          <button class="btn btn-primary btn-small" data-review-section="${section.id}">
            Reviser ce theme
          </button>
        </div>
      `).join('');

  const cardsHtml = weakCards.length === 0
    ? '<p class="empty-state">Aucune question problematique identifiee.</p>'
    : weakCards.map(({ questionId, card }) => {
        const meta = getQuestionMetadata(questionId, manifest);
        const stateLabel = card.state === 'learning' ? 'En apprentissage' :
                          card.state === 'reviewing' ? 'En revision' : card.state;
        return `
          <div class="problem-card-item clickable" data-question-id="${questionId}">
            <div class="problem-card-info">
              <span class="problem-card-topic">${meta?.segmentTitle || 'Question'}</span>
              <span class="problem-card-state ${card.state}">${stateLabel}</span>
            </div>
            <div class="problem-card-stats">
              <span title="Facteur de facilite (plus bas = plus difficile)">EF: ${card.easeFactor.toFixed(1)}</span>
              <span title="Reponses correctes consecutives">${card.consecutiveCorrect}/3</span>
            </div>
            <div class="problem-card-action">
              <span class="practice-icon" title="Pratiquer cette carte">→</span>
            </div>
          </div>
        `;
      }).join('');

  container.innerHTML = `
    <div class="weak-areas-view">
      <div class="dashboard-header">
        <h2>Zones a renforcer</h2>
        <p>Concentrez-vous sur ces points pour atteindre 80% de maitrise</p>
      </div>

      <div class="weak-areas-section">
        <h3>Sections sous le seuil (&lt; 80%)</h3>
        <div class="weak-sections-list">
          ${sectionsHtml}
        </div>
      </div>

      <div class="weak-areas-section">
        <h3>Questions problematiques</h3>
        <p class="section-desc">Questions avec un facteur de facilite bas ou peu de reponses correctes consecutives. Cliquez pour pratiquer.</p>
        <div class="problem-cards-list">
          ${cardsHtml}
        </div>
        ${weakCards.length > 0 ? `
          <button class="btn btn-primary" id="review-all-weak" style="margin-top: var(--spacing-md); width: 100%;">
            Pratiquer toutes les cartes faibles (${weakCards.length})
          </button>
        ` : ''}
      </div>

      <div style="text-align: center; margin-top: var(--spacing-xl);">
        <button class="btn btn-secondary" id="weak-areas-back">Retour</button>
      </div>
    </div>
  `;

  document.getElementById('weak-areas-back').addEventListener('click', onBack);

  container.querySelectorAll('[data-review-section]').forEach(btn => {
    btn.addEventListener('click', () => onReviewSection(btn.dataset.reviewSection));
  });

  // Click handler for individual weak cards
  container.querySelectorAll('[data-question-id]').forEach(item => {
    item.addEventListener('click', () => {
      const questionId = item.dataset.questionId;
      if (onReviewCards) {
        onReviewCards([questionId]);
      }
    });
  });

  // Click handler for "review all weak cards" button
  const reviewAllBtn = document.getElementById('review-all-weak');
  if (reviewAllBtn && onReviewCards) {
    reviewAllBtn.addEventListener('click', () => {
      const allWeakIds = weakCards.map(({ questionId }) => questionId);
      onReviewCards(allWeakIds);
    });
  }
}

// ============================================================================
// Formula Reference Sheet
// ============================================================================

const FORMULA_CATEGORIES = [
  {
    id: 'electricity',
    title: 'Electricite - Bases',
    formulas: [
      { name: 'Loi d\'Ohm', formula: 'U = R × I', variants: ['R = U/I', 'I = U/R'], unit: 'V, Ω, A' },
      { name: 'Puissance', formula: 'P = U × I', variants: ['P = R×I²', 'P = U²/R'], unit: 'W' },
      { name: 'Resistances serie', formula: 'Rtot = R1 + R2 + ...', unit: 'Ω' },
      { name: 'Resistances parallele', formula: '1/Rtot = 1/R1 + 1/R2', variants: ['Rtot = (R1×R2)/(R1+R2)'], unit: 'Ω' },
      { name: 'Loi de Joule', formula: 'E = P × t', note: 'Energie en Joules (Wh)' },
      { name: 'Capacites serie', formula: '1/Ctot = 1/C1 + 1/C2', unit: 'F' },
      { name: 'Capacites parallele', formula: 'Ctot = C1 + C2 + ...', unit: 'F' }
    ]
  },
  {
    id: 'decibels',
    title: 'Decibels',
    formulas: [
      { name: 'dB (puissance)', formula: 'G(dB) = 10 × log(P2/P1)', note: '+3dB = ×2, +10dB = ×10' },
      { name: 'dB (tension)', formula: 'G(dB) = 20 × log(U2/U1)', note: '+6dB = ×2, +20dB = ×10' },
      { name: 'Valeurs cles', formula: '+3dB=×2, +6dB=×4, +10dB=×10, +20dB=×100', note: 'A memoriser !' },
      { name: 'Rendement', formula: 'η = (Psortie / Pentree) × 100', unit: '%' }
    ]
  },
  {
    id: 'frequency',
    title: 'Frequences et Circuits LC',
    formulas: [
      { name: 'Frequence de resonance', formula: 'f = 1 / (2π√LC)', note: 'Formule de Thomson' },
      { name: 'Longueur d\'onde', formula: 'λ = c / f = 300/f(MHz)', note: 'c ≈ 300 000 km/s' },
      { name: 'Reactance inductive', formula: 'XL = 2πfL', unit: 'Ω' },
      { name: 'Reactance capacitive', formula: 'XC = 1 / (2πfC)', unit: 'Ω' },
      { name: 'Impedance RLC serie', formula: 'Z = √(R² + (XL-XC)²)', unit: 'Ω' },
      { name: 'Facteur de qualite', formula: 'Q = XL/R = f0/Δf', note: 'Selectivite du circuit' }
    ]
  },
  {
    id: 'antennas',
    title: 'Antennes',
    formulas: [
      { name: 'Dipole demi-onde', formula: 'L(m) = 150 / f(MHz)', note: 'Longueur totale' },
      { name: 'Quart d\'onde', formula: 'L(m) = 75 / f(MHz)', note: 'Ground plane, radians' },
      { name: 'ROS', formula: 'ROS = Zcharge/Zligne ou Zligne/Zcharge', note: 'Toujours ≥ 1' },
      { name: 'Puissance reflechie', formula: 'Pref = Pinc × ((ROS-1)/(ROS+1))²', unit: 'W' }
    ]
  },
  {
    id: 'power',
    title: 'Puissance et Propagation',
    formulas: [
      { name: 'PAR (EIRP)', formula: 'PAR = Pemetteur × Gantenne', note: 'Gain en lineaire, pas en dB' },
      { name: 'dBm vers Watts', formula: 'P(W) = 10^((dBm-30)/10)', note: '30dBm=1W, 40dBm=10W' },
      { name: 'dBW vers dBm', formula: 'dBm = dBW + 30', note: '0dBW = 1W = 30dBm' },
      { name: 'Affaiblissement espace libre', formula: 'L = 32.4 + 20log(d) + 20log(f)', note: 'd en km, f en MHz' }
    ]
  },
  {
    id: 'safety',
    title: 'Securite',
    formulas: [
      { name: 'Tensions de securite', formula: '50V sec / 24V humide / 12V immersion', note: 'Limites max' },
      { name: 'Couleurs fils', formula: 'Vert-Jaune=Terre, Bleu=Neutre, Rouge/Marron/Noir=Phase', note: 'A connaitre !' }
    ]
  }
];

/**
 * Show formula reference modal
 */
export function showFormulaReference() {
  // Remove existing modal if present
  const existing = document.querySelector('.formula-modal-overlay');
  if (existing) existing.remove();

  const categoriesHtml = FORMULA_CATEGORIES.map(cat => `
    <div class="formula-category">
      <h4 class="formula-category-title">${cat.title}</h4>
      <div class="formula-list">
        ${cat.formulas.map(f => `
          <div class="formula-item">
            <div class="formula-name">${f.name}</div>
            <div class="formula-expression">${f.formula}</div>
            ${f.variants ? `<div class="formula-variants">${f.variants.join(' | ')}</div>` : ''}
            ${f.note ? `<div class="formula-note">${f.note}</div>` : ''}
            ${f.unit ? `<div class="formula-unit">Unite: ${f.unit}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay formula-modal-overlay';
  overlay.innerHTML = `
    <div class="modal formula-modal">
      <div class="modal-header">
        <h3>Formules de reference</h3>
        <button class="modal-close" id="close-formulas">&times;</button>
      </div>
      <div class="modal-content formula-content">
        <div class="formula-search">
          <input type="text" id="formula-search-input" placeholder="Rechercher une formule..." />
        </div>
        <div class="formula-categories" id="formula-categories">
          ${categoriesHtml}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handlers
  document.getElementById('close-formulas').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Escape key to close
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      overlay.remove();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Search filter
  const searchInput = document.getElementById('formula-search-input');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.formula-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
    document.querySelectorAll('.formula-category').forEach(cat => {
      const visibleItems = cat.querySelectorAll('.formula-item:not([style*="none"])');
      cat.style.display = visibleItems.length > 0 ? '' : 'none';
    });
  });

  // Focus search input
  searchInput.focus();
}
