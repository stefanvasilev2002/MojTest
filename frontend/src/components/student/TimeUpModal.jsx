import React from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TimeUpModal = ({ isOpen }) => {
  const { t } = useTranslation('common');

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto animate-in fade-in duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('timeUpModal.title')}
            </h2>
          </div>
          <p className="text-gray-600 mb-2">
            {t('timeUpModal.message')}
          </p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
  );
};

export default TimeUpModal;