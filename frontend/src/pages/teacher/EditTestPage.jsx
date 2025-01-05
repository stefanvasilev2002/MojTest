import TestForm from "../../components/teacher/TestForm.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTranslation } from 'react-i18next';
import { endpoints } from '../../config/api.config.jsx';

const EditTestPage = () => {
    const { t } = useTranslation("common");
    const { id } = useParams();
    const navigate = useNavigate();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchTest = async () => {
            if (!user?.token || !id) {
                setError(t('editTest.invalidParams'));
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(endpoints.tests.getForTeacher(id), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(errorData || t('editTest.fetchError'));
                }

                const data = await response.json();

                const metadataMap = {};
                data.metadata?.forEach(meta => {
                    metadataMap[meta.key] = meta.value;
                });

                setTest({
                    ...data,
                    metadata: metadataMap
                });
                setError(null);
            } catch (err) {
                console.error('Error fetching test:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [id, user?.token, t]);

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch(endpoints.tests.updateFromTeacher(id), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || t('editTest.updateError'));
            }

            navigate('/teacher-dashboard');
        } catch (err) {
            console.error('Error updating test:', err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-lg">{t('editTest.loading')}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {t('editTest.error')} {error}
                    </div>
                    <button
                        onClick={() => navigate('/teacher-dashboard')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {t('common.backToDashboard')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">
                    {t('editTest.title')}
                </h1>
                <TestForm
                    initialData={test}
                    onSubmit={handleSubmit}
                    isEditing={true}
                    userId={user?.id}
                    mode='edit'
                />
            </div>
        </div>
    );
};

export default EditTestPage;