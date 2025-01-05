import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TestDetailsPage = () => {
    const { t } = useTranslation("common");
    const [results, setResults] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const studentTestId = location.state?.studentTestId;

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/student-tests/results/${studentTestId}`,
                    {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    }
                );
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error(t('testDetails.error.fetchResults'), error);
            }
        };
        if (studentTestId) {
            fetchResults();
        }
    }, [studentTestId, user.token, t]);

    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-100 text-green-800';
        if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    if (!results) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('testDetails.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{results.testTitle}</h1>
                        <div className={`px-4 py-2 rounded-full font-semibold ${getScoreColor(results.scorePercentage)}`}>
                            {t('testDetails.score')} {results.score}/{results.totalPoints} ({results.scorePercentage.toFixed(1)}%)
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {results.questions.map((question, index) => (
                        <div key={question.questionId}
                             className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                                 question.earnedPoints >= question.points ? 'border-green-500' : 'border-red-500'
                             }`}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {t('testDetails.question')} {index + 1}
                                </h3>
                                <div className="flex items-center">
                                    {question.earnedPoints >= question.points ? (
                                        <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
                                    ) : (
                                        <XCircle className="text-red-500 w-6 h-6 mr-2" />
                                    )}
                                    <span className="font-medium">
                                        {question.earnedPoints}/{question.points} {t('testDetails.points')}
                                    </span>
                                </div>
                            </div>

                            {question.imageId && (
                                <img
                                    src={`http://localhost:8080/api/files/download/${question.imageId}/inline`}
                                    alt="Question"
                                    className="mb-4 rounded-lg max-w-full h-auto"
                                />
                            )}

                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-800 mb-4">{question.description}</p>
                                </div>

                                <div className="grid gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-700 mb-1">{t('testDetails.answers.your')}</p>
                                        <p className={`${
                                            question.earnedPoints >= question.points
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {question.studentAnswer || t('testDetails.answers.noAnswer')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700 mb-1">{t('testDetails.answers.correct')}</p>
                                        <p className="text-green-600">{question.correctAnswer}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('testDetails.buttons.backToDashboard')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestDetailsPage;