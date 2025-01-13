import React from 'react';

const FormulaInput = ({ formula, setFormula }) => {
    const handleChange = (event) => {
        setFormula(event.target.value);
    };

    return (
        <div>

            {}
            <input
                type="text"
                name="formula"
                value={formula}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter a mathematical formula..."
            />
        </div>
    );
};

export default FormulaInput;
