import React from 'react';
import FormulaDisplay from "../FormulaDisplay.jsx";

const NumericAnswer = ({ question, questionId, correctAnswer, onAnswerChange }) => {
    return (
        <div className="space-y-4">
            <label className="block text-gray-700" htmlFor={`question-${questionId}`}>
                {question.questionText} <br/> <FormulaDisplay formula={question.formula}/>
            </label>
            <input
                type="number"
                id={`question-${questionId}`}
                name={`question-${questionId}`}
                value={correctAnswer || ''}
                onChange={(e) => onAnswerChange(questionId, e.target.value)}
                className="border p-2 rounded-md w-full"
                placeholder="Enter a number"
            />
        </div>
    );
};

export default NumericAnswer;
