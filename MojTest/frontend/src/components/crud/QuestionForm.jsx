import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useQuestion from "../../hooks/crud/useQuestion"; // Custom hook for question CRUD operations
import useTeacher from "../../hooks/crud/useTeacher"; // Custom hook for teacher CRUD operations
import useTest from "../../hooks/crud/useTest"; // Custom hook for test CRUD operations
import useMetadata from "../../hooks/crud/useMetadata"; // Custom hook for metadata CRUD operations
import useAnswers from "../../hooks/crud/useAnswers"; // Custom hook for answer CRUD operations
import formConfigs from "../../config/formConfigs"; // Import form configurations
import CrudForm from "./CrudForm.jsx"; // Reusable CrudForm component
import Alert from "../Alert.jsx"; // Alert component for error messages

const QuestionForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get question ID for edit mode
    const { create, update, fetchById, loading, error } = useQuestion();
    const { items: teacherList } = useTeacher(); // Fetch teachers
    const { items: testList } = useTest(); // Fetch tests
    const { items: metadataList } = useMetadata(); // Fetch metadata
    const { items: answerList } = useAnswers(); // Fetch answers

    // State for the fetched question item
    const [question, setQuestion] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure values are set once

    // Fetch question for editing if ID is provided
    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                fetchById(id).then((data) => {
                    if (data) {
                        setQuestion({
                            ...data,
                            testIds: data.testIds.map((testId) => ({
                                value: testId,
                                label: `Test ${testId}`,
                            })),
                            metadataIds: data.metadataIds.map((metaId) => ({
                                value: metaId,
                                label: `Metadata ${metaId}`,
                            })),
                            answerIds: data.answerIds.map((answerId) => ({
                                value: answerId,
                                label: `Answer ${answerId}`,
                            })),
                            creatorId: data.creatorId
                                ? { value: data.creatorId, label: `Teacher ${data.creatorId}` }
                                : null,
                        });
                    }
                    setIsInitialValuesSet(true);
                });
            } else {
                setQuestion(null); // No initial question for creation
                setIsInitialValuesSet(true);
            }
        }
    }, [id, fetchById, isInitialValuesSet]);


    // Related data for select and multi-select fields
    const relatedData = {
        Teacher: Array.isArray(teacherList) ? teacherList.map((t) => ({
            value: t.id,
            label: `${t.id} | ${t.fullName}`,
        })) : [],
        Test: Array.isArray(testList) ? testList.map((t) => ({
            value: t.id,
            label: `${t.id} | ${t.title}`,
        })) : [],
        Metadata: Array.isArray(metadataList) ? metadataList.map((m) => ({
            value: m.id,
            label: `${m.id} | ${m.key} | ${m.value}`,
        })) : [],
        Answer: Array.isArray(answerList) ? answerList.map((a) => ({
            value: a.id,
            label: `${a.id} | ${a.text}`,
        })) : [],
    };




    // Handle form submission
    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            creatorId: values.creatorId ? values.creatorId.value : null, // Extract teacher ID
            testIds: values.testIds.map((test) => test.value), // Extract test IDs
            metadataIds: values.metadataIds.map((meta) => meta.value), // Extract metadata IDs
            answerIds: values.answerIds.map((answer) => answer.value), // Extract answer IDs
        };

        try {
            if (id) {
                await update(id, payload); // Update existing question
            } else {
                await create(payload); // Create new question
            }
            navigate("/crud/question");
        } catch (err) {
            console.error("Error submitting question:", err);
        }
    };


    if (loading || !isInitialValuesSet) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{id ? "Edit Question" : "Create Question"}</h1>
            {error && <Alert message="An error occurred while loading data." type="error" />}

            <CrudForm
                entity="Question"
                formConfigs={formConfigs}
                initialData={question || {}} // Pass either fetched question or empty object
                onSubmit={handleSubmit}
                relatedData={relatedData} // Pass the related data (teachers, tests, metadata, answers)
            />
        </div>
    );
};

export default QuestionForm;
