import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../InputField.jsx";
import SelectField from "../SelectField.jsx";
import { useTranslation } from "react-i18next";
const CrudForm = ({ entity, formConfigs, initialData = {}, onSubmit, relatedData }) => {
    const { t } = useTranslation('common'); // Use the 'common' namespace for translations

    // Resolve the formConfig, including inherited fields
    const getFormConfig = (entityName) => {
        const config = formConfigs[entityName];
        if (config.extends) {
            // Merge fields from the parent entity
            const parentConfig = getFormConfig(config.extends);
            return {
                ...parentConfig,
                fields: [...parentConfig.fields, ...config.fields],
            };
        }
        return config;
    };

    const formConfig = getFormConfig(entity);

    // Create Yup validation schema
    const validationSchema = Yup.object(
        formConfig.fields.reduce((schema, field) => {
            if (field.validation) {
                schema[field.name] = Yup.reach(Yup, field.validation);
            }
            return schema;
        }, {})
    );

    // Initialize formik
    const formik = useFormik({
        initialValues: formConfig.fields.reduce((values, field) => {
            values[field.name] = initialData[field.name] || (field.type === "multi-select" ? [] : null);
            return values;
        }, {}),
        validationSchema,
        onSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4">
            {formConfig.fields.map((field) => {
                const translatedLabel = t(field.label) +": "; // Translate the label here


                switch (field.type) {
                    case "text":
                    case "textarea":
                    case "number":
                    case "password":
                    case "email":
                    case "date":
                    case "time":
                        return (
                            <InputField
                                key={field.name}
                                id={field.name}
                                name={field.name}
                                label={translatedLabel}
                                type={field.type}
                                value={formik.values[field.name]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched[field.name] && formik.errors[field.name]}
                            />
                        );

                    case "checkbox":
                        return (
                            <div key={field.name} className="flex items-center space-x-2">
                                <input
                                    id={field.name}
                                    name={field.name}
                                    type="checkbox"
                                    checked={formik.values[field.name]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-checkbox"
                                />
                                <label htmlFor={field.name} className="text-sm">
                                    {translatedLabel}
                                </label>
                            </div>
                        );

                    case "select":
                    case "multi-select": {
                        const isMulti = field.type === "multi-select"; // Determine if it's multi-select
                        const selectOptions =
                            relatedData[field.relation]?.map((item) => ({
                                value: item.id,
                                label: item.label || item.name || item.id,
                                ...item, // Attach the full object for use when needed
                            })) || [];
                        return (
                            <SelectField
                                key={field.name}
                                id={field.name}
                                name={field.name}
                                label={translatedLabel}
                                options={selectOptions}
                                value={formik.values[field.name]} // Pass the current value
                                onChange={(selectedOption) => {
                                    if (isMulti) {
                                        // For multi-select, selectedOption is an array
                                        formik.setFieldValue(field.name, selectedOption || []);
                                    } else {
                                        // For single-select, selectedOption is a single object or null
                                        formik.setFieldValue(field.name, selectedOption || null);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                isMulti={isMulti} // Pass the multi-select flag
                                error={formik.touched[field.name] && formik.errors[field.name]}
                            />
                        );
                    }

                    default:
                        return null; // Fallback for unsupported field types
                }
            })}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {initialData.id ? "Update" : "Create"} {entity}
            </button>
        </form>
    );
};

export default CrudForm;
