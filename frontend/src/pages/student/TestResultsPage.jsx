import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TestResultsPage = () => {
    const { t } = useTranslation("common");
    const { state: feedback } = useLocation();
    const navigate = useNavigate();

    if (!feedback) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-lg text-gray-600 mb-4">{t('testResults.noFeedback')}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        {t('testResults.buttons.returnDashboard')}
                    </button>
                </div>
            </div>
        );
    }

    const scorePercentage = (feedback.totalScore / feedback.maxScore) * 100;
    const getScoreColor = (percentage) => {
        if (percentage >= 80) return 'bg-green-100 text-green-800';
        if (percentage >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">{t('testResults.title')}</h1>
                        <div className={`px-4 py-2 rounded-full font-semibold ${getScoreColor(scorePercentage)}`}>
                            {t('testResults.score', {
                                score: feedback.totalScore,
                                maxScore: feedback.maxScore,
                                percentage: scorePercentage.toFixed(1)
                            })}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {feedback.answerFeedbackList.map((question, index) => (
                        <div key={question.questionId}
                             className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                                 question.correctAnswer ? 'border-green-500' : 'border-red-500'
                             }`}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {t('testResults.questionNumber', { number: index + 1 })}
                                </h3>
                                <div className="flex items-center">
                                    {question.correctAnswer ? (
                                        <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
                                    ) : (
                                        <XCircle className="text-red-500 w-6 h-6 mr-2" />
                                    )}
                                    <span className="font-medium">
                                        {/*{t('testResults.questionPoints', {*/}
                                        {/*    earned: question.correctAnswer ? '1' : '0',*/}
                                        {/*    total: '1'*/}
                                        {/*})}*/}
                                        {question.earnedPoints}/{question.points} {t('testDetails.points')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-gray-800 mb-4">{question.questionText}</p>
                                </div>

                                <div className="grid gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-700 mb-1">{t('testResults.yourAnswer')}</p>
                                        <p className={`${
                                            question.correctAnswer
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {Array.isArray(question.submittedAnswerText)
                                                ? question.submittedAnswerText.join(', ')
                                                : question.submittedAnswerText || t('testResults.noAnswer')}
                                        </p>
                                    </div>
                                    {!question.correctAnswer && (
                                        <div>
                                            <p className="font-medium text-gray-700 mb-1">{t('testResults.correctAnswer')}</p>
                                            <p className="text-green-600">
                                                {Array.isArray(question.correctAnswerText)
                                                    ? question.correctAnswerText.join(', ')
                                                    : question.correctAnswerText}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {t('testResults.buttons.returnDashboard')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestResultsPage;