import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useQuestion from '../../hooks/crud/useQuestion';
import axios from 'axios';
import testQuestionService from "../../services/testQuestionService.js";
import QuestionList from "../../components/teacher/QuestionList.jsx";

const TestQuestionsPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        items: testQuestions,
        loading: testQuestionsLoading,
        error: testQuestionsError,
        deleteItem: deleteQuestion,
        refreshItems: refreshTestQuestions
    } = useQuestion(testId);

    useEffect(()=>{
    }, [testQuestions, testQuestionsLoading])

    // State for question bank
    const [questionBank, setQuestionBank] = useState([]);
    const [bankLoading, setBankLoading] = useState(true);
    const [bankError, setBankError] = useState(null);

    // Fetch question bank (excluding questions already in the test)
    useEffect(() => {
        const fetchQuestionBank = async () => {
            try {
                setBankLoading(true);
                const response = await axios.get('/api/questions');
                const allQuestions = response.data;

                // Filter out questions that are already in the test
                const bankQuestions = allQuestions.filter(
                    q => !testQuestions.some(tq => tq.id === q.id)
                );
                setQuestionBank(bankQuestions);

                setBankError(null);
            } catch (error) {
                setBankError(error.message);
            } finally {
                setBankLoading(false);
            }
        };

        if (!testQuestionsLoading) {
            fetchQuestionBank();
        }
    }, [testQuestions, testQuestionsLoading]);

    const handleCreateQuestion = () => {
        navigate(`/teacher-dashboard/test/${testId}/questions/create`);
    };

    const handleEditQuestion = (questionId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions/${questionId}/edit`);
    };

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await deleteQuestion(questionId);
                await refreshTestQuestions(); // Refresh the questions list
            } catch (error) {
                console.error('Error deleting question:', error);
                alert('Failed to delete question: ' + error.message);
            }
        }
    };

    const handleAddFromBank = async (questionId) => {
        try {
            await testQuestionService.addQuestionToTest(testId, questionId);
            await refreshTestQuestions();
            setQuestionBank(prev => prev.filter(q => q.id !== questionId));
        } catch (error) {
            console.error('Error adding question from bank:', error);
            alert('Failed to add question to test: ' + error.message);
        }
    };

    const handleRemoveFromTest = async (questionId) => {
        if (window.confirm('Remove this question from the test?')) {
            try {
                await testQuestionService.removeQuestionFromTest(testId, questionId);
                const removedQuestion = testQuestions.find(q => q.id === questionId);
                setQuestionBank(prev => [...prev, removedQuestion]);
                await refreshTestQuestions();
            } catch (error) {
                console.error('Error removing question from test:', error);
                alert('Failed to remove question from test: ' + error.message);
            }
        }
    };

    const getQuestionTypeLabel = (type) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)
        ).join(' ');
    };

    if (testQuestionsLoading || bankLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (testQuestionsError || bankError) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {testQuestionsError || bankError}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">Test Questions</h1>
                    <button
                        onClick={handleCreateQuestion}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Create New Question
                    </button>
                </div>

                <QuestionList
                    questions={testQuestions}
                    onEdit={handleEditQuestion}
                    onRemove={handleRemoveFromTest}
                    onDelete={handleDeleteQuestion}
                />

                {/* Question Bank Section */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Question Bank</h2>
                    <div className="grid gap-4">
                        {questionBank.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-gray-600">No additional questions available in the question bank.</p>
                            </div>
                        ) : (
                            questionBank.map(question => (
                                <div
                                    key={question.id}
                                    className="bg-white rounded-lg shadow p-6"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-semibold">{question.description}</h3>
                                                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                                    {getQuestionTypeLabel(question.questionType)}
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
                                        </div>
                                        <button
                                            onClick={() => handleAddFromBank(question.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Add to Test
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestQuestionsPage;