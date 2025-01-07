// src/pages/teacher/CreateTestPage.jsx
import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TestForm from "../../components/teacher/TestForm.jsx";
import useTest from '../../hooks/crud/useTest';  // Use your existing hook
import { useTranslation } from 'react-i18next';

const CreateTestPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createItem } = useTest();  // Use your existing CRUD hook
    const location = useLocation();
    const userId = location.state?.userId;
    const { t } = useTranslation('common');

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
                <h1 className=" space-y-6 max-w-2xl mx-auto text-3xl font-bold text-blue-600 mb-8">{t('testForm.pageTitle')}</h1>
                <TestForm
                    onSubmit={handleSubmit}
                    isEditing={false}
                    userId={userId}
                />
            </div>
        </div>
    );
};

export default CreateTestPage;