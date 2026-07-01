import axios from 'axios';
import { processApiResponse } from '../utils/api.response.js';
import { API_URL } from '../constants/env.js';

const instance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    const rawData = response.data;
    if (!rawData.success) throw new Error(rawData.message || 'API request failed');
    return {
      success: true,
      statusCode: rawData.statusCode,
      message: rawData.message,
      data: processApiResponse(rawData),
      _raw: rawData,
    };
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    throw new Error(error.response?.data?.message || error.message || 'Network error');
  }
);

export const setAuthToken = (token) => localStorage.setItem('auth_token', token);
export const removeAuthToken = () => localStorage.removeItem('auth_token');
export const getAuthToken = () => localStorage.getItem('auth_token');

export default instance;
