import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import useQuestion from "../../hooks/crud/useQuestion";
import useTeacher from "../../hooks/crud/useTeacher";
import useTest from "../../hooks/crud/useTest";
import useMetadata from "../../hooks/crud/useMetadata";
import useAnswers from "../../hooks/crud/useAnswers";
import formConfigs from "../../config/formConfigs";
import CrudForm from "./CrudForm.jsx";
import Alert from "../Alert.jsx";
import {useTranslation} from "react-i18next";
import {questionTypeLabels} from "../../config/questionTypeLabels.js";

const QuestionForm = () => {
    const { t } = useTranslation('common');

    const navigate = useNavigate();
    const { id } = useParams();
    const { create, update, fetchById, loading, error } = useQuestion();
    const { items: teacherList } = useTeacher();
    const { items: testList } = useTest();
    const { items: metadataList } = useMetadata();
    const { items: answerList } = useAnswers();

    const [question, setQuestion] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure values are set once

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
                setQuestion(null);
                setIsInitialValuesSet(true);
            }
        }
    }, [id, fetchById, isInitialValuesSet]);


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
        Type: Object.keys(questionTypeLabels).map(key => ({
            value: key,
            label: t(questionTypeLabels[key]),
        })),
    };

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            creatorId: values.creatorId ? values.creatorId.value : null, // Extract teacher ID
            testIds: values.testIds.map((test) => test.value), // Extract test IDs
            metadataIds: values.metadataIds.map((meta) => meta.value), // Extract metadata IDs
            answerIds: values.answerIds.map((answer) => answer.value), // Extract answer IDs
            type: values.type ? values.type.value : null,

        };
        if (values.image) {
            payload.image = {
                id: values.image.id,
                file: null,
                filePath: values.image.fileDownloadUri,
                uploadedAt: new Date(),
                fileName: values.image.fileName,
                fileType: values.image.fileType,
                relatedEntityId: values.id || null,
            };
        }
        try {
            if (id) {
                await update(id, payload);
            } else {
                await create(payload);
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
            <h1>{id ? t('question.edit') : t('question.create')}</h1>
            {error && <Alert message="An error occurred while loading data." type="error"/>}

            <CrudForm
                entity="Question"
                formConfigs={formConfigs}
                initialData={question || {}}
                onSubmit={handleSubmit}
                relatedData={relatedData}
            />
        </div>
    );
};

export default QuestionForm;
