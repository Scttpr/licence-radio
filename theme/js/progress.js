/**
 * Progress tracking logic for Daily Learning MVP
 * HAM Radio Licence Course - Learning Platform
 */

(function() {
  'use strict';

  // ============================================================================
  // Constants
  // ============================================================================

  const STORAGE_KEY = 'radioLicenceProgress';
  const SCHEMA_VERSION = 1;

  // Lesson IDs in curriculum order (from SUMMARY.md)
  const LESSON_ORDER = [
    'introduction',
    'classes_emission',
    'frequences_puissances',
    'alphabet_code_q',
    'exploitation_indicatifs',
    'bases_techniques',
    'maths',
    'ohm_joule',
    'courants_alternatifs',
    'transformateurs',
    'decibels_lc',
    'diodes',
    'transistors',
    'amplificateurs',
    'aop',
    'propagation_antennes',
    'lignes',
    'synoptiques',
    'modulations',
    'annexes'
  ];

  // ============================================================================
  // localStorage Wrapper Functions (T006)
  // ============================================================================

  /**
   * Initialize a fresh progress structure
   */
  function initializeProgress() {
    return {
      version: SCHEMA_VERSION,
      lastAccessed: Date.now(),
      currentLesson: null,
      lessons: {}
    };
  }

  /**
   * Retrieve progress from localStorage, or initialize if not present
   */
  function getProgress() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return initializeProgress();
      }

      const progress = JSON.parse(stored);

      // Version check for future migrations
      if (progress.version !== SCHEMA_VERSION) {
        return migrateProgress(progress);
      }

      return progress;
    } catch (e) {
      // localStorage unavailable or corrupted - start fresh
      return initializeProgress();
    }
  }

  /**
   * Save progress to localStorage with error handling
   */
  function saveProgress(progress) {
    try {
      progress.lastAccessed = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      // Fail gracefully - don't break the app
    }
  }

  /**
   * Migrate progress from older schema versions
   */
  function migrateProgress(data) {
    // Future migrations would go here
    // For now, just return fresh progress if version mismatch
    return initializeProgress();
  }

  // ============================================================================
  // Lesson ID Extraction (T007)
  // ============================================================================

  /**
   * Extract lesson ID from current page URL
   * URL patterns: /lesson_name.html or /lesson_name/
   */
  function getCurrentLessonId() {
    const path = window.location.pathname;

    // Extract filename without extension
    const match = path.match(/\/([^\/]+)\.html$/);
    if (match) {
      return match[1];
    }

    // Handle directory-style URLs
    const dirMatch = path.match(/\/([^\/]+)\/?$/);
    if (dirMatch && dirMatch[1] !== '') {
      return dirMatch[1];
    }

    // Default to introduction for root/index
    return 'introduction';
  }

  /**
   * Check if a lesson ID is valid
   */
  function isValidLessonId(lessonId) {
    return LESSON_ORDER.includes(lessonId);
  }

  /**
   * Get the URL path for a lesson ID
   */
  function getLessonPath(lessonId) {
    return lessonId + '.html';
  }

  // ============================================================================
  // Page Initialization (T008)
  // ============================================================================

  /**
   * Mark current lesson as visited and update currentLesson
   */
  function markLessonVisited(lessonId) {
    if (!isValidLessonId(lessonId)) {
      return;
    }

    const progress = getProgress();

    // Create lesson entry if doesn't exist
    if (!progress.lessons[lessonId]) {
      progress.lessons[lessonId] = {
        visited: true,
        completed: false
      };
    } else {
      progress.lessons[lessonId].visited = true;
    }

    // Update current lesson for resume functionality
    progress.currentLesson = lessonId;

    saveProgress(progress);
  }

  /**
   * Initialize progress tracking on page load
   */
  function initializePage() {
    const currentLesson = getCurrentLessonId();
    markLessonVisited(currentLesson);

    // Update sidebar progress indicators
    updateSidebarProgress();

    // Inject continue button if on introduction page
    injectContinueButton();

    // Setup scroll detection for completion
    setupScrollDetection(currentLesson);

    // Setup return button for completed lessons
    setupReturnButton(currentLesson);
  }

  // ============================================================================
  // User Story 1: Access Daily Lesson (T010, T011, T013)
  // ============================================================================

  /**
   * Get the next incomplete lesson in curriculum order
   * Returns null if all lessons are complete
   */
  function getNextLesson() {
    const progress = getProgress();

    for (const lessonId of LESSON_ORDER) {
      const lesson = progress.lessons[lessonId];
      if (!lesson || !lesson.completed) {
        return lessonId;
      }
    }

    return null; // All complete
  }

  /**
   * Check if we're on the introduction/home page
   */
  function isIntroductionPage() {
    const currentLesson = getCurrentLessonId();
    return currentLesson === 'introduction' ||
           window.location.pathname === '/' ||
           window.location.pathname.endsWith('/index.html');
  }

  /**
   * Inject "Continue Learning" button on introduction page
   */
  function injectContinueButton() {
    if (!isIntroductionPage()) {
      return;
    }

    const nextLesson = getNextLesson();
    const mainContent = document.querySelector('main') || document.querySelector('.content');

    if (!mainContent) {
      return;
    }

    // Remove existing button if present
    const existingBtn = document.getElementById('continue-learning-btn');
    if (existingBtn) {
      existingBtn.remove();
    }

    // Create button container
    const container = document.createElement('div');
    container.id = 'continue-learning-container';
    container.className = 'continue-learning-container';

    if (nextLesson) {
      // Show continue button
      const btn = document.createElement('a');
      btn.id = 'continue-learning-btn';
      btn.className = 'continue-btn';
      btn.href = getLessonPath(nextLesson);
      btn.textContent = 'Continuer le cours';

      // Add progress indicator
      const completedCount = getCompletedCount();
      const totalCount = LESSON_ORDER.length;

      if (completedCount > 0) {
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        progressText.textContent = ` (${completedCount}/${totalCount} leçons)`;
        btn.appendChild(progressText);
      }

      container.appendChild(btn);
    } else {
      // All lessons complete - show congratulations
      const congrats = document.createElement('div');
      congrats.className = 'course-complete';
      congrats.innerHTML = `
        <h3>Félicitations !</h3>
        <p>Vous avez terminé toutes les leçons du cours.</p>
        <a href="annexes.html" class="continue-btn">Consulter les annexes</a>
      `;
      container.appendChild(congrats);
    }

    // Insert at the beginning of main content
    const firstChild = mainContent.querySelector('h1, h2, p');
    if (firstChild && firstChild.nextSibling) {
      firstChild.parentNode.insertBefore(container, firstChild.nextSibling);
    } else {
      mainContent.prepend(container);
    }
  }

  /**
   * Get count of completed lessons
   */
  function getCompletedCount() {
    const progress = getProgress();
    let count = 0;
    for (const lessonId of LESSON_ORDER) {
      if (progress.lessons[lessonId]?.completed) {
        count++;
      }
    }
    return count;
  }

  // ============================================================================
  // User Story 2: Track Learning Progress (T014, T015, T016)
  // ============================================================================

  /**
   * Setup scroll-to-bottom detection using IntersectionObserver
   */
  function setupScrollDetection(lessonId) {
    if (!isValidLessonId(lessonId)) {
      return;
    }

    // Don't setup for already completed lessons
    const progress = getProgress();
    if (progress.lessons[lessonId]?.completed) {
      return;
    }

    const mainContent = document.querySelector('main') || document.querySelector('.content');
    if (!mainContent) {
      return;
    }

    // Create sentinel element at end of content
    const sentinel = document.createElement('div');
    sentinel.id = 'lesson-end-sentinel';
    sentinel.style.height = '1px';
    mainContent.appendChild(sentinel);

    // Setup IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        markLessonComplete(lessonId);
        observer.unobserve(sentinel);
      }
    }, { threshold: 1.0 });

    observer.observe(sentinel);
  }

  /**
   * Mark a lesson as completed
   */
  function markLessonComplete(lessonId) {
    const progress = getProgress();

    if (!progress.lessons[lessonId]) {
      progress.lessons[lessonId] = {
        visited: true,
        completed: true,
        completedAt: Date.now()
      };
    } else if (!progress.lessons[lessonId].completed) {
      progress.lessons[lessonId].completed = true;
      progress.lessons[lessonId].completedAt = Date.now();
    }

    saveProgress(progress);
    updateSidebarProgress();
  }

  /**
   * Update sidebar to show progress checkmarks
   */
  function updateSidebarProgress() {
    const progress = getProgress();
    const sidebarLinks = document.querySelectorAll('.chapter li a');

    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Extract lesson ID from href
      const match = href.match(/([^\/]+)\.html$/);
      if (!match) return;

      const lessonId = match[1];

      // Remove existing checkmark if present
      const existingCheck = link.querySelector('.checkmark');
      if (existingCheck) {
        existingCheck.remove();
      }

      // Add checkmark if completed
      if (progress.lessons[lessonId]?.completed) {
        link.classList.add('completed');
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        checkmark.textContent = ' ✓';
        checkmark.setAttribute('aria-label', 'Leçon terminée');
        link.appendChild(checkmark);
      } else {
        link.classList.remove('completed');
      }
    });
  }

  // ============================================================================
  // User Story 4: Review Previously Learned Content (T021, T022)
  // ============================================================================

  /**
   * Setup return to current lesson button for completed lessons
   */
  function setupReturnButton(currentLessonId) {
    const progress = getProgress();

    // Only show return button if:
    // 1. Current lesson is completed
    // 2. There's a different current lesson in progress
    // 3. We're not on the introduction page
    if (!progress.lessons[currentLessonId]?.completed) {
      return;
    }

    const nextIncomplete = getNextLesson();
    if (!nextIncomplete || nextIncomplete === currentLessonId) {
      return;
    }

    if (isIntroductionPage()) {
      return;
    }

    const mainContent = document.querySelector('main') || document.querySelector('.content');
    if (!mainContent) {
      return;
    }

    // Create return button
    const returnContainer = document.createElement('div');
    returnContainer.id = 'return-to-current-container';
    returnContainer.className = 'return-container';

    const returnBtn = document.createElement('a');
    returnBtn.id = 'return-to-current-btn';
    returnBtn.className = 'return-btn';
    returnBtn.href = getLessonPath(nextIncomplete);
    returnBtn.textContent = 'Retour à la leçon en cours';

    returnContainer.appendChild(returnBtn);
    mainContent.prepend(returnContainer);
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
  } else {
    initializePage();
  }

})();
