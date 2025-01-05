import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import RadioAnswer from "../../components/answers/RadioAnswer.jsx";
import MultipleChoiceAnswer from "../../components/answers/MultipleChoiceAnswer.jsx";
import NumericAnswer from "../../components/answers/NumericAnswer.jsx";
import EssayAnswer from "../../components/answers/EssayAnswer.jsx";
import HintButton from "../../components/student/HintButton.jsx";
import Timer from "../../components/student/Timer.jsx";
import TimeUpModal from "../../components/student/TimeUpModal.jsx";
import FillInTheBlankAnswer from "../../components/answers/FillInTheBlankAnswer.jsx";
import ExitConfirmationModal from "../../components/student/ExitConfirmationModal.jsx";
import QuestionNavigation from "../../components/student/QuestionNavigation.jsx";
import SubmitConfirmationModal from "../../components/student/SubmitConfirmationModal.jsx";
import { useTranslation } from 'react-i18next';
const TakeTestPage = () => {
    const { studentTestId } = useParams();
    const { t } = useTranslation("common");
    const { state: initialState } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [testData, setTestData] = useState(initialState || null);
    const [loading, setLoading] = useState(!initialState);
    const [error, setError] = useState(null);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [unansweredQuestions, setUnansweredQuestions] = useState([]);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(() => {
        const savedAnswers = localStorage.getItem(`test_${studentTestId}_answers`);
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    });

    const [hintsUsed, setHintsUsed] = useState(() => {
        const savedHints = localStorage.getItem(`test_${studentTestId}_hints`);
        return savedHints ? JSON.parse(savedHints) : {};
    });

    // Navigation handlers
    const handleNextQuestion = () => {
        if (currentQuestionIndex < testData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleExit = async () => {
        await abandonTest();
        navigate('/student-dashboard');
    };

    const handleTimeUp = () => {
        setShowTimeUpModal(true);
        setTimeout(() => {
            handleSubmitTest();
        }, 2000);
    };

    // Local storage effects
    useEffect(() => {
        localStorage.setItem(`test_${studentTestId}_answers`, JSON.stringify(answers));
    }, [answers, studentTestId]);

    useEffect(() => {
        localStorage.setItem(`test_${studentTestId}_hints`, JSON.stringify(hintsUsed));
    }, [hintsUsed, studentTestId]);

    // Test data initialization effect
    useEffect(() => {
        console.log('testData:', testData);
        if (testData == null) {
            const savedTestData = localStorage.getItem(`test_${studentTestId}_data`);
            if (savedTestData) {
                setTestData(JSON.parse(savedTestData));
                setLoading(false);
            } else {
                fetchTestData();
            }
        } else {
            localStorage.setItem(`test_${studentTestId}_data`, JSON.stringify(testData));

            if (Object.keys(answers).length === 0) {
                const initialAnswers = {};
                testData.questions.forEach(question => {
                    initialAnswers[question.questionId] = question.questionType === 'MULTIPLE_CHOICE' ? [] : null;
                });
                setAnswers(initialAnswers);
            }
        }
    }, [studentTestId, testData]);

    // Storage management functions
    const clearLocalStorage = () => {
        localStorage.removeItem(`test_${studentTestId}_start_time`);
        localStorage.removeItem(`test_${studentTestId}_time`);
        localStorage.removeItem(`test_${studentTestId}_lastUpdate`);
        localStorage.removeItem(`test_${studentTestId}_answers`);
        localStorage.removeItem(`test_${studentTestId}_hints`);
        localStorage.removeItem(`test_${studentTestId}_data`);
        localStorage.removeItem('last_test_id');
    };

    const abandonTest = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/student-tests/cancel/${studentTestId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel test');
            }
            clearLocalStorage();
        } catch (err) {
            console.error('Error canceling test:', err);
            alert('Failed to cancel test: ' + err.message);
        }
    };

    // Data fetching and answer handling
    const fetchTestData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/student-tests/${studentTestId}/take`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });
            console.log('response:', response);
            if (!response.ok) {
                throw new Error('Failed to fetch test data');
            }

            const data = await response.json();
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
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleHintUsed = (questionId) => {
        setHintsUsed(prev => ({...prev, [questionId]: true}));
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

    const handleOpenSubmitModal = () => {
        setShowSubmitModal(true);
    };
    const handleConfirmSubmit = () => {
        setShowSubmitModal(false);
        handleSubmitTest();
    };
    const handleSubmitTest = async () => {
        try {
            const answersToSend = Object.entries(answers).flatMap(([questionId, answerValue]) => {
                const question = testData.questions.find(q => q.questionId.toString() === questionId);
                if (!question || !answerValue) return [];

                switch (question.questionType) {
                    case 'MULTIPLE_CHOICE':
                        return [{
                            questionId: parseInt(questionId),
                            answerIds: Array.isArray(answerValue) ? answerValue.map(id => parseInt(id)) : [parseInt(answerValue)],
                            questionType: question.questionType
                        }];
                    case 'TRUE_FALSE':
                        return [{
                            questionId: parseInt(questionId),
                            answerIds: [parseInt(answerValue)],
                            questionType: question.questionType
                        }];
                    case 'NUMERIC':
                    case 'ESSAY':
                    case 'FILL_IN_THE_BLANK':
                        return [{
                            questionId: parseInt(questionId),
                            answerIds: [],
                            textAnswer: answerValue.toString(),
                            questionType: question.questionType
                        }];
                    default:
                        return [];
                }
            }).filter(answer => answer !== null);

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
            clearLocalStorage();
            navigate('/test-results', { state: feedback });
        } catch (err) {
            console.error('Error submitting test:', err);
            alert(err.message);
        }
    };    if (loading) {
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

    const currentQuestion = testData.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <TimeUpModal
                isOpen={showTimeUpModal}
                onClose={() => setShowTimeUpModal(false)}
            />
            <ExitConfirmationModal
                isOpen={showExitModal}
                onClose={() => setShowExitModal(false)}
                onConfirm={handleExit}
            />
            <SubmitConfirmationModal
                isOpen={showSubmitModal}
                onClose={() => setShowSubmitModal(false)}
                onConfirm={handleSubmitTest}
                questions={testData.questions}
                answers={answers}
            />
            {testData && (
                <Timer
                    timeLimit={testData.timeLimit}
                    onTimeUp={handleTimeUp}
                    testId={studentTestId}
                />
            )}
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">{testData.testTitle}</h1>
                <p className="text-lg text-gray-600 mb-4">
                    {t('takeTest.timeLimit', { minutes: testData.timeLimit })}
                </p>

                <div className="flex gap-6">
                    {/* Question Navigation Sidebar */}
                    <QuestionNavigation
                        questions={testData.questions}
                        currentQuestion={currentQuestionIndex}
                        onQuestionChange={setCurrentQuestionIndex}
                        answers={answers}
                    />

                    {/* Current Question Display */}
                    <div className="flex-1">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    {t('takeTest.questionCounter', {
                                        current: currentQuestionIndex + 1,
                                        total: testData.questions.length
                                    })}
                                </h2>
                                <span className="text-gray-500">
                                {t('takeTest.points', { points: currentQuestion.points })}
                            </span>
                            </div>

                            <div className="mb-6">
                                <p className="text-lg mb-4">{currentQuestion.description}</p>
                                {currentQuestion.imageId && (
                                    <img
                                        src={`http://localhost:8080/api/files/download/${currentQuestion.imageId}/inline`}
                                        alt={t('takeTest.questionImage')}
                                        className="mb-4 max-w-full h-auto"
                                        onError={(e) => console.error(t('takeTest.error.imageLoad'), e)}
                                    />
                                )}

                                <div className="space-y-4">
                                    {currentQuestion.questionType === 'TRUE_FALSE' && (
                                        <RadioAnswer
                                            question={currentQuestion}
                                            questionId={currentQuestion.questionId}
                                            correctAnswer={answers[currentQuestion.questionId]}
                                            onAnswerChange={handleAnswerChange}
                                        />
                                    )}
                                    {currentQuestion.questionType === 'MULTIPLE_CHOICE' && (
                                        <MultipleChoiceAnswer
                                            question={currentQuestion}
                                            questionId={currentQuestion.questionId}
                                            selectedAnswers={answers[currentQuestion.questionId] || []}
                                            onAnswerChange={handleCheckBoxChange}
                                        />
                                    )}
                                    {currentQuestion.questionType === 'NUMERIC' && (
                                        <NumericAnswer
                                            question={currentQuestion}
                                            questionId={currentQuestion.questionId}
                                            correctAnswer={answers[currentQuestion.questionId]}
                                            onAnswerChange={handleAnswerChange}
                                        />
                                    )}
                                    {currentQuestion.questionType === 'ESSAY' && (
                                        <EssayAnswer
                                            question={currentQuestion}
                                            questionId={currentQuestion.questionId}
                                            correctAnswer={answers[currentQuestion.questionId]}
                                            onAnswerChange={handleAnswerChange}
                                        />
                                    )}
                                    {currentQuestion.questionType === 'FILL_IN_THE_BLANK' && (
                                        <FillInTheBlankAnswer
                                            question={currentQuestion}
                                            questionId={currentQuestion.questionId}
                                            answer={answers[currentQuestion.questionId]}
                                            onAnswerChange={handleAnswerChange}
                                        />
                                    )}

                                    <HintButton
                                        hint={currentQuestion.hint}
                                        questionId={currentQuestion.questionId}
                                        hintsUsed={hintsUsed}
                                        onHintTaken={handleHintUsed}
                                    />
                                </div>

                                {/* Question Navigation */}
                                <div className="flex justify-between mt-6">
                                    <button
                                        onClick={handlePrevQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        className={`px-4 py-2 rounded ${
                                            currentQuestionIndex === 0
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        {t('takeTest.navigation.previous')}
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        disabled={currentQuestionIndex === testData.questions.length - 1}
                                        className={`px-4 py-2 rounded ${
                                            currentQuestionIndex === testData.questions.length - 1
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        {t('takeTest.navigation.next')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit/Exit Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                onClick={() => setShowSubmitModal(true)}
                            >
                                {t('takeTest.buttons.submit')}
                            </button>
                            <button
                                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                                onClick={() => setShowExitModal(true)}
                            >
                                {t('takeTest.buttons.exit')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TakeTestPage;