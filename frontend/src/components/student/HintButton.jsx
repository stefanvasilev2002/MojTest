import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';

const HintButton = ({ hint, questionId, hintsUsed, onHintTaken }) => {
    const { t } = useTranslation('common');

    if (!hint) return null;

    const isHintVisible = hintsUsed[questionId];

    const handleShowHint = () => {
        if (!isHintVisible) {
            onHintTaken(questionId);
        }
    };

    return (
        <div className="mt-4">
            {!isHintVisible ? (
                <button
                    onClick={handleShowHint}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2"
                >
                    <HelpCircle className="h-5 w-5" />
                    {t('hint.show')}
                </button>
            ) : (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <HelpCircle className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">{hint}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HintButton;