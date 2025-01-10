import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, X, Check, ArrowLeft } from 'lucide-react';

const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, questions, answers }) => {
    const { t } = useTranslation('common');

    if (!isOpen) return null;

    const unansweredQuestions = questions.filter(question =>
        !answers[question.questionId] ||
        (Array.isArray(answers[question.questionId]) && answers[question.questionId].length === 0)
    );

    const hasUnansweredQuestions = unansweredQuestions.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {hasUnansweredQuestions ? (
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-red-600 mb-4">
                            <AlertTriangle className="h-6 w-6" />
                            <h2 className="text-xl font-bold">
                                {t('submitModal.warning.title')}
                            </h2>
                        </div>
                        <p className="mb-4">
                            {t('submitModal.warning.message', { count: unansweredQuestions.length })}
                        </p>
                        <div className="max-h-48 overflow-y-auto mb-4 border rounded-lg p-4">
                            <ul className="list-disc pl-5 space-y-2">
                                {unansweredQuestions.map((question, index) => (
                                    <li key={question.questionId} className="text-gray-600">
                                        {t('submitModal.warning.questionItem', {
                                            number: index + 1,
                                            description: question.description
                                        })}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t('submitModal.warning.returnButton')}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                {t('submitModal.warning.submitButton')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {t('submitModal.confirm.title')}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {t('submitModal.confirm.message')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                {t('submitModal.confirm.cancelButton')}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                {t('submitModal.confirm.submitButton')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmitConfirmationModal;