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
    console.error('SysGetDeviceSensors failed:', error);
    return [];
  }
}

export async function SysUpdateDeviceSensors(id) {
  try {
    const token = localStorage.getItem('x-token');
    const { data } = await apiClient.put(`/api/sensors/${id}`, {
      headers: { Authorization: `${token}` },
    });
    return data;
  } catch (error) {
    console.error('SysGetDeviceSensors failed:', error);
    return [];
  }
}
