// utils/geo.js
export async function fetchCountryCode() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data.country_code?.toLowerCase() || null;
  } catch (err) {
    console.warn("🌐 Country lookup failed:", err);
    return null;
  }
}
