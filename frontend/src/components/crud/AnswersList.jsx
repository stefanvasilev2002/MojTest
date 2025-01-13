import React from "react";
import { useNavigate } from "react-router-dom";
import useAnswers from "../../hooks/crud/useAnswers.js";
import Alert from "../Alert.jsx";
import CrudActionTable from "../CrudActionTable.jsx";

const AnswersList = () => {
    const { items: answersList, loading, error, remove } = useAnswers();
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this answer?")) {
            await remove(id);
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Answers List</h1>
                <p>Loading answers...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the answers." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Answers List</h1>
            <button
                onClick={() => navigate("/crud/answers/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Answer
            </button>
            {answersList.length === 0 ? (
                <p>No answers found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Answer Text", "Is Correct"]}
                    rows={answersList.map((answer) => [
                        answer.id,
                        answer.answerText,
                        answer.isCorrect ? "Yes" : "No",
                    ])}
                    onEdit={(answer) => navigate(`/crud/answers/edit/${answer.id}`)}
                    onDelete={(answer) => handleDelete(answer.id)}
                />
            )}
        </div>
    );
};

export default AnswersList;
