// src/pages/teacher/QuestionsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useQuestion from '../../hooks/crud/useQuestion';

const QuestionsPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getItems, deleteItem } = useQuestion();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, [testId]);

    const fetchQuestions = async () => {
        try {
            const data = await getItems({ testId });
            setQuestions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching questions:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;

        try {
            await deleteItem(questionId);
            await fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
            alert('Failed to delete question: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-gray-600">Loading questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Questions</h1>
                    <button
                        onClick={() => navigate(`/teacher-dashboard/test/${testId}/questions/create`)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Add Question
                    </button>
                </div>

                <div className="space-y-4">
                    {questions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-600">No questions yet. Add your first question!</p>
                        </div>
                    ) : (
                        questions.map(question => (
                            <div key={question.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold mb-2">{question.description}</h3>
                                        <p className="text-sm text-gray-500">Points: {question.points}</p>
                                        {question.answers && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500">
                                                    Number of answers: {question.answers.length}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/teacher-dashboard/test/${testId}/questions/${question.id}/edit`)}
                                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(question.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionsPage;