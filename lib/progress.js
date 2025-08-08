// lib/progress.js
// Shared helpers for Achievements, Number Vault, and Trophy logic

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

/* ------------------------------------------------------------------ */
/*                        Trophy / Tier utilities                      */
/* ------------------------------------------------------------------ */

// Edit these if you want more/less levels
export const TROPHY_TIERS = [20, 50, 100];

/**
 * Returns the highest tier from `tiers` that `count` has reached.
 * If none reached, returns 0.
 */
export function achievedTier(count, tiers = TROPHY_TIERS) {
  let achieved = 0;
  for (const t of tiers) {
    if (count >= t) achieved = t;
    else break;
  }
  return achieved;
}

/**
 * Returns the next target to show in the progress bar.
 * e.g., count=14 -> 20, 20 -> 50, 63 -> 100, 120 -> 120 (cap at current if past final tier)
 */
export function nextTarget(count, tiers = TROPHY_TIERS) {
  for (const t of tiers) {
    if (count < t) return t;
  }
  // Past the last tier — keep the bar full at the highest attainable point
  const last = tiers[tiers.length - 1] || count;
  return Math.max(last, count);
}

/**
 * Store/retrieve which tier has already been awarded for a given category on this device,
 * so we don't show duplicate "You earned a badge!" popups.
 */
function tierKey(category) {
  // encode to avoid weird localStorage key chars (spaces, slashes, etc.)
  return `trophyTier:${encodeURIComponent(category)}`;
}

export function getLastAwardedTier(category) {
  const v = localStorage.getItem(tierKey(category));
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function setLastAwardedTier(category, tier) {
  localStorage.setItem(tierKey(category), String(tier));
}
