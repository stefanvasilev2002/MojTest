import React from 'react';
import { useLocation } from 'react-router-dom';

const TestResultsPage = () => {
    const { state: feedback } = useLocation();

    if (!feedback) {
        return <p>No feedback available.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-600 mb-6">Test Results</h1>
                <p className="text-lg text-gray-600 mb-4">Total Score: {feedback.totalScore}</p>
                <p className="text-lg text-gray-600 mb-4">Max Score: {feedback.maxScore}</p>
                <div className="space-y-6">
                    {feedback.answerFeedbackList.map((question, index) => (
                        <div key={question.questionId} className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-2">
                                Question {index + 1}: {question.questionText}
                            </h2>
                            <p className={`mb-2 ${question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                                {question.correctAnswer ? 'Correct!' : 'Incorrect'}
                            </p>
                            {!question.correctAnswer && (
                                <>
                                    <p className="text-gray-500">Correct Answer: {question.correctAnswerText}</p>
                                    <p className="text-gray-500">Your Answer: {question.submittedAnswerText}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestResultsPage;
