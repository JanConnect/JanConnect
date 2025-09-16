import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Add request interceptor to include Authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            console.error('403 Forbidden:', error.response.data.message);
        }
        return Promise.reject(error);
    }
);

export * from "./auth.js";
export * from "./report.js";
export * from "./department.js";
export * from "./municipality.js";
export * from "./admin.js";
