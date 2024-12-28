import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';  // Added Link import here
import { useAuth } from '../../context/authContext';
import testQuestionService from '../../services/testQuestionService';
import QuestionForm from "../../components/teacher/QuestionForm.jsx";

const CreateQuestionPage = ({ selectedQuestion, mode }) => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const formMode = mode ?? 'create'; // Uses the Nullish Coalescing Operator

    const handleSubmit = async (questionData) => {
        setLoading(true);
        setError(null);

        try {
            // Create the question in the test using the form data
            await testQuestionService.createQuestionInTest(testId, questionData);
            // Navigate back to the list of questions in the test
            navigate(`/teacher-dashboard/test/${testId}/questions`);
        } catch (err) {
            setError(err.message);
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
                        ← Back to Questions
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-blue-600 mb-8">Create New Question</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Pass the selected question data or use default new question setup */}
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
