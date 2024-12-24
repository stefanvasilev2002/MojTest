import { useState, useEffect } from 'react';
import axios from 'axios';

const useAnswer = (questionId = null) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (questionId) {
            fetchAnswersByQuestion();
        }
    }, [questionId]);

    const fetchAnswersByQuestion = async () => {
        try {
            const response = await axios.get(`/api/answers/question/${questionId}`);
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
            const response = await axios.post('/api/answers', data);
            setItems(prevItems => [...prevItems, response.data]);
            return response.data;
        } catch (err) {
            throw err;
        }
    };

    const updateItem = async (id, data) => {
        try {
            const response = await axios.put(`/api/answers/${id}`, data);
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
            await axios.delete(`/api/answers/${id}`);
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
        refreshItems: questionId ? fetchAnswersByQuestion : null
    };
};

export default useAnswer;