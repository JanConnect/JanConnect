import { api } from "./index.js";

// User registration with avatar
export const registerUser = (formData) => {
    return api.post('/user/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// User login
export const loginUser = (credentials) => {
    return api.post('/user/login', credentials, {
        headers: { 
            "Content-Type": "application/json" 
        },
    });
};

// Get current user profile
export const getCurrentUser = () => {
    return api.get('/user/current-user');
};

// Update access token
export const updateAccessToken = () => {
    return api.post('/user/update-access-token');
};

// User logout
export const logoutUser = () => {
    return api.post('/user/logout');
};


