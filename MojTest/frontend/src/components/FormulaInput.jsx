import React from 'react';

const FormulaInput = ({ formula, setFormula }) => {
    // Handle change of input field and set the formula value
    const handleChange = (event) => {
        setFormula(event.target.value);  // Update the formula state with new input
    };

    return (
        <div>

            {/* New Formula input field (styled like the original one) */}
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
