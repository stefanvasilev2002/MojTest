import React from "react";

const InputField = ({ id, name, label, value, onChange, onBlur, error, type }) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className="border p-2"
            />
            {error && <div className="text-red-500 text-sm">{error}</div>} {/* Show error if present */}
        </div>
    );
};

export default InputField;
