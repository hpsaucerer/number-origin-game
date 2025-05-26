import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "device_id";

export function getOrCreateDeviceId() {
  // First try cookie
  const cookieId = getCookie(STORAGE_KEY);
  if (cookieId) return cookieId;

  // If no cookie, check localStorage
  const localId = localStorage.getItem(STORAGE_KEY);
  if (localId) {
    setCookie(STORAGE_KEY, localId, 365);
    return localId;
  }

  // If not found anywhere, generate new one
  const newId = uuidv4();
  setCookie(STORAGE_KEY, newId, 365);
  localStorage.setItem(STORAGE_KEY, newId);
  return newId;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}
