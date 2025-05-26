import { v4 as uuidv4 } from "uuid";

export function getOrCreateDeviceId() {
  // Prefer cookie if exists
  let deviceId = getCookie("device_id");

  if (!deviceId) {
    deviceId = uuidv4();
    setCookie("device_id", deviceId, 365); // Set cookie
    localStorage.setItem("device_id", deviceId); // 🔁 Also store in localStorage for convenience
  } else {
    // Ensure both storage methods are synced
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}
