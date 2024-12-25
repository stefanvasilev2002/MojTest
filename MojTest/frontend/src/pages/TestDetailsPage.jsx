import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TestDetailsPage = () => {
    const [results, setResults] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const studentTestId = location.state?.studentTestId;

    useEffect(() => {
        const fetchResults = async () => {
            const response = await fetch(
                `http://localhost:8080/api/student-tests/results/${studentTestId}`,
                {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }
            );
            const data = await response.json();
            setResults(data);
        };
        fetchResults();
    }, [studentTestId]);

    if (!results) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-4">{results.testTitle}</h1>
                    <div className="text-lg mb-6">
                        Score: {results.score}/{results.totalPoints} ({results.scorePercentage.toFixed(1)}%)
                    </div>
                </div>

                {results.questions.map((question, index) => (
                    <div key={question.questionId} className="bg-white rounded-lg shadow p-6 mb-4">
                        <h3 className="font-semibold mb-2">Question {index + 1}</h3>
                        {question.imageId && (
                            <img
                                src={`http://localhost:8080/api/files/download/${question.imageId}/inline`}
                                alt="Question"
                                className="mb-4 max-w-full h-auto"
                            />
                        )}
                        <p className="mb-4">{question.description}</p>
                        <div className="space-y-2">
                            <div>Your answer: <span className="font-medium">{question.studentAnswer}</span></div>
                            <div>Correct answer: <span className="font-medium">{question.correctAnswer}</span></div>
                            <div>Points: {question.earnedPoints}/{question.points}</div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => navigate('/student-dashboard')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default TestDetailsPage;