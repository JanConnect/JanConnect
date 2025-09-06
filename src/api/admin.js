import { api } from "./index.js";

export const adminLogin = (credentials) => {
  return api.post('/admin/login', credentials, {
    headers: { "Content-Type": "application/json" },
  });
};

// Dashboard Statistics
export const getDashboardStats = (params = {}) => {
  return api.get('/admin/dashboard/stats', { params });
};

// Admin-level report management
export const getAllReportsAdmin = (params = {}) => {
  return api.get('/admin/reports', { params });
};

export const bulkUpdateReports = (data) => {
  return api.patch('/admin/reports/bulk-update', data, {
    headers: { "Content-Type": "application/json" },
  });
};

export const exportReports = (params = {}) => {
  return api.get('/admin/reports/export', { params });
};

// User Management
export const getSystemUsers = (params = {}) => {
  return api.get('/admin/users', { params });
};

// Activity Logs
export const getActivityLogs = (params = {}) => {
  return api.get('/admin/activity-logs', { params });
};

