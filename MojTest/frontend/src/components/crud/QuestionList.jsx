import React from "react";
import { useNavigate } from "react-router-dom";
import useQuestion from "../../hooks/crud/useQuestion"; // Import custom hook
import Alert from "../Alert.jsx"; // Import Alert component
import CrudActionTable from "../CrudActionTable.jsx"; // Import reusable table

const QuestionList = () => {
    const { items: questionList, loading, error, remove } = useQuestion(); // Fetch questions and remove method
    const navigate = useNavigate();

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            await remove(id); // Call the remove method from the hook
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Question List</h1>
                <p>Loading questions...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
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
                    headers={["ID", "Description", "Points"]}
                    rows={questionList.map((question) => [
                        question.id,
                        question.description,
                        question.points,
                    ])}
                    onEdit={(question) => navigate(`/crud/question/edit/${question.id}`)}
                    onDelete={(question) => handleDelete(question.id)}
                />
            )}
        </div>
    );
};

export default QuestionList;
