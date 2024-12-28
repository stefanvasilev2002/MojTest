import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import testQuestionService from '../../services/testQuestionService';

const QuestionsPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [test, setTest] = useState(null);

    useEffect(() => {
        fetchTestAndQuestions().then(r => console.log('Questions fetched'));
    }, [testId]);

    const fetchTestAndQuestions = async () => {
        try {
            setLoading(true);
            // Fetch test details to check ownership
            const testData = await fetch(`http://localhost:8080/api/tests/${testId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
            });
            setTest(await testData.json());
            console.log('testData:', test);

            const questionsData = await testQuestionService.getQuestionsByTestId(testId);
            setQuestions(questionsData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const isCreator = test?.creatorId === user.id;

    const handleCreateQuestion = () => {
        navigate(`/teacher-dashboard/test/${testId}/questions/create`);
    };

    const handleEditQuestion = (questionId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions/${questionId}/edit`);
    };

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await testQuestionService.deleteQuestion(questionId);
                fetchTestAndQuestions(); // Refresh the list after deletion
            } catch (error) {
                setError(error.message);
                console.error('Error deleting question:', error);
            }
        }
    };

    const getQuestionTypeLabel = (type) => {
        return type?.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
            .join(' ') || 'Multiple Choice';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">Loading questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Link
                        to="/teacher-dashboard"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-600">Test Questions</h1>
                        {!isCreator && (
                            <p className="text-gray-600 mt-2">
                                Viewing questions for test created by Teacher {test?.name}
                            </p>
                        )}
                    </div>
                    {isCreator && (
                        <button
                            onClick={handleCreateQuestion}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Add New Question
                        </button>
                    )}
                </div>

                <div className="grid gap-6">
                    {questions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-600">
                                {isCreator
                                    ? "No questions available. Create your first question!"
                                    : "No questions available for this test."}
                            </p>
                        </div>
                    ) : (
                        questions.map(question => (
                            <div
                                key={question.id}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-xl font-semibold">{question.description}</h2>
                                            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                                {getQuestionTypeLabel(question.type)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span>Points: {question.points}</span>
                                            {question.negativePointsPerAnswer > 0 && (
                                                <span className="ml-4">
                                                    Negative points: {question.negativePointsPerAnswer}
                                                </span>
                                            )}
                                        </div>
                                        {question.hint && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <strong>Hint:</strong> {question.hint}
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <h3 className="font-medium mb-2">Answers:</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                {question.answers?.map((answer, index) => (
                                                    <li
                                                        key={index}
                                                        className={`${answer.isCorrect ? 'text-green-600' : 'text-gray-600'}`}
                                                    >
                                                        {answer.answerText}
                                                        {answer.isCorrect && ' ✓'}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    {isCreator && (
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => handleEditQuestion(question.id)}
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
                                    )}
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