import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import testQuestionService from '../../services/testQuestionService';
import QuestionForm from "../../components/teacher/QuestionForm.jsx";

const CreateQuestionPage = ({ selectedQuestion, mode }) => {
    const { t } = useTranslation("common");
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const formMode = mode ?? 'create';

    const handleSubmit = async (questionData) => {
        setLoading(true);
        setError(null);

        try {
            await testQuestionService.createQuestionInTest(testId, questionData);
            navigate(`/teacher-dashboard/test/${testId}/questions`);
        } catch (err) {
            setError(`${t('createQuestion.error.creationFailed')} ${err.message}`);
            console.error('Error creating question:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        to={`/teacher-dashboard/test/${testId}/questions`}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        {t('createQuestion.backToQuestions')}
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-blue-600 mb-8">
                    {t('createQuestion.pageTitle')}
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <QuestionForm
                    onSubmit={handleSubmit}
                    isEditing={false}
                    loading={loading}
                    initialData={selectedQuestion || { creatorId: user?.id }}
                    mode={formMode}
                />
            </div>
        </div>
    );
};

export default CreateQuestionPage;