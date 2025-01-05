// src/hooks/crud/useQuestion.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/questions';

const useQuestion = (testId = null) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (testId) {
            fetchQuestionsByTest();
        } else {
            fetchAllQuestions();
        }
    }, [testId]);

    const fetchAllQuestions = async () => {
        try {
            const response = await axios.get(BASE_URL);
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
            const response = await axios.get(`${BASE_URL}/test/${testId}`);
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
            const response = await axios.post(BASE_URL, data);
            setItems(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error creating question:', err);
            throw err;
        }
    };

    const updateItem = async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, data);
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
            await axios.delete(`${BASE_URL}/${id}`);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting question:', err);
            throw err;
        }
    };

    const getItem = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
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