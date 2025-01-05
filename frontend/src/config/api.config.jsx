//api.config.jsx
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
        getAll: `${API_BASE_URL}/tests`,
        getById: (id) => `${API_BASE_URL}/tests/${id}`,
        create: `${API_BASE_URL}/tests`,
        update: (id) => `${API_BASE_URL}/tests/${id}`,
        delete: (id) => `${API_BASE_URL}/tests/${id}`,
        start: (testId, studentId) => `${API_BASE_URL}/tests/start/${testId}?studentId=${studentId}`
    },
    studentTests: {
        getAttempts: (testId, studentId) => `${API_BASE_URL}/student-tests/attempts/${testId}?studentId=${studentId}`,
        getDetails: (id) => `${API_BASE_URL}/student-tests/${id}`
    }
};

export default API_BASE_URL;