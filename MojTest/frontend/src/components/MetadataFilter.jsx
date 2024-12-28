import React, { useState } from "react";
import Select from "react-select";
import { predefinedKeyValues } from "../constants/metadata.js"; // Make sure the path is correct

const MetadataFilter = ({ filterOptions, setFilterOptions }) => {
    const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility

    // Handle filter change
    const handleFilterChange = (selectedOption, key) => {
        setFilterOptions((prevState) => ({
            ...prevState,
            [key]: selectedOption || [],
        }));
    };

    // Create an array of Select components dynamically for each metadata key
    const filterKeys = Object.keys(predefinedKeyValues);

    return (
        <div className="space-y-4">
            <button
                onClick={() => setShowFilters((prev) => !prev)} // Toggle visibility
                className="bg-blue-600 text-white p-2 rounded mb-4"
            >
                {showFilters ? "Hide Filters" : "Show Filters"} {/* Button Text */}
            </button>

            {/* Show filters only if showFilters is true */}
            {showFilters && (
                <div>
                    {filterKeys.map((key) => (
                        <div key={key}>
                            <label className="block text-lg font-semibold">{key}</label>
                            <Select
                                isMulti
                                options={predefinedKeyValues[key].map((value) => ({
                                    value,
                                    label: value,
                                }))}
                                onChange={(selectedOption) =>
                                    handleFilterChange(selectedOption, key)
                                }
                                value={filterOptions[key]}
                                placeholder={`Select ${key}`}
                                className="react-select-container"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MetadataFilter;
