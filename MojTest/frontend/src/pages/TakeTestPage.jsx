import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import RadioAnswer from "../components/answers/RadioAnswer.jsx";
import MultipleChoiceAnswer from "../components/answers/MultipleChoiceAnswer.jsx";
import NumericAnswer from "../components/answers/NumericAnswer.jsx";
import EssayAnswer from "../components/answers/EssayAnswer.jsx";
import HintButton from "../components/student/HintButton.jsx"
import Timer from "../components/student/Timer.jsx";
import TimeUpModal from "../components/student/TimeUpModal.jsx";
import FillInTheBlankAnswer from "../components/answers/FillInTheBlankAnswer.jsx";

const TakeTestPage = () => {
    const {studentTestId} = useParams();
    const {state: initialState} = useLocation();
    const {user} = useAuth();
    const navigate = useNavigate();

    const [testData, setTestData] = useState(initialState || null);
    const [loading, setLoading] = useState(!initialState);
    const [error, setError] = useState(null);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);

    const [answers, setAnswers] = useState(() => {
        const savedAnswers = localStorage.getItem(`test_${studentTestId}_answers`);
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    });

    const [hintsUsed, setHintsUsed] = useState(() => {
        const savedHints = localStorage.getItem(`test_${studentTestId}_hints`);
        return savedHints ? JSON.parse(savedHints) : {};
    });

    const handleTimeUp = () => {
        setShowTimeUpModal(true);
        // Submit after a short delay to allow modal to be seen
        setTimeout(() => {
            handleSubmitTest();
        }, 2000);
    };

    useEffect(() => {
        // Save answers whenever they change
        localStorage.setItem(`test_${studentTestId}_answers`, JSON.stringify(answers));
    }, [answers, studentTestId]);

    useEffect(() => {
        // Save hints whenever they change
        localStorage.setItem(`test_${studentTestId}_hints`, JSON.stringify(hintsUsed));
    }, [hintsUsed, studentTestId]);
    useEffect(() => {
        console.log("Initial state from location:", initialState);

        if (testData == null) {
            // Check if we have saved test data
            const savedTestData = localStorage.getItem(`test_${studentTestId}_data`);
            if (savedTestData) {
                setTestData(JSON.parse(savedTestData));
                setLoading(false);
            } else {
                fetchTestData();
            }
        } else {
            // Save test data when we get it
            localStorage.setItem(`test_${studentTestId}_data`, JSON.stringify(testData));

            // Only initialize answers if they don't exist
            if (Object.keys(answers).length === 0) {
                const initialAnswers = {};
                testData.questions.forEach(question => {
                    initialAnswers[question.questionId] = question.questionType === 'MULTIPLE_CHOICE' ? [] : null;
                });
                setAnswers(initialAnswers);
            }
        }
    }, [studentTestId, testData]);

    // Clear all test data after submission
    const clearTestStorage = () => {
        localStorage.removeItem(`test_${studentTestId}_start_time`);
        localStorage.removeItem(`test_${studentTestId}_time`);
        localStorage.removeItem(`test_${studentTestId}_lastUpdate`);
        localStorage.removeItem(`test_${studentTestId}_answers`);
        localStorage.removeItem(`test_${studentTestId}_hints`);
        localStorage.removeItem(`test_${studentTestId}_data`);
        localStorage.removeItem('last_test_id');
    };

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
            clearTestStorage();
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
            <TimeUpModal
                isOpen={showTimeUpModal}
                onClose={() => setShowTimeUpModal(false)}
            />
            {testData && (
                <Timer
                    timeLimit={testData.timeLimit}
                    onTimeUp={handleTimeUp}
                    testId={studentTestId}
                />
            )}
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">{testData.testTitle}</h1>
                <p className="text-lg text-gray-600 mb-4">Time limit: {testData.timeLimit} minutes</p>
                <div className="space-y-6">
                    {testData.questions.map((question, index) => (
                        console.log("Test Data:", testData),
                            console.log("Question:", question),
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
                                    {question.questionType === 'FILL_IN_THE_BLANK' && (
                                        <FillInTheBlankAnswer
                                            question={question}
                                            questionId={question.questionId}
                                            answer={answers[question.questionId]}
                                            onAnswerChange={handleAnswerChange}
                                        />
                                    )}
                                    <HintButton
                                        hint={question.hint}
                                        questionId={question.questionId}
                                        hintsUsed={hintsUsed}
                                        onHintTaken={handleHintUsed}
                                    />
                                </div>
                            </div>
                    ))}
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleSubmitTest}
                    >
                        Submit Test
                    </button>
                    <button
                        className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                        onClick={() => {
                            const confirmExit = window.confirm(
                                'Are you sure you want to exit? This will abandon your test and you will need to start over. ' +
                                'Your answers will not be saved.'
                            );
                            if (confirmExit) {
                                clearTestStorage();
                                navigate('/student-dashboard');
                            }
                        }}
                    >
                        Exit Test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TakeTestPage;
