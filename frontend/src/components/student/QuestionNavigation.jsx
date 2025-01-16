import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

const QuestionNavigation = ({
                                questions,
                                currentQuestion,
                                onQuestionChange,
                                answers
                            }) => {
    const { t } = useTranslation('common');
    const [isExpanded, setIsExpanded] = useState(false);

    const getQuestionStatus = (questionId) => {
        const answer = answers[questionId];
        if (!answer) return 'unanswered';
        if (Array.isArray(answer) && answer.length === 0) return 'unanswered';
        return 'answered';
    };

    const answeredCount = questions.filter(q =>
        getQuestionStatus(q.questionId) === 'answered'
    ).length;

    const QuestionGrid = () => (
        <div className="p-2 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 max-h-48 md:max-h-full overflow-y-auto">
            {questions.map((question, index) => {
                const status = getQuestionStatus(question.questionId);
                const isActive = currentQuestion === index;

                return (
                    <button
                        key={question.questionId}
                        onClick={() => {
                            onQuestionChange(index);
                            setIsExpanded(false);
                        }}
                        className={`
              relative p-2 rounded flex items-center justify-center
              ${isActive
                            ? 'bg-blue-600 text-white'
                            : status === 'answered'
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-50 text-gray-600'
                        }
              hover:ring-2 hover:ring-blue-300 transition-all
              ${isActive ? 'ring-2 ring-blue-300' : ''}
            `}
                        title={t('questionNavigation.questionNumber', {
                            number: index + 1,
                            points: question.points
                        })}
                    >
                        <span className="text-xs font-medium">{index + 1}</span>
                        {status === 'answered' && !isActive && (
                            <Check className="absolute -top-1 -right-1 w-3 h-3 text-green-600" />
                        )}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* Progress Header - Different styles for mobile and desktop */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-3 flex items-center justify-between text-sm bg-blue-50 rounded-t-lg"
                >
                    <div className="flex items-center gap-2">
            <span className="font-medium">
              {t('questionNavigation.progress', {
                  answered: answeredCount,
                  total: questions.length
              })}
            </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              {Math.round((answeredCount / questions.length) * 100)}%
            </span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            <div className="hidden md:block p-3 bg-blue-50 rounded-t-lg">
                <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {t('questionNavigation.progress', {
                answered: answeredCount,
                total: questions.length
            })}
          </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {Math.round((answeredCount / questions.length) * 100)}%
          </span>
                </div>
            </div>

            {/* Question Grid - Conditional rendering on mobile, always visible on desktop */}
            <div className="md:block">
                {(isExpanded || window.innerWidth >= 768) && <QuestionGrid />}
            </div>

            {/* Navigation Controls */}
            <div className="p-2 border-t flex items-center justify-between text-sm">
                <button
                    onClick={() => onQuestionChange(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                    {t('questionNavigation.prev')}
                </button>
                <span className="text-gray-600">
          {currentQuestion + 1} / {questions.length}
        </span>
                <button
                    onClick={() => onQuestionChange(Math.min(questions.length - 1, currentQuestion + 1))}
                    disabled={currentQuestion === questions.length - 1}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded disabled:text-gray-400 disabled:hover:bg-transparent"
                >
                    {t('questionNavigation.next')}
                </button>
            </div>
        </div>
    );
};

export default QuestionNavigation;