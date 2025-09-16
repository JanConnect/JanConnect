import { api } from "./index.js";

// Get all departments with filtering
export const getAllDepartments = (params = {}) => {
    return api.get('/departments', { params });
};

// Get departments by municipality
export const getDepartmentsByMunicipality = (municipalityId) => {
    return api.get(`/departments/municipality/${municipalityId}`);
};

// Get departments by category
export const getDepartmentsByCategory = (category) => {
    return api.get(`/departments/category/${category}`);
};

// Get department by ID
export const getDepartmentById = (departmentId) => {
    return api.get(`/departments/${departmentId}`);
};

// Get department analytics (Staff/Admin only)
export const getDepartmentAnalytics = (departmentId, params = {}) => {
    return api.get(`/departments/${departmentId}/analytics`, { params });
};

// Create department (Admin only)
export const createDepartment = (data) => {
    return api.post('/departments/create', data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Update department (Admin only)
export const updateDepartment = (departmentId, data) => {
    return api.patch(`/departments/${departmentId}`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Delete department (Admin only)
export const deleteDepartment = (departmentId) => {
    return api.delete(`/departments/${departmentId}`);
};

// Add staff to department (Admin only)
export const addStaffToDepartment = (departmentId, data) => {
    return api.post(`/departments/${departmentId}/staff`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Remove staff from department (Admin only)
export const removeStaffFromDepartment = (departmentId, userId) => {
    return api.delete(`/departments/${departmentId}/staff/${userId}`);
};

// Assign report to staff (Staff/Admin)
export const assignReportToStaff = (departmentId, data) => {
    return api.post(`/departments/${departmentId}/assign-report`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Get available staff for assignment
export const getAvailableStaff = (departmentId, params = {}) => {
    return api.get(`/departments/${departmentId}/available-staff`, { params });
};
