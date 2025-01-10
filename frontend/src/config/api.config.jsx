//api.config.jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const endpoints = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`
    },
    export:{
        test: (testId, format) => `${API_BASE_URL}/export/${testId}?format=${format}`
    },
    // In api.config.jsx, add to the existing endpoints object:
    questions: {
        create: `${API_BASE_URL}/questions/create`,
        getById: (id) => `${API_BASE_URL}/questions/${id}`,
        getAll: `${API_BASE_URL}/questions`,
        getNotInTest: (testId) => `${API_BASE_URL}/questions/not-in-test/${testId}`,
        update: (id) => `${API_BASE_URL}/questions/${id}`,
        delete: (id) => `${API_BASE_URL}/questions/${id}`,
        getByTestId: (testId) => `${API_BASE_URL}/questions/test/${testId}`,
        createInTest: (testId) => `${API_BASE_URL}/questions/test/${testId}/create`,
        addToTest: (testId, questionId) => `${API_BASE_URL}/questions/${testId}/questions/${questionId}`,
        removeFromTest: (testId, questionId) => `${API_BASE_URL}/questions/${testId}/questions/${questionId}`
    },
    answers: {
        create: `${API_BASE_URL}/answers`,
        getByQuestionId: (questionId) => `${API_BASE_URL}/answers/question/${questionId}`,
        update: (id) => `${API_BASE_URL}/answers/${id}`,
        delete: (id) => `${API_BASE_URL}/answers/${id}`
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
        start: (testId, studentId) => `${API_BASE_URL}/tests/start/${testId}?studentId=${studentId}`,
        getForTeacher: (id) => `${API_BASE_URL}/tests/get-test-for-teacher/${id}`,
        updateFromTeacher: (id) => `${API_BASE_URL}/tests/update-test-from-teacher/${id}`,
    },
    studentTests: {
        getAttempts: (testId) => `${API_BASE_URL}/student-tests/attempts/${testId}`,
        getDetails: (id) => `${API_BASE_URL}/student-tests/${id}`,
        take: (id) => `${API_BASE_URL}/student-tests/${id}/take`,
        submit: (id) => `${API_BASE_URL}/student-tests/${id}/submit`,
        cancel: (id) => `${API_BASE_URL}/student-tests/cancel/${id}`,
        getResults: (id) => `${API_BASE_URL}/student-tests/results/${id}`,

    },
    files: {
        download: (id) => `${API_BASE_URL}/files/download/${id}/inline`
    }
};

export default API_BASE_URL;