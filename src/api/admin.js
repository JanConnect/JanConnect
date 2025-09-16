import { api } from "./index.js";

// Admin authentication
export const adminLogin = (credentials) => {
    return api.post('/admin/login', credentials, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Dashboard & Analytics
export const getDashboardStats = (params = {}) => {
    return api.get('/admin/dashboard/stats', { params });
};

export const getSystemHealth = () => {
    return api.get('/admin/system/health');
};

// Report Management
export const getAllReportsAdmin = (params = {}) => {
    return api.get('/admin/reports', { params });
};

export const bulkUpdateReports = (data) => {
    return api.patch('/admin/reports/bulk-update', data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

export const exportReports = (params = {}) => {
    return api.get('/admin/reports/export', { params });
};

// User Management
export const getSystemUsers = (params = {}) => {
    return api.get('/admin/users', { params });
};

export const createAdminUser = (formData) => {
    return api.post('/admin/users/create-admin', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const updateUserRole = (userId, data) => {
    return api.patch(`/admin/users/${userId}/role`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

export const toggleUserStatus = (userId) => {
    return api.patch(`/admin/users/${userId}/toggle-status`);
};

// System Monitoring
export const getActivityLogs = (params = {}) => {
    return api.get('/admin/activity-logs', { params });
};

export const getPerformanceMetrics = (params = {}) => {
    return api.get('/admin/system/performance', { params });
};

// Data Management
export const backupSystemData = () => {
    return api.post('/admin/data/backup');
};

export const importData = (formData) => {
    return api.post('/admin/data/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const cleanupOldData = (params = {}) => {
    return api.delete('/admin/data/cleanup', { params });
};

// Notifications
export const broadcastNotification = (data) => {
    return api.post('/admin/notifications/broadcast', data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

export const getNotificationHistory = (params = {}) => {
    return api.get('/admin/notifications/history', { params });
};
