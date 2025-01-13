import React from "react";
import ReactSelect from "react-select";

const SelectField = ({ id, name, options, value, onChange, label, isMulti }) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <ReactSelect
            id={id}
            name={name}
            isMulti={isMulti}
            options={options}
            value={value}
            onChange={onChange}
            className="border p-2"
        />
    </div>
);

export default SelectField;
