import axios from "axios";

const API_BASE = import.meta.env.VITE_API;
const apiClient = axios.create({ baseURL: API_BASE });

export async function SysCheckToken(options = { redirect: true }) {
  const token = localStorage.getItem("x-token");

  if (!token) {
    if (options.redirect) {
      redirectToLogin();
    }
    return false;
  }

  try {
    const { data } = await apiClient.post("/api/users/token", { token });
    if (data.message === "OK") {
      return true;
    }

    if (options.redirect) {
      redirectToLogin();
    }
    return false;
  } catch (error) {
    console.error("Token check failed:", error);
    if (options.redirect) {
      redirectToLogin();
    }
    return false;
  }
}

export function SysSignout() {
  console.log("Logging out...");
  localStorage.clear();
  setTimeout(redirectToLogin, 2000);
}

export async function SysLogin(username, password) {
  try {
    const { data } = await apiClient.post("/api/users/login", {
      email: username,
      password,
    });

    if (data.message === "OK") {
      localStorage.setItem("x-token", data.token);
      localStorage.setItem("user_info", JSON.stringify(data.data));
      return data.data;
    }

    return false;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function SysRegister(name, surname, email, password) {
  try {
    const { data } = await apiClient.post("/api/users/register", {
      first_name: name,
      last_name: surname,
      email,
      password,
    });

    if (data.message === "OK") {
      return data.data;
    }

    return false;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
}

export async function SysGetDevices() {
  try {
    const token = localStorage.getItem("x-token");
    const { data } = await apiClient.get("/api/devices", {
      headers: { Authorization: `${token}` },
    });
    if (data.message === "OK") {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Fetching devices failed:", error);
    return [];
  }
}

export async function SysCreateDevice(payload) {
  try {
    const token = localStorage.getItem("x-token");
    const { data } = await apiClient.post("/api/devices", payload, {
      headers: { Authorization: `${token}` },
    });
    return data.message === "OK" ? data.data : null;
  } catch (error) {
    console.error("Create device failed:", error);
    return null;
  }
}

export async function SysUpdateDevice(id, payload) {
  try {
    const token = localStorage.getItem("x-token");
    const { data } = await apiClient.put(`/api/devices/${id}`, payload, {
      headers: { Authorization: `${token}` },
    });
    return data.message === "OK" ? data.data : null;
  } catch (error) {
    console.error("Update device failed:", error);
    return null;
  }
}

export async function SysDeleteDevice(id) {
  try {
    const token = localStorage.getItem("x-token");
    const { data } = await apiClient.delete(`/api/devices/${id}`, {
      headers: { Authorization: `${token}` },
    });
    return data.message === "OK";
  } catch (error) {
    console.error("Delete device failed:", error);
    return false;
  }
}

export function subscribeDeviceRealtime(deviceId, onMessage) {
  try {
    const ws = new WebSocket(
      `${import.meta.env.VITE_WEB_SOCKET}/ws/device/${deviceId}`
    );
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        onMessage(msg);
      } catch (err) {
        console.error("MQTT parse error", err);
      }
    };
    return () => ws.close();
  } catch (error) {
    console.error("subscribeDeviceRealtime failed", error);
    return () => {};
  }
}

function redirectToLogin() {
  window.location.pathname = "/";
}