import { v4 as uuidv4 } from "uuid";

export function getOrCreateDeviceId() {
  // Use consistent key naming
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("device_id", deviceId);
    setCookie("device_id", deviceId, 365);
  }

  // Always ensure cookie is set (e.g. on fresh deployments)
  setCookie("device_id", deviceId, 365);

  return deviceId;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

