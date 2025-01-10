import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

const QuestionNavigation = ({
                                questions,
                                currentQuestion,
                                onQuestionChange,
                                answers,
                            }) => {
    const { t } = useTranslation('common');

    const getQuestionStatus = (questionId) => {
        const answer = answers[questionId];
        if (!answer) return 'unanswered';
        if (Array.isArray(answer) && answer.length === 0) return 'unanswered';
        return 'answered';
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 w-64">
            <h2 className="text-lg font-semibold mb-4">
                {t('questionNavigation.title')}
            </h2>
            <div className="space-y-2">
                {questions.map((question, index) => {
                    const status = getQuestionStatus(question.questionId);

                    return (
                        <button
                            key={question.questionId}
                            onClick={() => onQuestionChange(index)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                                currentQuestion === index
                                    ? 'bg-blue-600 text-white'
                                    : status === 'answered'
                                        ? 'bg-green-100 hover:bg-green-200'
                                        : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{t('questionNavigation.questionNumber', { number: index + 1 })}</span>
                                {status === 'answered' && currentQuestion !== index && (
                                    <Check className="w-5 h-5 text-green-600" />
                                )}
                            </div>
                            <div className="text-sm mt-1 truncate">
                                {t('questionNavigation.points', { count: question.points })}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionNavigation;