import axios from "axios";

const API_BASE = import.meta.env.VITE_API;
const apiClient = axios.create({ baseURL: API_BASE });

export async function SysGetDeviceSensorsById(deviceId) {
  try {
    const token = localStorage.getItem('x-token');
    const { data } = await apiClient.get(`/api/sensors/device/${deviceId}`, {
      headers: { Authorization: `${token}` },
    });
    return data;
  } catch (error) {
    console.error('SysGetDeviceSensorsById failed:', error);
    return false;
  }
}

export async function SysCreateDevice(payload) {
  try {
    const token = localStorage.getItem("x-token");
    const { data } = await apiClient.post("/api/sensors/", payload, {
      headers: { Authorization: `${token}` },
    });
    return data;
  } catch (error) {
    console.error("SysCreateDevice failed:", error);
    return false;
  }
}

export async function SysUpdateDeviceSensors(id, payload) {
  try {
    const token = localStorage.getItem('x-token');
    const { data } = await apiClient.put(`/api/sensors/${id}`, payload, {
      headers: { Authorization: `${token}` },
    }); 
    return data;
  } catch (error) {
    console.error('SysUpdateDeviceSensors failed:', error);
    return false;
  }
}

export async function SysDeleteDevice(id) {
  try {
    const token = localStorage.getItem("x-token");
    const { data } = await apiClient.delete(`/api/sensors/${id}`, {
      headers: { Authorization: `${token}` },
    });
    return data.message === "OK";
  } catch (error) {
    console.error("SysDeleteDevice failed:", error);
    return false;
  }
}
