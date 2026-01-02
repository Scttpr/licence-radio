/**
 * Notifications Module - Browser notification management
 * HAM Radio Learning Platform
 */

import { getDueCards } from './srs.js';

// ============================================================================
// Permission Management
// ============================================================================

/**
 * Check if notifications are supported
 */
export function isNotificationSupported() {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission; // 'granted', 'denied', 'default'
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// ============================================================================
// Notification Scheduling
// ============================================================================

let scheduledTimeout = null;
let streakCheckInterval = null;

/**
 * Schedule daily reminder notification
 */
export function scheduleDailyReminder(state) {
  const settings = state.settings?.notifications;
  if (!settings?.enabled || !settings?.dailyReminderTime) return;

  // Clear existing schedule
  if (scheduledTimeout) {
    clearTimeout(scheduledTimeout);
  }

  const [hours, minutes] = settings.dailyReminderTime.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // If time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const delay = scheduledTime.getTime() - now.getTime();

  scheduledTimeout = setTimeout(() => {
    showDailyReminder(state);
    // Reschedule for next day
    scheduleDailyReminder(state);
  }, delay);

  console.log(`[Notifications] Daily reminder scheduled for ${scheduledTime.toLocaleString()}`);
}

/**
 * Show the daily reminder notification
 */
function showDailyReminder(state) {
  if (getNotificationPermission() !== 'granted') return;

  const dueCards = getDueCards(state);
  const dueCount = dueCards.length;

  const title = 'Licence Radio - Rappel quotidien';
  const body = dueCount > 0
    ? `Vous avez ${dueCount} carte${dueCount > 1 ? 's' : ''} a reviser !`
    : 'Continuez votre apprentissage !';

  try {
    const notification = new Notification(title, {
      body,
      icon: './icons/icon-192.png',
      tag: 'daily-reminder',
      requireInteraction: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (e) {
    console.error('[Notifications] Failed to show notification:', e);
  }
}

/**
 * Start streak warning checker (runs every hour)
 */
export function startStreakWarningChecker(state) {
  const settings = state.settings?.notifications;
  if (!settings?.enabled || !settings?.streakWarning) return;

  // Clear existing interval
  if (streakCheckInterval) {
    clearInterval(streakCheckInterval);
  }

  // Check every hour
  streakCheckInterval = setInterval(() => {
    checkStreakWarning(state);
  }, 60 * 60 * 1000);

  // Also check immediately
  checkStreakWarning(state);
}

/**
 * Check and show streak warning if needed
 */
export function checkStreakWarning(state) {
  const settings = state.settings?.notifications;
  if (!settings?.enabled || !settings?.streakWarning) return;
  if (getNotificationPermission() !== 'granted') return;

  const today = new Date().toISOString().split('T')[0];
  const lastSessionDate = state.session?.date;

  // If user hasn't studied today and has a streak to protect
  if (lastSessionDate !== today && state.stats.currentStreak > 0) {
    const hours = new Date().getHours();

    // Show warning in the evening (after 18:00)
    if (hours >= 18) {
      try {
        const notification = new Notification('Attention - Serie en danger !', {
          body: `Vous avez une serie de ${state.stats.currentStreak} jours. N'oubliez pas d'etudier !`,
          icon: './icons/icon-192.png',
          tag: 'streak-warning',
          requireInteraction: true
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (e) {
        console.error('[Notifications] Failed to show streak warning:', e);
      }
    }
  }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize notification system
 */
export function initNotifications(state) {
  if (!isNotificationSupported()) {
    console.log('[Notifications] Browser does not support notifications');
    return;
  }

  const settings = state.settings?.notifications;
  if (settings?.enabled && getNotificationPermission() === 'granted') {
    console.log('[Notifications] Initializing notification system');
    scheduleDailyReminder(state);
    startStreakWarningChecker(state);
  }
}

/**
 * Stop all notification timers
 */
export function stopNotifications() {
  if (scheduledTimeout) {
    clearTimeout(scheduledTimeout);
    scheduledTimeout = null;
  }
  if (streakCheckInterval) {
    clearInterval(streakCheckInterval);
    streakCheckInterval = null;
  }
  console.log('[Notifications] Stopped all notification timers');
}

/**
 * Get notification status text for display
 */
export function getNotificationStatusText() {
  if (!isNotificationSupported()) {
    return 'Notifications non supportees par ce navigateur';
  }

  const permission = getNotificationPermission();
  switch (permission) {
    case 'granted':
      return 'Notifications autorisees';
    case 'denied':
      return 'Notifications bloquees - verifiez les parametres du navigateur';
    default:
      return 'Cliquez pour activer les notifications';
  }
}
