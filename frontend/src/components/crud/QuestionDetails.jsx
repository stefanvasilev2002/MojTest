import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useQuestion from "../../hooks/crud/useQuestion";
import useMetadata from "../../hooks/crud/useMetadata";
import useTeacher from "../../hooks/crud/useTeacher";
import useTest from "../../hooks/crud/useTest";
import useAnswers from "../../hooks/crud/useAnswers";
import Alert from "../Alert.jsx";
import { useTranslation } from "react-i18next";
import { questionTypeLabels } from "../../config/questionTypeLabels.js";

const QuestionDetails = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    const { fetchById: fetchQuestionById } = useQuestion();
    const { fetchById: fetchTeacherById } = useTeacher();
    const { fetchById: fetchMetadataById } = useMetadata();
    const { fetchById: fetchAnswerById } = useAnswers();
    const { fetchById: fetchTestById } = useTest();

    const [question, setQuestion] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const [metadata, setMetadata] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isDataFetched, setIsDataFetched] = useState(false);

    useEffect(() => {
        if (isDataFetched) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const questionData = await fetchQuestionById(questionId);
                setQuestion(questionData);

                const teacherData = await fetchTeacherById(questionData.creatorId);
                const metadataData = await Promise.all(
                    questionData.metadataIds.map(id => fetchMetadataById(id))
                );
                const answersData = await Promise.all(
                    questionData.answerIds.map(id => fetchAnswerById(id))
                );
                const testsData = await Promise.all(
                    questionData.testIds.map(id => fetchTestById(id))
                );

                setTeacher(teacherData);
                setMetadata(metadataData);
                setAnswers(answersData);
                setTests(testsData);

                setIsDataFetched(true);

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch question details.");
                setLoading(false);
            }
        };

        fetchData();
    }, [questionId, fetchQuestionById, fetchTeacherById, fetchMetadataById, fetchAnswerById, fetchTestById, isDataFetched]);

    const teacherName = useMemo(() => teacher ? teacher.fullName : "Unknown Teacher", [teacher]);
    const answerList = useMemo(() => answers.length > 0 ? answers.map(answer => answer.answerText).join(", ") : "No answers available", [answers]);
    const testList = useMemo(() => tests.length > 0 ? tests.map(test => test.title).join(", ") : "No tests available", [tests]);
    const metadataList = useMemo(() => metadata.length > 0 ? metadata.map(meta => meta.key).join(", ") : "No metadata available", [metadata]);
    const questionType = useMemo(() => question ? t(questionTypeLabels[question.type]) : "Unknown Type", [question, t]);

    if (loading) return <p>Loading question details...</p>;

    if (error) return <Alert message={error} type="error" />;

    return (
        <div>
            <h1 className="text-3xl font-semibold mb-4">Question Details</h1>
            <button
                onClick={() => navigate("/crud/question")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Back to Question List
            </button>
            <div className="question-details">
                <div>
                    <h2>Description</h2>
                    <p>{question.description}</p>
                </div>
                <div>
                    <h2>Points</h2>
                    <p>{question.points}</p>
                </div>
                <div>
                    <h2>Negative Points</h2>
                    <p>{question.negativePointsPerAnswer}</p>
                </div>
                <div>
                    <h2>Formula</h2>
                    <p>{question.formula}</p>
                </div>
                <div>
                    <h2>Image</h2>
                    {question.image.id ? (
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/files/download/${question.image.id}`}
                            alt="Question Image"
                            style={{ width: "300px", height: "auto" }}
                        />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
                <div>
                    <h2>Type</h2>
                    <p>{questionType}</p> {/* Displaying the translated question type */}
                </div>
                <div>
                    <h2>Teacher</h2>
                    <p>{teacherName}</p>
                </div>
                <div>
                    <h2>Answers</h2>
                    <p>{answerList}</p>
                </div>
                <div>
                    <h2>Tests</h2>
                    <p>{testList}</p>
                </div>
                <div>
                    <h2>Metadata</h2>
                    <p>{metadataList}</p>
                </div>
            </div>
        </div>
    );
};

export default QuestionDetails;
