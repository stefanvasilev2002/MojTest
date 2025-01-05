import TestForm from "../../components/teacher/TestForm.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import { useTranslation } from 'react-i18next';

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
            try {
                const response = await fetch(`http://localhost:8080/api/tests/get-test-for-teacher/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error(t('editTest.fetchError'));
                const data = await response.json();

                const metadataMap = {};
                data.metadata?.forEach(meta => {
                    metadataMap[meta.key] = meta.value;
                });

                setTest({
                    ...data,
                    metadata: metadataMap
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [id, user.token, t]);

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch(`http://localhost:8080/api/tests/update-test-from-teacher/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error(t('editTest.updateError'));
            navigate('/teacher-dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-4">{t('editTest.loading')}</div>;
    if (error) return <div className="p-4 text-red-600">{t('editTest.error')}{error}</div>;

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">
                    {t('editTest.title')}
                </h1>
                <TestForm
                    initialData={test}
                    onSubmit={handleSubmit}
                    isEditing={true}
                    userId={user.id}
                    mode='edit'
                />
            </div>
        </div>
    );
};

export default EditTestPage;