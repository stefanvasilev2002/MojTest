import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import testQuestionService from '../../services/testQuestionService';

const CreateQuestionPage = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState('MULTIPLE_CHOICE');
    const [formData, setFormData] = useState({
        description: '',
        points: 1,
        negativePointsPerAnswer: 0,
        hint: '',
        formula: '',
        type: 'MULTIPLE_CHOICE',  // Changed from questionType to type
        creatorId: user?.id,
        answers: [
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false }
        ]
    });

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setSelectedType(type);
        setFormData(prev => ({
            ...prev,
            type: type,  // Changed from questionType to type
            answers: getInitialAnswers(type)
        }));
    };

    const getInitialAnswers = (type) => {
        switch (type) {
            case 'MULTIPLE_CHOICE':
                return Array(4).fill().map(() => ({ answerText: '', isCorrect: false }));
            case 'TRUE_FALSE':
                return [
                    { answerText: 'True', isCorrect: false },
                    { answerText: 'False', isCorrect: false }
                ];
            case 'FILL_IN_THE_BLANK':
                return [{ answerText: '', isCorrect: true }];
            case 'NUMERIC':
                return [{ answerText: '', isCorrect: true }];
            case 'ESSAY':
                return [{ answerText: '', isCorrect: true }];
            default:
                return [];
        }
    };
    const handleNumericAnswer = (e, index) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            handleAnswerChange(index, 'answerText', value);
        }
    };
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleAnswerChange = (index, field, value) => {
        setFormData(prev => {
            const newAnswers = [...prev.answers];
            newAnswers[index] = {
                ...newAnswers[index],
                [field]: field === 'isCorrect' ? value : value
            };
            return {
                ...prev,
                answers: newAnswers
            };
        });
    };

    const addAnswer = () => {
        if (formData.answers.length < 8) {
            setFormData(prev => ({
                ...prev,
                answers: [...prev.answers, { answerText: '', isCorrect: false }]
            }));
        }
    };

    const removeAnswer = (index) => {
        if (formData.answers.length > 2) {
            setFormData(prev => ({
                ...prev,
                answers: prev.answers.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validation
            if (!formData.description.trim()) {
                throw new Error('Question description is required');
            }

            if (!user?.id) {
                throw new Error('You must be logged in to create questions');
            }

            if (selectedType !== 'ESSAY' && formData.answers.length === 0) {
                throw new Error('At least one answer is required');
            }

            if (selectedType === 'MULTIPLE_CHOICE' && !formData.answers.some(a => a.isCorrect)) {
                throw new Error('At least one correct answer must be selected');
            }

            if (selectedType === 'ESSAY' && formData.answers[0].answerText.trim() === '') {
                throw new Error('Answer template is required for essay questions');
            }
            // Filter out empty answers
            const validAnswers = formData.answers.filter(a => a.answerText.trim() !== '');

            if (validAnswers.length === 0) {
                throw new Error('At least one non-empty answer is required');
            }
            // Create question with creator ID
            const questionData = {
                ...formData,
                type: selectedType,  // Make sure to use 'type' instead of 'questionType'
                answers: validAnswers,
                creatorId: user.id
            };

            // First create the question
            const createdQuestion = await testQuestionService.createQuestion(questionData);

            // Then add it to the test
            await testQuestionService.addQuestionToTest(testId, createdQuestion.id);

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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={handleTypeChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                            <option value="TRUE_FALSE">True/False</option>
                            <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                            <option value="ESSAY">Essay</option>
                            <option value="NUMERIC">Numeric</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows="3"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your question here..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Points
                            </label>
                            <input
                                type="number"
                                name="points"
                                value={formData.points}
                                onChange={handleInputChange}
                                min="1"
                                required
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Negative Points per Wrong Answer
                            </label>
                            <input
                                type="number"
                                name="negativePointsPerAnswer"
                                value={formData.negativePointsPerAnswer}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hint (Optional)
                        </label>
                        <input
                            type="text"
                            name="hint"
                            value={formData.hint}
                            onChange={handleInputChange}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Provide a hint for students..."
                        />
                    </div>

                    {selectedType === 'NUMERIC' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Formula (Optional)
                            </label>
                            <input
                                type="text"
                                name="formula"
                                value={formData.formula}
                                onChange={handleInputChange}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter a mathematical formula..."
                            />
                        </div>
                    )}

                    {selectedType !== 'ESSAY' ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Answers</h3>
                                {selectedType === 'MULTIPLE_CHOICE' && (
                                    <button
                                        type="button"
                                        onClick={addAnswer}
                                        className="text-blue-600 hover:text-blue-800"
                                        disabled={formData.answers.length >= 8}
                                    >
                                        + Add Answer Option
                                    </button>
                                )}
                            </div>
                            {formData.answers.map((answer, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    {selectedType === 'NUMERIC' ? (
                                        <input
                                            type="text"
                                            value={answer.answerText}
                                            onChange={(e) => handleNumericAnswer(e, index)}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter numeric answer"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={answer.answerText}
                                            onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter answer"
                                            disabled={selectedType === 'TRUE_FALSE'}
                                        />
                                    )}

                                    {selectedType === 'MULTIPLE_CHOICE' && (
                                        <>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={answer.isCorrect || false}
                                                    onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2">Correct</span>
                                            </label>
                                            {formData.answers.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeAnswer(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {selectedType === 'TRUE_FALSE' && (
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={answer.isCorrect}
                                                onChange={() => {
                                                    const newAnswers = formData.answers.map((a, i) => ({
                                                        ...a,
                                                        isCorrect: i === index
                                                    }));
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        answers: newAnswers
                                                    }));
                                                }}
                                                className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2">Correct</span>
                                        </label>
                                    )}

                                    {(selectedType === 'FILL_IN_THE_BLANK' || selectedType === 'NUMERIC') && (
                                        <input
                                            type="hidden"
                                            value="true"
                                            onChange={() => {}}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Answer Template (Optional)</h3>
                            <textarea
                                value={formData.answers[0]?.answerText || ''}
                                onChange={(e) => handleAnswerChange(0, 'answerText', e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows="4"
                                placeholder="Enter answer..."
                            />
                        </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-6">
                        <Link
                            to={`/teacher-dashboard/test/${testId}/questions`}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQuestionPage;