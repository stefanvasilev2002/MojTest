import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMetadata from "../../hooks/crud/useMetadata.js";
import useQuestion from "../../hooks/crud/useQuestion";
import useTest from "../../hooks/crud/useTest";
import formConfigs from "../../config/formConfigs";
import CrudForm from "./CrudForm.jsx";
import Alert from "../Alert.jsx";
import { predefinedKeyValues } from "../../config/predefinedKeyValues";

const MetadataForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { create, update, fetchById, loading, error } = useMetadata();
    const { items: questionList } = useQuestion();
    const { items: testList } = useTest();

    const [metadata, setMetadata] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);
    const [keySelected, setKeySelected] = useState("");
    const [valueOptions, setValueOptions] = useState([]);

    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                fetchById(id).then((data) => {
                    if (data) {
                        setMetadata({
                            ...data,
                            questions: data.questionIds?.map((id) => ({
                                value: id,
                                label: `Question ${id}`,
                            })) || [],
                            tests: data.testIds?.map((id) => ({
                                value: id,
                                label: `Test ${id}`,
                            })) || [],
                        });
                        setKeySelected(data.key);
                        setValueOptions(predefinedKeyValues[data.key] || []);
                    }
                    setIsInitialValuesSet(true);
                });
            } else {
                setMetadata(null);
                setIsInitialValuesSet(true);
            }
        }
    }, [id, fetchById, isInitialValuesSet]);

    const handleKeyChange = (selectedKey) => {
        const key = selectedKey.value;
        const updatedOptions = predefinedKeyValues[key] || [];
        setValueOptions(updatedOptions);
    };

    const handleSubmit = async (values) => {

        const payload = {
            id: values.id,
            key: values.key.value,
            value: values.value.value,
            questionIds: values.questions.map((q) => q.value),
            testIds: values.tests.map((t) => t.value),
        };

        try {
            if (id) {
                await update(id, payload);
            } else {
                await create(payload);
            }
            navigate("/crud/metadata");
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