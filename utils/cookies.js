// utils/cookies.js
export function getCookiePreferences() {
  try {
    const prefs = JSON.parse(localStorage.getItem("cookiePreferences") || "{}");
    return {
      analytics: !!prefs.analytics,
    };
  } catch {
    return { analytics: false };
  }
}
