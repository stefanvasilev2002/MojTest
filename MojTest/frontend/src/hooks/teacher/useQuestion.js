// src/hooks/crud/useQuestion.js
import { useState, useEffect } from 'react';
import axios from 'axios';

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
            const response = await axios.get('/api/questions');
            setItems(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuestionsByTest = async () => {
        try {
            const response = await axios.get(`/api/questions/test/${testId}`);
            setItems(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createItem = async (data) => {
        try {
            const response = await axios.post('/api/questions', data);
            setItems(prevItems => [...prevItems, response.data]);
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const updateItem = async (id, data) => {
        try {
            const response = await axios.put(`/api/questions/${id}`, data);
            setItems(prevItems =>
                prevItems.map(item => item.id === id ? response.data : item)
            );
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`/api/questions/${id}`);
            setItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (err) {
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
        refreshItems: testId ? fetchQuestionsByTest : fetchAllQuestions
    };
};

export default useQuestion;