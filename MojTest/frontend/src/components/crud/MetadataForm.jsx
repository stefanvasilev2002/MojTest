import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMetadata from "../../hooks/crud/useMetadata.js";
import useQuestion from "../../hooks/crud/useQuestion";
import useTest from "../../hooks/crud/useTest";
import formConfigs from "../../config/formConfigs"; // Import the form configurations
import CrudForm from "./CrudForm.jsx";
import Alert from "../Alert.jsx";

const MetadataForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get metadata ID for edit mode
    const { create, update, fetchById, loading, error } = useMetadata();
    const { items: questionList } = useQuestion();
    const { items: testList } = useTest();

    // State for the fetched metadata item
    const [metadata, setMetadata] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure values are set once

    // Fetch metadata for editing if ID is provided
    useEffect(() => {
        // Prevent fetching if initial values are already set
        if (!isInitialValuesSet) {
            if (id) {
                fetchById(id).then((data) => {
                    if (data) {
                        setMetadata({
                            ...data,
                            questions: data.questions.map((q) => ({
                                value: q.id,
                                label: `${q.id} | ${q.type} | ${q.description}`,
                            })),
                            tests: data.tests.map((t) => ({
                                value: t.id,
                                label: `${t.id} | ${t.title}`,
                            })),
                        });
                    }
                    setIsInitialValuesSet(true); // Mark as ready for rendering
                });
            } else {
                setMetadata(null); // No initial metadata for new creation
                setIsInitialValuesSet(true); // Ready to render empty form
            }
        }
    }, [id, fetchById, isInitialValuesSet]); // Include `isInitialValuesSet` in dependencies

    // Related data for select and multi-select fields
    const relatedData = {
        Question: questionList.map((q) => ({
            id: q.id,
            label: `${q.id} | ${q.type} | ${q.description}`,
        })),
        Test: testList.map((t) => ({
            id: t.id,
            label: `${t.id} | ${t.title}`,
        })),
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            questions: values.questions.map((q) => q.value), // Extract IDs
            tests: values.tests.map((t) => t.value), // Extract IDs
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
                initialData={metadata || {}} // Pass either fetched metadata or empty object
                onSubmit={handleSubmit}
                relatedData={relatedData}
            />
        </div>
    );
};

export default MetadataForm;
