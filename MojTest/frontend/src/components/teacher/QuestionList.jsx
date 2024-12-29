import React from 'react';
import { useTranslation } from 'react-i18next';

const QuestionList = ({ questions, onEdit, onRemove, onDelete, onAddToTest }) => {
    const { t } = useTranslation("common");

    const getQuestionTypeLabel = (type) => {
        const typeKey = type?.toLowerCase().replace(/_/g, '') || 'multiplechoice';
        return t(`questionList.questionTypes.${typeKey}`);
    };

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t('questionList.title')}</h2>
            <div className="grid gap-4">
                {questions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-600">{t('questionList.noQuestions')}</p>
                    </div>
                ) : (
                    questions.map(question => (
                        <div key={question.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-semibold">{question.description}</h3>
                                        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                            {getQuestionTypeLabel(question.type)}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        <span>{t('questionList.questionDetails.points')} {question.points}</span>
                                        {question.negativePointsPerAnswer > 0 && (
                                            <span className="ml-4">
                                                {t('questionList.questionDetails.negativePoints')} {question.negativePointsPerAnswer}
                                            </span>
                                        )}
                                    </div>

                                    {question.hint && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <strong>{t('questionList.questionDetails.hint')}</strong> {question.hint}
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <h3 className="font-medium mb-2">{t('questionList.questionDetails.answers')}</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {question.answers?.map((answer, index) => (
                                                <li
                                                    key={index}
                                                    className={`${answer.correct ? 'text-green-600' : 'text-gray-600'}`}
                                                >
                                                    {answer.answerText}
                                                    {answer.correct && ' ✓'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {onAddToTest && (
                                        <button
                                            onClick={() => onAddToTest(question)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                        >
                                            {t('questionList.buttons.addToTest')}
                                        </button>
                                    )}

                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(question.id)}
                                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                                        >
                                            {t('questionList.buttons.edit')}
                                        </button>
                                    )}

                                    {onRemove && (
                                        <button
                                            onClick={() => onRemove(question.id)}
                                            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
                                        >
                                            {t('questionList.buttons.remove')}
                                        </button>
                                    )}

                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(question.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                        >
                                            {t('questionList.buttons.delete')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QuestionList;