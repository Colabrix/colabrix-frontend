import axios from "axios";
import { processApiResponse } from "../utils/api.response.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class ColabrixApiClient {
  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const rawData = response.data;

        if (!rawData.success) {
          throw new Error(rawData.message || "API request failed");
        }

        const processedData = processApiResponse(rawData);

        return {
          success: true,
          statusCode: rawData.statusCode,
          message: rawData.message,
          data: processedData,
          _raw: rawData,
        };
      },
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
        }

        const message =
          error.response?.data?.message || error.message || "Network error";
        throw new Error(message);
      }
    );
  }

  async get(endpoint, config = {}) {
    return this.instance.get(endpoint, config);
  }

  async post(endpoint, data = {}, config = {}) {
    return this.instance.post(endpoint, data, config);
  }

  async put(endpoint, data = {}, config = {}) {
    return this.instance.put(endpoint, data, config);
  }

  async delete(endpoint, config = {}) {
    return this.instance.delete(endpoint, config);
  }

  async patch(endpoint, data = {}, config = {}) {
    return this.instance.patch(endpoint, data, config);
  }

  setAuthToken(token) {
    localStorage.setItem("auth_token", token);
  }

  removeAuthToken() {
    localStorage.removeItem("auth_token");
  }

  getAuthToken() {
    return localStorage.getItem("auth_token");
  }
}

export default new ColabrixApiClient();
