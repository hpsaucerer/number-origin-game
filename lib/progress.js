// lib/progress.js
// Shared helpers for Achievements + Number Vault

export const ALL_CATEGORIES = ["Maths", "Geography", "Science", "History", "Culture", "Sport"];

/**
 * Reads completed dates from localStorage, sanitizes them (YYYY-MM-DD),
 * removes any bad keys (e.g., completed-null), and returns unique dates.
 */
export function getCompletedDatesFromLocalStorage({ cleanup = true } = {}) {
  const PREFIX = "completed-";
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
  const dates = [];
  const badKeys = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;

    const val = localStorage.getItem(key);
    if (!(val === "true" || val === true || val === "1")) continue;

    const candidate = key.slice(PREFIX.length);
    if (DATE_RE.test(candidate)) {
      dates.push(candidate);
    } else if (cleanup) {
      badKeys.push(key); // e.g., completed-null
    }
  }

  if (cleanup && badKeys.length) {
    badKeys.forEach((k) => localStorage.removeItem(k));
  }

  // de-dupe
  return [...new Set(dates)];
}
