import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, BookOpen, List } from 'lucide-react';

const QuestionCard = ({ question, checked, onChange }) => {
    const { t } = useTranslation("common");

    const getQuestionIcon = (type) => {
        switch (type) {
            case 'ESSAY':
                return <BookOpen className="w-5 h-5" />;
            case 'MULTIPLE_CHOICE':
                return <List className="w-5 h-5" />;
            default:
                return <BookOpen className="w-5 h-5" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={onChange}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {question.description}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">{question.points}</span>
                                        <span>{t('question.points')}</span>
                                    </div>
                                    <span className="text-gray-300">•</span>
                                    <div className="flex items-center gap-1">
                                        <span>{question.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">
                                {getQuestionIcon(question.type)}
                                <span className="text-sm font-medium">
                                    {t(`questionTypes.${question.type}`)}
                                </span>
                            </div>
                        </div>

                        {question.answers && question.answers.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    {t('question.answers')}
                                </h4>
                                <div className="grid gap-2">
                                    {question.answers.map((answer) => (
                                        <div
                                            key={answer.id}
                                            className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            {answer.correct ? (
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            )}
                                            <span className="text-sm text-gray-700">
                                                {answer.answerText}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {question.hint && (
                            <div className="mt-3 text-sm text-gray-600 italic">
                                {question.hint}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;