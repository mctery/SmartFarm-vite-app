import axios from 'axios';

const API_BASE = import.meta.env.VITE_API;
const apiClient = axios.create({ baseURL: API_BASE });

export async function getWidgetLayout(deviceId) {
  try {
    const token = localStorage.getItem('x-token');
    const { data } = await apiClient.get(`/api/sensorWidget/${deviceId}`, {
      headers: { Authorization: `${token}` },
    });
    if (Array.isArray(data) && data.length > 0) {
      const layout = JSON.parse(data[0].widget_json || '[]');
      return layout;
    }
    return [];
  } catch (error) {
    console.error('getWidgetLayout failed:', error);
    return [];
  }
}

export async function saveWidgetLayout(deviceId, widgets) {
  try {
    const token = localStorage.getItem('x-token');
    const { data } = await apiClient.post(`/api/sensorWidget/update/${deviceId}`, widgets, {
      headers: { Authorization: `${token}` },
    });
    if (Array.isArray(data) && data.length > 0) {
      const layout = JSON.parse(data[0].widget_json || '[]');
      return layout;
    }
    return [];
  } catch (error) {
    console.error('saveWidgetLayout failed:', error);
    return [];
  }
}

export async function deleteWidgetLayout(deviceId) {
  try {
    const token = localStorage.getItem('x-token');
    await apiClient.delete(`/api/sensorWidget/${deviceId}`, {
      headers: { Authorization: `${token}` },
    });
    return true;
  } catch (error) {
    console.error('deleteWidgetLayout failed:', error);
    return false;
  }
}

