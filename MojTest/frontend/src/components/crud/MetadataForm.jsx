import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import useMetadata from "../../hooks/crud/useMetadata.js";
import useMetadataForm from "../../hooks/crud/useMetadataForm"; // Import the custom hook
import useQuestion from "../../hooks/crud/useQuestion";
import useTest from "../../hooks/crud/useTest";
import Alert from "../Alert.jsx";
import InputField from "../InputField"; // Import InputField component
import SelectField from "../SelectField"; // Import SelectField component

const MetadataForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get metadata ID for edit mode
    const { items: metadataList, loading, error, create, update, fetchById } = useMetadata(); // Fetch actions
    const { items: questionList } = useQuestion();
    const { items: testList } = useTest();

    // Use the custom hook to manage the metadata form state and fetching
    const { metadata } = useMetadataForm(id, fetchById); // Using our custom hook

    // Formik setup
    const formik = useFormik({
        initialValues: {
            key: "",
            value: "",
            questions: [],
            tests: [],
        },
        validationSchema: Yup.object({
            key: Yup.string().required("Key is required"),
            value: Yup.string().required("Value is required"),
        }),
        onSubmit: async (values) => {
            const { key, value, questions, tests } = values;

            const metadataData = {
                key,
                value,
                questions: questions.map(q => q.value), // Map selected options to question IDs
                tests: tests.map(t => t.value), // Map selected options to test IDs
            };

            try {
                if (id) {
                    await update(id, metadataData);
                } else {
                    await create(metadataData);
                }
                navigate("/crud/metadata"); // Redirect to metadata list after submit
            } catch (err) {
                console.error("Error submitting metadata", err);
            }
        },
    });

    // Update formik values when metadata is fetched
    useEffect(() => {
        if (metadata) {
            formik.setValues({
                key: metadata.key,
                value: metadata.value,
                questions: metadata.questions.map(q => ({
                    value: q.id,
                    label: `${q.id} | ${q.type} | ${q.description}`,
                })),
                tests: metadata.tests.map(t => ({
                    value: t.id,
                    label: `${t.id} | ${t.title}`,
                })),
            });
        }
    }, [metadata, formik]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{id ? "Edit Metadata" : "Create Metadata"}</h1>
            {error && <Alert message="An error occurred while loading data." type="error" />}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* InputField for 'key' */}
                <InputField
                    id="key"
                    name="key"
                    label="Key"
                    value={formik.values.key}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.key && formik.errors.key}
                />

                {/* InputField for 'value' */}
                <InputField
                    id="value"
                    name="value"
                    label="Value"
                    value={formik.values.value}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.value && formik.errors.value}
                />

                {/* Question Multi-Select using SelectField */}
                <SelectField
                    id="questions"
                    name="questions"
                    label="Questions"
                    options={questionList.map(q => ({
                        value: q.id,
                        label: `${q.id} | ${q.type} | ${q.description}`,
                    }))}
                    value={formik.values.questions}
                    onChange={(selectedOptions) => formik.setFieldValue("questions", selectedOptions)}
                />

                {/* Test Multi-Select using SelectField */}
                <SelectField
                    id="tests"
                    name="tests"
                    label="Tests"
                    options={testList.map(t => ({
                        value: t.id,
                        label: `${t.id} | ${t.title}`,
                    }))}
                    value={formik.values.tests}
                    onChange={(selectedOptions) => formik.setFieldValue("tests", selectedOptions)}
                />

                <div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {id ? "Update" : "Create"} Metadata
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MetadataForm;
