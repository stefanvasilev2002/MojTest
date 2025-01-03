import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import Select from "react-select";
import { predefinedKeyValues } from "../config/predefinedKeyValues.js";
import {getTranslatedMetadata} from "../config/translatedMetadata.js";

const MetadataFilter = ({ filterOptions, setFilterOptions }) => {
    const { t , i18n} = useTranslation("common");
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (selectedOption, key) => {
        setFilterOptions((prevState) => ({
            ...prevState,
            [key]: selectedOption || [],
        }));
    };

    const filterKeys = Object.keys(predefinedKeyValues);

    return (
        <div className="space-y-4">
            <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="bg-blue-600 text-white p-2 rounded mb-4"
            >
                {showFilters
                    ? t('metadataFilter.buttons.hideFilters')
                    : t('metadataFilter.buttons.showFilters')}
            </button>

            {showFilters && (
                <div>
                    {filterKeys.map((key) => (
                        <div key={key}>
                            <label className="block text-lg font-semibold">{t(`metadata.${key}`)}</label>
                            <Select
                                isMulti
                                options={predefinedKeyValues[key].map((value) => ({
                                    value,
                                    label: getTranslatedMetadata(key, value, i18n.language) || value,
                                }))}
                                onChange={(selectedOption) =>
                                    handleFilterChange(selectedOption, key)
                                }
                                value={filterOptions[key]}
                                placeholder={`${t('metadataFilter.select.placeholder')} ${t(`metadata.${key}`)}`}
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