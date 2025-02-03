
import React from 'react';
import { useTranslation } from 'react-i18next';

const NoQuestionsErrorModal = ({ isOpen, onClose, message }) => {
    const { t } = useTranslation('common');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-red-100 p-3">
                        <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <p className="text-sm text-gray-500 text-center mb-6">
                    {message}
                </p>

                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        {t('common.back')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoQuestionsErrorModal;