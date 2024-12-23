import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TestResultsPage = () => {
    const { state: feedback } = useLocation();
    const navigate = useNavigate();

    if (!feedback) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg text-gray-600 mb-4">No feedback available.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const scorePercentage = (feedback.totalScore / feedback.maxScore) * 100;
    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">Test Results</h1>

                {/* Score Summary */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xl font-semibold mb-2">Final Score</p>
                            <p className={`text-2xl font-bold ${getScoreColor(scorePercentage)}`}>
                                {feedback.totalScore} / {feedback.maxScore}
                            </p>
                        </div>
                        <div>
                            <p className={`text-4xl font-bold ${getScoreColor(scorePercentage)}`}>
                                {scorePercentage.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <div className="space-y-6">
                    {feedback.answerFeedbackList.map((question, index) => (
                        <div key={question.questionId}
                             className={`bg-white p-6 rounded-lg shadow border-l-4 ${
                                 question.correctAnswer ? 'border-green-500' : 'border-red-500'
                             }`}>
                            <h2 className="text-xl font-semibold mb-2">
                                Question {index + 1}: {question.questionText}
                            </h2>

                            <div className="mt-4">
                                {/* Status Badge */}
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                                    question.correctAnswer
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {question.correctAnswer ? 'Correct' : 'Incorrect'}
                                </span>

                                {/* Answer Details */}
                                <div className="space-y-2">
                                    {!question.correctAnswer && (
                                        <>
                                            <div className="text-gray-700">
                                                <p className="font-medium">Your Answer:</p>
                                                <p className="ml-4 text-red-600">
                                                    {Array.isArray(question.submittedAnswerText)
                                                        ? question.submittedAnswerText.join(', ')
                                                        : question.submittedAnswerText}
                                                </p>
                                            </div>
                                            <div className="text-gray-700">
                                                <p className="font-medium">Correct Answer:</p>
                                                <p className="ml-4 text-green-600">
                                                    {Array.isArray(question.correctAnswerText)
                                                        ? question.correctAnswerText.join(', ')
                                                        : question.correctAnswerText}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    {question.correctAnswer && (
                                        <div className="text-gray-700">
                                            <p className="font-medium">Your Answer:</p>
                                            <p className="ml-4 text-green-600">
                                                {Array.isArray(question.submittedAnswerText)
                                                    ? question.submittedAnswerText.join(', ')
                                                    : question.submittedAnswerText}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                    >
                        Return to Dashboard
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Print Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestResultsPage;