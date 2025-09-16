import { api } from "./index.js";

// Create report with single image + optional voice message
export const createReport = (formData) => {
    return api.post('/reports/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Get all reports with advanced filtering
export const getAllReports = (params = {}) => {
    return api.get('/reports', { params });
};

// Get single report by ID
export const getReportById = (reportId) => {
    return api.get(`/reports/${reportId}`);
};

// Get user's own reports
export const getUserReports = (params = {}) => {
    return api.get('/reports/user/me', { params });
};

// Get reports analytics (Staff/Admin only)
export const getReportsAnalytics = (params = {}) => {
    return api.get('/reports/analytics', { params });
};

// Update report status with optional resolution image (Staff/Admin only)
export const updateReportStatus = (reportId, formData) => {
    return api.patch(`/reports/${reportId}/status`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Community engagement - Upvoting
export const upvoteReport = (reportId) => {
    return api.post(`/reports/${reportId}/upvote`);
};

export const removeUpvote = (reportId) => {
    return api.delete(`/reports/${reportId}/upvote`);
};

// Comments system
export const addComment = (reportId, data) => {
    return api.post(`/reports/${reportId}/comment`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

export const getReportComments = (reportId) => {
    return api.get(`/reports/${reportId}/comments`);
};

// Feedback system (Report creator only)
export const addFeedback = (reportId, data) => {
    return api.post(`/reports/${reportId}/feedback`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Delete report (Admin only)
export const deleteReport = (reportId) => {
    return api.delete(`/reports/${reportId}`);
};
