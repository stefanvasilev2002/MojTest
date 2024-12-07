import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuestion from "../../hooks/crud/useQuestion";
import useMetadata from "../../hooks/crud/useMetadata";
import useTeacher from "../../hooks/crud/useTeacher";
import useTest from "../../hooks/crud/useTest";
import Alert from "../Alert.jsx";
import CrudActionTable from "../CrudActionTable.jsx";
import useAnswers from "../../hooks/crud/useAnswers";

const QuestionList = () => {
    const { items: questionList, loading: questionLoading, error: questionError, remove } = useQuestion();
    const { fetchById: fetchMetadataById } = useMetadata();
    const { fetchById: fetchTeacherById } = useTeacher();
    const { fetchById: fetchAnswerById } = useAnswers();
    const { fetchById: fetchTestById } = useTest();
    const navigate = useNavigate();

    // Local state to store resolved entities by their IDs
    const [teachers, setTeachers] = useState({});
    const [metadata, setMetadata] = useState({});
    const [answers, setAnswers] = useState({});
    const [tests, setTests] = useState({});

    // Load associated entities when questionList is available
    useEffect(() => {
        if (questionList.length > 0) {
            questionList.forEach(async (question) => {
                // Fetch Teacher, Metadata, Answer, and Test entities for each question
                if (!teachers[question.creatorId]) {
                    const teacher = await fetchTeacherById(question.creatorId);
                    setTeachers((prev) => ({ ...prev, [teacher.id]: teacher }));
                }

                // Fetch metadata
                question.metadataIds.forEach(async (id) => {
                    if (!metadata[id]) {
                        const meta = await fetchMetadataById(id);
                        setMetadata((prev) => ({ ...prev, [meta.id]: meta }));
                    }
                });

                // Fetch answers
                question.answerIds.forEach(async (id) => {
                    if (!answers[id]) {
                        const answer = await fetchAnswerById(id);
                        setAnswers((prev) => ({ ...prev, [answer.id]: answer }));
                    }
                });

                // Fetch tests
                question.testIds.forEach(async (id) => {
                    if (!tests[id]) {
                        const test = await fetchTestById(id);
                        setTests((prev) => ({ ...prev, [test.id]: test }));
                    }
                });
            });
        }
    }, [questionList, fetchTeacherById, fetchMetadataById, fetchAnswerById, fetchTestById]);

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            await remove(id);
        }
    };

    if (questionLoading) {
        return (
            <div>
                <h1>Question List</h1>
                <p>Loading questions...</p>
            </div>
        );
    }

    return (
        <div>
            {questionError && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the questions." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Question List</h1>
            <button
                onClick={() => navigate("/crud/question/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Question
            </button>
            {questionList.length === 0 ? (
                <p>No questions found.</p>
            ) : (
                <CrudActionTable
                    headers={[
                        "ID",
                        "Description",
                        "Points",
                        "Negative Points",
                        "Formula",
                        "Image URL",
                        "Hint",
                        "Teacher",
                        "Answers",
                        "Tests",
                        "Metadata",
                    ]}
                    rows={questionList.map((question) => [
                        question.id,
                        question.description,
                        question.points,
                        question.negativePointsPerAnswer,
                        question.formula,
                        question.imageUrl,
                        question.hint,
                        // Render teacher
                        teachers[question.creatorId]?.fullName || "Unknown Teacher",
                        // Render answers
                        question.answerIds.map((id) => answers[id]?.answerText).join(", ") || "No Answers",
                        // Render tests
                        question.testIds.map((id) => tests[id]?.title).join(", ") || "No Tests",
                        // Render metadata
                        question.metadataIds.map((id) => metadata[id]?.key).join(", ") || "No Metadata",
                    ])}
                    onEdit={(id) => navigate(`/crud/question/edit/${id}`)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    );
};

export default QuestionList;
