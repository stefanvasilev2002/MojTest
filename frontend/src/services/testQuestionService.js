import axios from 'axios';
import { endpoints } from '../config/api.config';

// Create axios instance with default config
const createAuthenticatedAxios = (token) => {
    return axios.create({
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

const testQuestionService = {
    // Question CRUD operations
    createQuestion: async (questionDTO, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.post(endpoints.questions.create, questionDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to create question');
        }
    },

    getQuestionById: async (id, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.get(endpoints.questions.getById(id));
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch question');
        }
    },

    getAllQuestions: async (token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.get(endpoints.questions.getAll);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch questions');
        }
    },

    getAllQuestionsNotInTest: async (testId, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.get(endpoints.questions.getNotInTest(testId));
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch questions');
        }
    },

    updateQuestion: async (id, questionDTO, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.put(endpoints.questions.update(id), questionDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to update question');
        }
    },

    deleteQuestion: async (id, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            await axiosInstance.delete(endpoints.questions.delete(id));
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to delete question');
        }
    },

    getQuestionsByTestId: async (testId, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.get(endpoints.questions.getByTestId(testId));
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch test questions');
        }
    },

    // Answer CRUD operations
    createAnswer: async (answerDTO, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.post(endpoints.answers.create, answerDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to create answer');
        }
    },

    getAnswersByQuestionId: async (questionId, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.get(endpoints.answers.getByQuestionId(questionId));
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to fetch answers');
        }
    },

    updateAnswer: async (id, answerDTO, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.put(endpoints.answers.update(id), answerDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to update answer');
        }
    },

    deleteAnswer: async (id, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            await axiosInstance.delete(endpoints.answers.delete(id));
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to delete answer');
        }
    },

    // Test-Question Management operations
    createQuestionInTest: async (testId, questionCreateDTO, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.post(endpoints.questions.createInTest(testId), questionCreateDTO);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to create question in test');
        }
    },

    addQuestionToTest: async (testId, questionId, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.post(endpoints.questions.addToTest(testId, questionId));
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to add question to test');
        }
    },

    removeQuestionFromTest: async (testId, questionId, token) => {
        try {
            const axiosInstance = createAuthenticatedAxios(token);
            const response = await axiosInstance.delete(endpoints.questions.removeFromTest(testId, questionId));
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data || 'Failed to remove question from test');
        }
    }
};

export default testQuestionService;