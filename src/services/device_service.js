import axios from "axios";

const API_BASE = import.meta.env.VITE_API;
const apiClient = axios.create({ baseURL: API_BASE });

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
