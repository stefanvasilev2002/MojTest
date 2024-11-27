const selectStyles = {
    control: (provided) => ({
        ...provided,
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        color: '#2563eb', // Tailwind Blue-600
        borderColor: '#2563eb',
        boxShadow: 'none',
        padding: '0 12px',
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 10px',
        display: 'flex',
        alignItems: 'center',
    }),
    menu: (provided) => ({
        ...provided,
        display: 'block',
        maxHeight: '200px',
        overflowY: 'auto',
        backgroundColor: '#f1f1f1',
        marginTop: '8px',
        borderColor: '#2563eb',
        width: '100%',
        boxSizing: 'border-box',
    }),
    option: (provided, state) => ({
        ...provided,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: state.isSelected ? '#2563eb' : '#fff',
        color: state.isSelected ? 'white' : '#2563eb',
        cursor: 'pointer',
    }),
    singleValue: (provided) => ({
        ...provided,
        display: 'flex',
        alignItems: 'center',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#2563eb', // Set the color of the dropdown indicator to blue
    }),
};

export default selectStyles;
