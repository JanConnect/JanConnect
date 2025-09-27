// api/index.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

// Debug logging for frontend
const debugLog = (message, data = null, type = 'info') => {
  const timestamp = new Date().toISOString();
  const env = import.meta.env.MODE || 'development';
  const logMessage = `[${timestamp}] [${env.toUpperCase()}] [FRONTEND-API] ${message}`;
  
  if (data) {
    console[type](logMessage, data);
  } else {
    console[type](logMessage);
  }
};

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 30000, // 30 second timeout
});

// Enhanced request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        
        debugLog('🚀 API Request', {
            url: config.url,
            method: config.method,
            baseURL: config.baseURL,
            hasToken: !!token,
            tokenLength: token?.length,
            withCredentials: config.withCredentials,
            params: config.params
        });

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            debugLog('🔐 Token added to request', {
                tokenPreview: token.substring(0, 20) + '...'
            });
        }

        // Add debug headers for production
        if (import.meta.env.PROD) {
            config.headers['X-Debug-Source'] = 'production-frontend';
            config.headers['X-Client-Version'] = '1.0.0';
            config.headers['X-Request-ID'] = Date.now();
        }

        return config;
    },
    (error) => {
        debugLog('💥 Request Interceptor Error', {
            message: error.message,
            config: error.config
        }, 'error');
        return Promise.reject(error);
    }
);

// Enhanced response interceptor
api.interceptors.response.use(
    (response) => {
        debugLog('✅ API Response Success', {
            url: response.config.url,
            status: response.status,
            data: response.data ? 'received' : 'empty',
            message: response.data?.message
        });
        return response;
    },
    (error) => {
        debugLog('💥 API Response Error', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            code: error.code,
            config: {
                baseURL: error.config?.baseURL,
                params: error.config?.params
            }
        }, 'error');

        if (error.response?.status === 401) {
            debugLog('🔐 Authentication error - redirecting to login');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            // Don't redirect immediately to avoid breaking the app
            // window.location.href = '/login';
        } else if (error.response?.status === 403) {
            debugLog('🚫 Forbidden access', {
                message: error.response.data?.message
            });
        } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
            debugLog('🌐 Network error', {
                message: 'Cannot connect to server. Check if backend is running.'
            });
        } else if (error.code === 'TIMEOUT') {
            debugLog('⏰ Request timeout', {
                message: 'Request took too long. Server might be overloaded.'
            });
        }

        return Promise.reject(error);
    }
);

// Add a health check function
export const checkBackendHealth = async () => {
    try {
        debugLog('🏥 Backend health check started');
        const response = await api.get('/health');
        debugLog('✅ Backend health check passed', {
            status: response.status,
            data: response.data
        });
        return true;
    } catch (error) {
        debugLog('❌ Backend health check failed', {
            message: error.message,
            code: error.code
        }, 'error');
        return false;
    }
};

// Enhanced getUserReports function with debugging
export const getUserReports = (params = {}) => {
    debugLog('👤 Calling getUserReports API', {
        params,
        tokenExists: !!localStorage.getItem('accessToken'),
        baseURL: BASE_URL
    });
    
    return api.get('/reports/user/me', { 
        params,
        timeout: 15000 // 15 second timeout for this specific endpoint
    });
};

export * from "./auth.js";
export * from "./report.js";
export * from "./department.js";
export * from "./municipality.js";
export * from "./admin.js";