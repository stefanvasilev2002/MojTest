import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QuestionForm from "../../components/teacher/QuestionForm.jsx";
import useQuestion from '../../hooks/crud/useQuestion';

const EditQuestionPage = () => {
    const { testId, questionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getItem, updateItem } = useQuestion();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await getItem(questionId);
                setQuestion(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching question:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (!isInitialValuesSet) {
            fetchQuestion();
            setIsInitialValuesSet(true);
        }
    }, [questionId, getItem, isInitialValuesSet]);

    const handleSubmit = async (formData) => {
        try {
            await updateItem(questionId, testId ? { ...formData, testId } : formData);

            // Navigate based on context
            if (testId) {
                navigate(`/teacher-dashboard/test/${testId}/questions`);
            } else {
                navigate('/teacher-dashboard/questions');
            }
        } catch (error) {
            // Check if it's a foreign key constraint error
            if (error.message?.includes('violates foreign key constraint') ||
                error.message?.includes('referenced from table "student_answer"') ||
                error.message?.includes('409')) {
                setError('This question cannot be modified because it has been used in student answers. Please create a new question instead.');
            } else {
                setError(error.message || 'An error occurred while updating the question');
            }
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">Edit Question</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <QuestionForm
                    onSubmit={handleSubmit}
                    isEditing={true}
                    initialData={question}
                />
            </div>
        </div>
    );
};

export default EditQuestionPage;