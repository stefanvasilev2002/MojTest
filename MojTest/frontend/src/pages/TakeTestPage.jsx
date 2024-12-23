import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import RadioAnswer from "../components/answers/RadioAnswer.jsx";
import MultipleChoiceAnswer from "../components/answers/MultipleChoiceAnswer.jsx";
import NumericAnswer from "../components/answers/NumericAnswer.jsx";
import EssayAnswer from "../components/answers/EssayAnswer.jsx";

const TakeTestPage = () => {
    const {studentTestId} = useParams();
    const {state: initialState} = useLocation();
    const {user} = useAuth();
    const navigate = useNavigate();

    const [testData, setTestData] = useState(initialState || null);
    const [loading, setLoading] = useState(!initialState);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        console.log("Initial state from location:", initialState);

        if (!testData) {
            console.log("Fetching test data...");
            fetchTestData();
        } else {
            const initialAnswers = {};
            testData.questions.forEach(question => {
                initialAnswers[question.questionId] = null;
            });
            setAnswers(initialAnswers);
        }
    }, [studentTestId]);

    const fetchTestData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/student-tests/${studentTestId}/take`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch test data');
            }

            const data = await response.json();
            console.log("Fetched test data:", data);
            setTestData(data);
            setLoading(false);

            const initialAnswers = {};
            data.questions.forEach(question => {
                initialAnswers[question.questionId] = question.questionType === 'MULTIPLE_CHOICE' ? [] : null;
            });
            setAnswers(initialAnswers);
        } catch (err) {
            console.error('Error fetching test data:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({...answers, [questionId]: answer});
    };

    const handleCheckBoxChange = (questionId, answerId) => {
        const currentAnswers = Array.isArray(answers[questionId]) ? answers[questionId] : [];
        const isSelected = currentAnswers.includes(answerId);

        setAnswers({
            ...answers,
            [questionId]: isSelected
                ? currentAnswers.filter(id => id !== answerId)
                : [...currentAnswers, answerId],
        });
    };

    const handleSubmitTest = async () => {
        try {
            const answersToSend = Object.entries(answers).flatMap(([questionId, answerValue]) => {
                const question = testData.questions.find(q => q.questionId.toString() === questionId);
                if (!question || !answerValue) return [];

                switch (question.questionType) {
                    case 'MULTIPLE_CHOICE':
                        const answerIds = Array.isArray(answerValue) ? answerValue : [answerValue];
                        return answerIds.map(answerId => ({
                            questionId: parseInt(questionId),
                            answerId: parseInt(answerId),
                            questionType: question.questionType
                        }));
                    case 'NUMERIC':
                    case 'ESSAY':
                    case 'FILL_IN_THE_BLANK':
                        return [{
                            questionId: parseInt(questionId),
                            textAnswer: answerValue.toString(),
                            questionType: question.questionType
                        }];
                    case 'TRUE_FALSE':
                        return [{
                            questionId: parseInt(questionId),
                            answerId: parseInt(answerValue),
                            questionType: question.questionType
                        }];
                    default:
                        return [];
                }
            }).filter(answer => answer !== null);

            console.log('Submitting answers:', answersToSend);

            const response = await fetch(`http://localhost:8080/api/student-tests/${studentTestId}/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(answersToSend),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit test: ${errorText}`);
            }

            const feedback = await response.json();
            console.log('Test feedback:', feedback);

            navigate('/test-results', {state: feedback});
        } catch (err) {
            console.error('Error submitting test:', err);
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">Loading test...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error loading test: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">{testData.testTitle}</h1>
                <p className="text-lg text-gray-600 mb-4">Time limit: {testData.timeLimit} minutes</p>
                <div className="space-y-6">
                    {testData.questions.map((question, index) => (
                        <div key={question.questionId} className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">
                                Question {index + 1}: {question.description}
                            </h2>
                            <p className="text-gray-500 mb-4">Points: {question.points}</p>
                            <div className="space-y-2">
                                {question.questionType === 'TRUE_FALSE' && (
                                    <RadioAnswer
                                        question={question}
                                        questionId={question.questionId}
                                        correctAnswer={answers[question.questionId]}
                                        onAnswerChange={handleAnswerChange}
                                    />
                                )}
                                {question.questionType === 'MULTIPLE_CHOICE' && (
                                    <MultipleChoiceAnswer
                                        question={question}
                                        questionId={question.questionId}
                                        selectedAnswers={answers[question.questionId] || []}
                                        onAnswerChange={handleCheckBoxChange}
                                    />
                                )}
                                {question.questionType === 'NUMERIC' && (
                                    <NumericAnswer
                                        question={question}
                                        questionId={question.questionId}
                                        correctAnswer={answers[question.questionId]}
                                        onAnswerChange={handleAnswerChange}
                                    />
                                )}
                                {question.questionType === 'ESSAY' && (
                                    <EssayAnswer
                                        question={question}
                                        questionId={question.questionId}
                                        correctAnswer={answers[question.questionId]}
                                        onAnswerChange={handleAnswerChange}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={handleSubmitTest}
                >
                    Submit Test
                </button>
            </div>
        </div>
    );
};

export default TakeTestPage;