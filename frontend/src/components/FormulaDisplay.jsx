import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const FormulaDisplay = ({ formula, isBlock = false }) => {
    return (
        <div className="mt-2">
            {}
            {isBlock ? (
                <BlockMath math={formula} />
            ) : (
                <InlineMath math={formula} />
            )}
        </div>
    );
};

export default FormulaDisplay;
