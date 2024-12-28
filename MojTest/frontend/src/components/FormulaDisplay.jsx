import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';  // Make sure KaTeX styles are included

const FormulaDisplay = ({ formula, isBlock = false }) => {
    return (
        <div className="mt-2">
            {/* Display the formula depending on whether it's block or inline */}
            {isBlock ? (
                <BlockMath math={formula} />
            ) : (
                <InlineMath math={formula} />
            )}
        </div>
    );
};

export default FormulaDisplay;
