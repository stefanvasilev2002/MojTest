import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import QuestionForm from '../../components/teacher/QuestionForm';
import { useAuth } from '../../context/AuthContext';


const CreateFutureQuestion = () => {
    const { t } = useTranslation("common");
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (questionData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/questions/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...questionData,
                    creatorId: user.id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create question');
            }

            // Navigate back to dashboard with success message
            navigate('/teacher-dashboard', {
                state: {
                    notification: {
                        type: 'success',
                        message: t('questionCreation.success')
                    }
                }
            });
        } catch (err) {
            console.error('Error creating question:', err);
            setError(
                err.response?.data?.message ||
                t('questionCreation.error')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        to="/teacher-dashboard"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t('questionCreation.backToDashboard')}
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {t('questionCreation.title')}
                        </h1>
                        <p className="text-gray-600">
                            {t('questionCreation.description')}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <QuestionForm
                        onSubmit={handleSubmit}
                        loading={loading}
                        initialData={{ creatorId: user?.id }}
                        mode="create"
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateFutureQuestion;