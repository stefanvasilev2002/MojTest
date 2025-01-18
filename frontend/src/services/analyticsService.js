import api from './api';
import { endpoints } from '../config/api.config';

export const analyticsService = {
    async getOverview() {
        const response = await api.get(endpoints.analytics.overview);
        return response.data;
    },

    async getStudentPerformance() {
        const response = await api.get(endpoints.analytics.studentPerformance);
        return response.data;
    },

    async getTestStatistics() {
        const response = await api.get(endpoints.analytics.testStatistics);
        return response.data;
    },

    async getQuestionAnalytics() {
        const response = await api.get(endpoints.analytics.questionAnalytics);
        return response.data;
    },

    async getTeacherStatistics() {
        const response = await api.get(endpoints.analytics.teacherStatistics);
        return response.data;
    }
};
