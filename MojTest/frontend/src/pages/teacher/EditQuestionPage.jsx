// src/pages/teacher/EditQuestionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QuestionForm from "../../components/crud/QuestionForm.jsx";
import useQuestion from '../../hooks/crud/useQuestion';  // Assuming you have this hook

const EditQuestionPage = () => {
    const { testId, questionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getItem, updateItem } = useQuestion();  // Use your existing CRUD hook
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const data = await getItem(questionId);
                setQuestion(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchQuestion();
    }, [questionId, getItem]);

    const handleSubmit = async (formData) => {
        try {
            await updateItem(questionId, { ...formData, testId });
            navigate(`/teacher-dashboard/test/${testId}/questions`);
        } catch (error) {
            console.error('Error updating question:', error);
            alert('Failed to update question: ' + error.message);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">Edit Question</h1>
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