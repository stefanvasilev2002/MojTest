import React from 'react';

const HintButton = ({ hint, questionId, hintsUsed, onHintTaken }) => {
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Show Hint
                </button>
            ) : (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-blue-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
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