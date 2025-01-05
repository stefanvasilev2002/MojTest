import React from "react";
import { useNavigate } from "react-router-dom";
import useTestQuestion from "../../hooks/crud/useTestQuestion"; // Import the hook for test questions
import Alert from "../Alert.jsx"; // Import the Alert component
import CrudActionTable from "../CrudActionTable.jsx"; // Import the reusable table

const TestQuestionList = () => {
    const { items: testQuestionList, loading, error, remove } = useTestQuestion(); // Fetch test questions data and remove method
    const navigate = useNavigate();

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this test question?")) {
            await remove(id); // Call the remove method from the hook
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Test Questions List</h1>
                <p>Loading test questions...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the test questions." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Test Questions</h1>
            <button
                onClick={() => navigate("/crud/test-question/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Test Question
            </button>
            {testQuestionList.length === 0 ? (
                <p>No test questions found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Test", "Question"]}
                    rows={testQuestionList.map((item) => [
                        item.id,
                        item.test.name, // Assuming test has a name property
                        item.question.text, // Assuming question has a text property
                    ])}
                    onEdit={(item) => navigate(`/crud/test-question/edit/${item.id}`)}
                    onDelete={(item) => handleDelete(item.id)}
                />
            )}
        </div>
    );
};

export default TestQuestionList;
