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
        try {
            await service.delete(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
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
