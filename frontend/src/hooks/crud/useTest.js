import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { endpoints } from '../../config/api.config';

const useTest = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Configure axios defaults for authentication
    const axiosConfig = {
        headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchItems();
        }
    }, [user?.token]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(endpoints.tests.getAll, axiosConfig);
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
            const response = await axios.post(endpoints.tests.create, data, axiosConfig);
            setItems(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            console.error('Error creating test:', err);
            throw err;
        }
    };

    const updateItem = async (id, data) => {
        try {
            const response = await axios.put(endpoints.tests.update(id), data, axiosConfig);
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
            await axios.delete(endpoints.tests.delete(id), axiosConfig);
            setItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting test:', err);
            throw err;
        }
    };

    const getItem = async (id) => {
        try {
            const response = await axios.get(endpoints.tests.getById(id), axiosConfig);
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