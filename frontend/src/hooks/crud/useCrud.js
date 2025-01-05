import { useState, useEffect } from "react";
import crudService from "../../services/crud/crudService.js";

const useCrud = (entity) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const service = crudService(entity);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const response = await service.fetchAll();
            setItems(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchById = async (id) => {
        console.log("Fetching data for ID:", id);  // Log the ID here
        setLoading(true);
        try {
            const response = await service.fetchById(id);
            return response.data;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const create = async (data) => {
        try {
            const response = await service.create(data);
            setItems((prev) => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const update = async (id, data) => {
        console.log("Updating item with ID:", id, "and data:", data);  // Log the ID and data
        try {
            const response = await service.update(id, data);
            setItems((prev) =>
                prev.map((item) => (item.id === id ? response.data : item))
            );
            return response.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const remove = async (id) => {
        console.log("Attempting to delete item with ID:", id);  // Log the ID here
        try {
            await service.delete(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.log("Error deleting item:", err);  // Log error if deletion fails
            setError(err.message);
            throw err;
        }
    };


    useEffect(() => {
        fetchAll();
    }, []); // Automatically fetch all items on mount

    return { items, loading, error, fetchAll, fetchById, create, update, remove };
};

export default useCrud;
