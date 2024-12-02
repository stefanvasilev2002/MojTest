// InputField.js
import React from "react";

const InputField = ({ id, name, label, value, onChange, onBlur, error }) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            name={name}
            type="text"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className="border p-2"
        />
        {error && <div>{error}</div>}
    </div>
);

export default InputField;
