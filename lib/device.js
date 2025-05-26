import { v4 as uuidv4 } from "uuid";

export function getOrCreateDeviceId() {
  if (typeof window === "undefined") return null; // SSR guard

  let deviceId =
    getCookie("device_id") || localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = uuidv4();
    setCookie("device_id", deviceId, 365); // expires in 1 year
    localStorage.setItem("device_id", deviceId);
    console.log("🆕 Created new device_id:", deviceId);
  } else {
    // sync cookie/localStorage if one was missing
    setCookie("device_id", deviceId, 365);
    localStorage.setItem("device_id", deviceId);
    console.log("✅ Using existing device_id:", deviceId);
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

