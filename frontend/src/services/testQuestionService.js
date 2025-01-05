// src/services/testQuestionService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const testQuestionService = {
    // Question CRUD operations
    createQuestion: async (questionDTO) => {
        try {
            const response = await axios.post(`${BASE_URL}/questions`, questionDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to create question');
        }
    },

    getQuestionById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/questions/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch question');
        }
    },

    getAllQuestions: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/questions`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch questions');
        }
    },
    getAllQuestionsNotInTest: async (testId) => {
        try {
            const response = await axios.get(`${BASE_URL}/questions/not-in-test/${testId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch questions');
        }
    },
    updateQuestion: async (id, questionDTO) => {
        try {
            const response = await axios.put(`${BASE_URL}/questions/${id}`, questionDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to update question');
        }
    },

    deleteQuestion: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/questions/${id}`);
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to delete question');
        }
    },

    getQuestionsByTestId: async (testId) => {
        try {
            const response = await axios.get(`${BASE_URL}/questions/test/${testId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch test questions');
        }
    },

    // Answer CRUD operations
    createAnswer: async (answerDTO) => {
        try {
            const response = await axios.post(`${BASE_URL}/answers`, answerDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to create answer');
        }
    },

    getAnswersByQuestionId: async (questionId) => {
        try {
            const response = await axios.get(`${BASE_URL}/answers/question/${questionId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch answers');
        }
    },

    updateAnswer: async (id, answerDTO) => {
        try {
            const response = await axios.put(`${BASE_URL}/answers/${id}`, answerDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to update answer');
        }
    },
// Add this method to your testQuestionService
    createQuestionInTest: async (testId, questionCreateDTO) => {
        try {
            const response = await axios.post(`${BASE_URL}/questions/test/${testId}/create`, questionCreateDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to create question in test');
        }
    },
    deleteAnswer: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/answers/${id}`);
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to delete answer');
        }
    },

    // Test-Question Management operations
    addQuestionToTest: async (testId, questionId) => {
        try {
            const response = await axios.post(`${BASE_URL}/questions/${testId}/questions/${questionId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to add question to test');
        }
    },

    removeQuestionFromTest: async (testId, questionId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/questions/${testId}/questions/${questionId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to remove question from test');
        }
    }

};

export default testQuestionService;