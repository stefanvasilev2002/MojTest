import React from "react";
import { useNavigate } from "react-router-dom";
import useTest from "../../hooks/crud/useTest.js"; // Import the useTest hook
import Alert from "../Alert.jsx"; // Import the Alert component
import CrudActionTable from "../CrudActionTable.jsx"; // Import the reusable table

const TestList = () => {
    const { items: testList, loading, error, remove } = useTest(); // Fetch test data and remove method
    const navigate = useNavigate();

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this test?")) {
            await remove(id); // Call the remove method from the hook
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Test List</h1>
                <p>Loading tests...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the tests." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Test List</h1>
            <button
                onClick={() => navigate("/crud/test/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Test
            </button>
            {testList.length === 0 ? (
                <p>No tests found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Title", "Description", "Number of Questions"]}
                    rows={testList.map((test) => [
                        test.id,
                        test.title,
                        test.description,
                        test.numQuestions,
                    ])}
                    onEdit={(id) => navigate(`/crud/test/edit/${id}`)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    );
};

export default TestList;
