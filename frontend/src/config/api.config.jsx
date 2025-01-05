const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const endpoints = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`
    },
    users: {
        getById: (id) => `${API_BASE_URL}/users/${id}`,
        update: (id) => `${API_BASE_URL}/users/${id}`
    },
    tests: {
        start: (testId, studentId) => `${API_BASE_URL}/tests/start/${testId}?studentId=${studentId}`
    }
    // Add other endpoints as needed
};

export default API_BASE_URL;