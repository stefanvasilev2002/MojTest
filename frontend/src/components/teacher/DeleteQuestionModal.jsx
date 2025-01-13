import React from 'react';
import {useTranslation} from "react-i18next";
const DeleteQuestionModal = ({ isOpen, onClose, onConfirm, questionText }) => {
    const { t } = useTranslation("common");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full m-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {t('questionsPage.questionDetails.actions.deleteTitle')}
                </h2>
                <p className="text-gray-600 mb-6">
                    {t('questionsPage.questionDetails.actions.deleteDescription', { title: questionText })}
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        {t('common.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default DeleteQuestionModal;