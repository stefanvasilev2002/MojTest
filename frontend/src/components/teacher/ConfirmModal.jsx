import {useTranslation} from "react-i18next";
import React from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, count }) => {
    const { t } = useTranslation("common");
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{t('addMultipleQuestions.confirmTitle')}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                <p className="mb-6">{t('addMultipleQuestions.confirmMessage', { count })}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {t('common.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;