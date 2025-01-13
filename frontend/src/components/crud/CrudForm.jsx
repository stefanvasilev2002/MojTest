import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ImageUploader from "../ImageUploader.jsx";
import InputField from "../InputField.jsx";
import SelectField from "../SelectField.jsx";
import { useTranslation } from "react-i18next";
const CrudForm = ({ entity, formConfigs, initialData = {}, onSubmit, relatedData, onKeyChange }) => {
    const { t } = useTranslation('common');
    const getFormConfig = (entityName) => {
        const config = formConfigs[entityName];
        if (config.extends) {
            const parentConfig = getFormConfig(config.extends);
            return {
                ...parentConfig,
                fields: [...parentConfig.fields, ...config.fields],
            };
        }
        return config;
    };

    const formConfig = getFormConfig(entity);

    const validationSchema = Yup.object(
        formConfig.fields.reduce((schema, field) => {
            if (field.validation) {
                schema[field.name] = Yup.reach(Yup, field.validation);
            }
            return schema;
        }, {})
    );

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
                const translatedLabel = t(field.label) +": ";


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
                        const isMulti = field.type === "multi-select";
                        const selectOptions =
                            relatedData[field.relation]?.map((item) => ({
                                value: item.id,
                                label: item.label || item.name || item.id,
                                ...item,
                            })) || [];
                        return (
                            <SelectField
                                key={field.name}
                                id={field.name}
                                name={field.name}
                                label={translatedLabel}
                                options={selectOptions}
                                value={formik.values[field.name]}
                                onChange={(selectedOption) => {
                                    if (isMulti) {
                                        formik.setFieldValue(field.name, selectedOption || []);
                                    } else {
                                        formik.setFieldValue(field.name, selectedOption || null);
                                    }
                                    if (onKeyChange) {
                                        onKeyChange(selectedOption);
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                isMulti={isMulti}
                                error={formik.touched[field.name] && formik.errors[field.name]}
                            />
                        );
                    }

                    case "image":
                        return (
                            <ImageUploader
                                key={field.name}
                                label={translatedLabel}
                                onUploadComplete={(uploadedFile) => {
                                    formik.setFieldValue(field.name, {
                                        id: uploadedFile.fileId,
                                        fileName: uploadedFile.fileName,
                                        fileDownloadUri: uploadedFile.fileDownloadUri,
                                        fileType: uploadedFile.fileType,
                                        size: uploadedFile.size,
                                        relatedEntityId: formik.values.id || null, // Corrected: using formik.values
                                    });
                                }}
                            />

                        );

                    default:
                        return null;
                }
            })}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {initialData.id ? "Update" : "Create"} {entity}
            </button>
        </form>
    );
};

export default CrudForm;
