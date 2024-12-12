// src/pages/teacher/EditTestPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TestForm from "../../components/crud/TestForm.jsx";
import useTest from '../../hooks/crud/useTest';

const EditTestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getItem, updateItem } = useTest();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const data = await getItem(id);
                setTest(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching test:', err);
            }
        };
        fetchTest();
    }, [id, getItem]);

    const handleSubmit = async (formData) => {
        try {
            await updateItem(id, formData);
            navigate('/teacher-dashboard');
        } catch (error) {
            console.error('Error updating test:', error);
            alert('Failed to update test: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-gray-600">Loading test...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">Edit Test</h1>
                <TestForm
                    initialData={test}
                    onSubmit={handleSubmit}
                    isEditing={true}
                />
            </div>
        </div>
    );
};

export default EditTestPage;