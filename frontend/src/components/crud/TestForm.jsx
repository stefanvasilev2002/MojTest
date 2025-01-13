import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTest from "../../hooks/crud/useTest"; // Custom hook for test CRUD operations
import useTeacher from "../../hooks/crud/useTeacher"; // Custom hook for teacher CRUD operations
import useQuestion from "../../hooks/crud/useQuestion"; // Custom hook for question CRUD operations
import useMetadata from "../../hooks/crud/useMetadata"; // Custom hook for metadata CRUD operations
import useTestQuestion from "../../hooks/crud/useTestQuestion"; // Custom hook for test questions
import useStudentTest from "../../hooks/crud/useStudentTests"; // Custom hook for student tests
import formConfigs from "../../config/formConfigs"; // Import form configurations
import CrudForm from "./CrudForm.jsx"; // Reusable CrudForm component
import Alert from "../Alert.jsx"; // Alert component for error messages

const TestForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get test ID for edit mode
    const { create, update, fetchById, loading, error } = useTest();
    const { items: teacherList } = useTeacher(); // Fetch teachers
    const { items: questionList } = useQuestion(); // Fetch questions
    const { items: metadataList } = useMetadata(); // Fetch metadata
    const { items: testQuestionList } = useTestQuestion(); // Fetch test questions
    const { items: studentTestList } = useStudentTest(); // Fetch student tests

    // State for the fetched test item
    const [test, setTest] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure values are set once

    // Fetch test for editing if ID is provided
    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                fetchById(id).then((data) => {
                    if (data) {
                        setTest({
                            ...data,
                            questionIds: data.questionIds.map((questionId) => ({
                                value: questionId,
                                label: `Question ${questionId}`,
                            })),
                            creatorId: data.creatorId
                                ? { value: data.creatorId, label: `Teacher ${data.creatorId}` }
                                : null,
                            metadataIds: data.metadataIds.map((metadataId) => ({
                                value: metadataId,
                                label: `Metadata ${metadataId}`,
                            })),
                            testQuestionIds: data.testQuestionIds.map((testQuestionId) => ({
                                value: testQuestionId,
                                label: `Test Question ${testQuestionId}`,
                            })),
                            studentTestIds: data.studentTestIds.map((studentTestId) => ({
                                value: studentTestId,
                                label: `Student Test ${studentTestId}`,
                            })),
                        });
                    }
                    setIsInitialValuesSet(true);
                });
            } else {
                setTest(null); // No initial test for creation
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
        Question: Array.isArray(questionList) ? questionList.map((q) => ({
            value: q.id,
            label: `${q.id} | ${q.description}`,
        })) : [],
        Metadata: Array.isArray(metadataList) ? metadataList.map((m) => ({
            value: m.id,
            label: `${m.id} | ${m.key} | ${m.value}`,
        })) : [],
        TestQuestion: Array.isArray(testQuestionList) ? testQuestionList.map((tq) => ({
            value: tq.id,
            label: `Test Question ${tq.id}`,
        })) : [],
        StudentTest: Array.isArray(studentTestList) ? studentTestList.map((st) => ({
            value: st.id,
            label: `Student Test ${st.id}`,
        })) : [],
    };

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            creatorId: values.creator ? values.creator.value : null, // Extract creatorId from creator
            questionIds: (values.questionBank || []).map((question) => question.value), // Extract questionIds from questionBank
            metadataIds: (values.metadata || []).map((meta) => meta.value), // Extract metadataIds from metadata
            testQuestionIds: (values.testQuestionIds || []).map((testQuestion) => testQuestion.value), // Extract testQuestionIds
            studentTestIds: (values.studentTestIds || []).map((studentTest) => studentTest.value), // Extract studentTestIds
        };

        // Log the prepared payload to verify the data being sent to the backend

        try {
            if (id) {
                await update(id, payload); // Update existing test
            } else {
                await create(payload); // Create new test
            }
            navigate("/crud/test");
        } catch (err) {
            console.error("Error submitting test:", err); // Log error if submission fails
        }
    };

    if (loading || !isInitialValuesSet) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{id ? "Edit Test" : "Create Test"}</h1>
            {error && <Alert message="An error occurred while loading data." type="error" />}

            <CrudForm
                entity="Test"
                formConfigs={formConfigs}
                initialData={test || {}} // Pass either fetched test or empty object
                onSubmit={handleSubmit}
                relatedData={relatedData} // Pass the related data (teachers, questions, metadata, test questions, student tests)
            />
        </div>
    );
};

export default TestForm;