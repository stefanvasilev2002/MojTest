import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useQuestion from "../../hooks/crud/useQuestion";
import useMetadata from "../../hooks/crud/useMetadata";
import useTeacher from "../../hooks/crud/useTeacher";
import useTest from "../../hooks/crud/useTest";
import Alert from "../Alert.jsx";
import CrudActionTable from "../CrudActionTable.jsx";
import useAnswers from "../../hooks/crud/useAnswers";
import {questionTypeLabels} from "../../config/questionTypeLabels.js";
import { useTranslation } from "react-i18next";

const QuestionList = () => {
    const { t } = useTranslation('common');

    const { items: questionList, loading: questionLoading, error: questionError, remove } = useQuestion();
    const { fetchById: fetchMetadataById } = useMetadata();
    const { fetchById: fetchTeacherById } = useTeacher();
    const { fetchById: fetchAnswerById } = useAnswers();
    const { fetchById: fetchTestById } = useTest();
    const navigate = useNavigate();

    const [teachers, setTeachers] = useState({});
    const [metadata, setMetadata] = useState({});
    const [answers, setAnswers] = useState({});
    const [tests, setTests] = useState({});

    useEffect(() => {
        if (questionList.length > 0) {
            questionList.forEach(async (question) => {
                if (!teachers[question.creatorId]) {
                    const teacher = await fetchTeacherById(question.creatorId);
                    setTeachers((prev) => ({ ...prev, [teacher.id]: teacher }));
                }

                question.metadataIds.forEach(async (id) => {
                    if (!metadata[id]) {
                        const meta = await fetchMetadataById(id);
                        setMetadata((prev) => ({ ...prev, [meta.id]: meta }));
                    }
                });

                question.answerIds.forEach(async (id) => {
                    if (!answers[id]) {
                        const answer = await fetchAnswerById(id);
                        setAnswers((prev) => ({ ...prev, [answer.id]: answer }));
                    }
                });

                question.testIds.forEach(async (id) => {
                    if (!tests[id]) {
                        const test = await fetchTestById(id);
                        setTests((prev) => ({ ...prev, [test.id]: test }));
                    }
                });
            });
        }
    }, [questionList, fetchTeacherById, fetchMetadataById, fetchAnswerById, fetchTestById]);
    const translateType = (type) => {
        return t(questionTypeLabels[type]) || "Unknown Type";
    };

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
                        "Hint",
                        "Type",
                        "Teacher",
                        "Answers",
                        "Tests",
                        "Metadata",
                        "Image",
                    ]}
                    rows={questionList.map((question) => [
                        question.id,
                        question.description,
                        question.points,
                        question.negativePointsPerAnswer,
                        question.formula,
                        question.hint,
                        translateType(question.type),
                        teachers[question.creatorId]?.fullName || "Unknown Teacher",
                        question.answerIds.map((id) => answers[id]?.answerText).join(", ") || "No Answers",
                        question.testIds.map((id) => tests[id]?.title).join(", ") || "No Tests",
                        question.metadataIds.map((id) => metadata[id]?.key).join(", ") || "No Metadata",
                        question.image && question.image.id ? (
                            `${import.meta.env.VITE_API_BASE_URL}/files/download/${question.image.id}`
                        ) : (
                            "No Image"
                        )

                    ])}
                    onEdit={(id) => navigate(`/crud/question/edit/${id}`)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    );
};

export default QuestionList;