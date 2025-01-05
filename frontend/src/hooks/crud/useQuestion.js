import { useState, useEffect } from 'react';
import axios from 'axios';
import { endpoints } from '../../config/api.config';
import { useAuth } from '../../context/AuthContext';

const useQuestion = (testId = null) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Create axios instance with auth headers
    const axiosInstance = axios.create({
        headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
        }
    });

    useEffect(() => {
        if (user?.token) {
            if (testId) {
                fetchQuestionsByTest();
            } else {
                fetchAllQuestions();
            }
        }
    }, [testId, user?.token]);

    const fetchAllQuestions = async () => {
        try {
            const response = await axiosInstance.get(endpoints.questions.getAll);
            setItems(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching questions:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestionsByTest = async () => {
        try {
            const response = await axiosInstance.get(endpoints.questions.getByTestId(testId));
            setItems(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching test questions:', err);
        } finally {
            setLoading(false);
        }
    };

    const createItem = async (data) => {
        try {
            const response = await axiosInstance.post(endpoints.questions.create, data);
            setItems(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error creating question:', err);
            throw err;
        }
    };

    const updateItem = async (id, data) => {
        try {
            const response = await axiosInstance.put(endpoints.questions.update(id), data);
            setItems(prev => prev.map(item =>
                item.id === id ? response.data : item
            ));
            return response.data;
        } catch (err) {
            console.error('Error updating question:', err);
            throw err;
        }
    };

    const deleteItem = async (id) => {
        try {
            await axiosInstance.delete(endpoints.questions.delete(id));
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting question:', err);
            throw err;
        }
    };

    const getItem = async (id) => {
        try {
            const response = await axiosInstance.get(endpoints.questions.getById(id));
            return response.data;
        } catch (err) {
            console.error('Error getting question:', err);
            throw err;
        }
    };

    return {
        items,
        loading,
        error,
        createItem,
        updateItem,
        deleteItem,
        getItem,
        refreshItems: testId ? fetchQuestionsByTest : fetchAllQuestions
    };
};

export default useQuestion;