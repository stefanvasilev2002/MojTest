import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import Flag from 'react-world-flags'; // Import react-world-flags
import selectStyles from '../../styles/selectStyles'; // Import the styles

const languageOptions = [
    { value: 'en', label: 'English', countryCode: 'GB' },   // UK flag
    { value: 'mk', label: 'Македонски', countryCode: 'MK' }, // North Macedonia flag
    { value: 'al', label: 'Shqip', countryCode: 'AL' },      // Albania flag
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const handleChange = (selectedOption) => {
        i18n.changeLanguage(selectedOption.value);
    };

    const customSingleValue = ({ data }) => (
        <div className="flex items-center">
            <Flag code={data.countryCode} style={{ width: 20, height: 15, marginRight: 8 }} />
            <span className="text-blue-600">{data.label}</span> {/* Set text to blue */}
        </div>
    );

    const customOption = (props) => {
        const { data, innerRef, innerProps } = props;
        return (
            <div
                ref={innerRef}
                {...innerProps}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                style={{ height: 'auto' }} // Ensure height adjusts dynamically
            >
                <Flag code={data.countryCode} style={{ width: 20, height: 15, marginRight: 8 }} />
                <span>{data.label}</span>
            </div>
        );
    };

    return (
        <div className="w-48">
            <Select
                options={languageOptions}
                onChange={handleChange}
                defaultValue={languageOptions.find(option => option.value === i18n.language)} // Set default value based on current language
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={false} // Disable search (optional)
                getOptionLabel={(e) => (
                    <div className="flex items-center">
                        <Flag code={e.countryCode} style={{ width: 20, height: 15, marginRight: 8 }} />
                        {e.label}
                    </div>
                )}
                components={{ SingleValue: customSingleValue, Option: customOption }} // Custom components for dropdown items
                menuPlacement="bottom" // Ensure the dropdown opens at the bottom of the select input
                menuPortalTarget={document.body} // Attach the dropdown to the body (outside flex layout)
                styles={selectStyles} // Apply the external styles here
            />
        </div>
    );
};

export default LanguageSwitcher;
