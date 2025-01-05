import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMetadata from "../../hooks/crud/useMetadata.js";
import useQuestion from "../../hooks/crud/useQuestion";
import useTest from "../../hooks/crud/useTest";
import formConfigs from "../../config/formConfigs"; // Import the form configurations
import CrudForm from "./CrudForm.jsx";
import Alert from "../Alert.jsx";
import { predefinedKeyValues } from "../../config/predefinedKeyValues";

const MetadataForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get metadata ID for edit mode
    const { create, update, fetchById, loading, error } = useMetadata();
    const { items: questionList } = useQuestion();
    const { items: testList } = useTest();

    const [metadata, setMetadata] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure values are set once
    const [keySelected, setKeySelected] = useState(""); // Track the selected key
    const [valueOptions, setValueOptions] = useState([]); // Options for the value field

    // Fetch metadata for editing if ID is provided
    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                fetchById(id).then((data) => {
                    if (data) {
                        setMetadata({
                            ...data,
                            questions: data.questionIds?.map((id) => ({
                                value: id,
                                label: `Question ${id}`, // Update label format as needed
                            })) || [],
                            tests: data.testIds?.map((id) => ({
                                value: id,
                                label: `Test ${id}`, // Update label format as needed
                            })) || [],
                        });
                        setKeySelected(data.key); // Set the selected key
                        setValueOptions(predefinedKeyValues[data.key] || []); // Set the value options based on the key
                    }
                    setIsInitialValuesSet(true); // Mark as ready for rendering
                });
            } else {
                setMetadata(null); // No initial metadata for new creation
                setIsInitialValuesSet(true); // Ready to render empty form
            }
        }
    }, [id, fetchById, isInitialValuesSet]);

    // Handle key change
    const handleKeyChange = (selectedKey) => {
        console.log("Selected Key:", selectedKey);
        const key = selectedKey.value;  // Access the 'value' property
        const updatedOptions = predefinedKeyValues[key] || []; // Use the key to get options
        console.log("Updated Value Options:", updatedOptions);
        setValueOptions(updatedOptions); // Update value options based on selected key
    };



    // Handle form submission
    const handleSubmit = async (values) => {
        // Only send the string values for key and value
        const payload = {
            id: values.id,
            key: values.key.value, // Access the string value of the key
            value: values.value.value, // Access the string value of the value
            questionIds: values.questions.map((q) => q.value), // Extract IDs
            testIds: values.tests.map((t) => t.value), // Extract IDs
        };

        try {
            if (id) {
                await update(id, payload);
            } else {
                await create(payload);
            }
            navigate("/crud/metadata"); // Redirect after submission
        } catch (err) {
            console.error("Error submitting metadata", err);
        }
    };


    if (loading || !isInitialValuesSet) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{id ? "Edit Metadata" : "Create Metadata"}</h1>
            {error && <Alert message="An error occurred while loading data." type="error" />}

            <CrudForm
                entity="Metadata"
                formConfigs={formConfigs}
                initialData={metadata || {}}
                onSubmit={handleSubmit}
                relatedData={{
                    Question: questionList.map((q) => ({
                        value: q.id,
                        label: `${q.id} | ${q.type} | ${q.description}`,
                    })),
                    Test: testList.map((t) => ({
                        value: t.id,
                        label: `${t.id} | ${t.title}`,
                    })),
                    Key: Object.keys(predefinedKeyValues).map((key) => ({
                        value: key,
                        label: key,
                    })),
                    Value: valueOptions.map((value) => ({
                        value,
                        label: value,
                    })),
                }}
                onKeyChange={handleKeyChange}
            />
        </div>
    );
};

export default MetadataForm;