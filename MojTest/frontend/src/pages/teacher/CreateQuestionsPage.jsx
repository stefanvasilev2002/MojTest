// src/pages/teacher/CreateQuestionPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QuestionForm from "../../components/crud/QuestionForm.jsx";
import useQuestion from '../../hooks/crud/useQuestion';  // Assuming you have this hook

const CreateQuestionPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { createItem } = useQuestion();  // Use your existing CRUD hook

    const handleSubmit = async (formData) => {
        try {
            await createItem({ ...formData, testId });
            navigate(`/teacher-dashboard/test/${testId}/questions`);
        } catch (error) {
            console.error('Error creating question:', error);
            alert('Failed to create question: ' + error.message);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-8">Create New Question</h1>
                <QuestionForm
                    onSubmit={handleSubmit}
                    isEditing={false}
                    initialData={{ testId }}
                />
            </div>
        </div>
    );
};

export default CreateQuestionPage;