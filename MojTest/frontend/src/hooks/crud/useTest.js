// src/hooks/crud/useTest.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = 'http://localhost:8080/api/tests';

const useTest = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchItems();
    }, [user?.id]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(BASE_URL);
            setItems(response.data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching tests:', err);
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
            console.error('Error creating test:', err);
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
            console.error('Error updating test:', err);
            throw err;
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting test:', err);
            throw err;
        }
    };

    const getItem = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (err) {
            console.error('Error getting test:', err);
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
        refreshItems: fetchItems
    };
};

export default useTest;