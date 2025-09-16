import { api } from "./index.js";

// Get all municipalities with filtering
export const getAllMunicipalities = (params = {}) => {
    return api.get('/municipalities', { params });
};

// Get municipalities near a location
export const getMunicipalitiesNearLocation = (params = {}) => {
    return api.get('/municipalities/near', { params });
};

// Get specific municipality by ID
export const getMunicipalityById = (municipalityId) => {
    return api.get(`/municipalities/${municipalityId}`);
};

// Get municipality analytics
export const getMunicipalityAnalytics = (municipalityId, params = {}) => {
    return api.get(`/municipalities/${municipalityId}/analytics`, { params });
};

// Create municipality (Super Admin only)
export const createMunicipality = (data) => {
    return api.post('/municipalities/create', data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Update municipality (Super Admin only)
export const updateMunicipality = (municipalityId, data) => {
    return api.patch(`/municipalities/${municipalityId}`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Delete municipality (Super Admin only)
export const deleteMunicipality = (municipalityId) => {
    return api.delete(`/municipalities/${municipalityId}`);
};

// Add department to municipality (Admin only)
export const addDepartmentToMunicipality = (municipalityId, data) => {
    return api.post(`/municipalities/${municipalityId}/departments`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Manual assign report to department (Admin only)
export const manualAssignReport = (municipalityId, data) => {
    return api.post(`/municipalities/${municipalityId}/assign-report`, data, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};
