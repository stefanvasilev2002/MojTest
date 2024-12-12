// src/pages/teacher/CreateTestPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TestForm from "../../components/teacher/TestForm.jsx";
import useTest from '../../hooks/crud/useTest';  // Use your existing hook

const CreateTestPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createItem } = useTest();  // Use your existing CRUD hook

    const handleSubmit = async (formData) => {
        try {
            await createItem(formData);
            navigate('/teacher-dashboard');
        } catch (error) {
            console.error('Error creating test:', error);
            alert('Failed to create test: ' + error.message);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">Create New Test</h1>
                <TestForm
                    onSubmit={handleSubmit}
                    isEditing={false}
                />
            </div>
        </div>
    );
};

export default CreateTestPage;