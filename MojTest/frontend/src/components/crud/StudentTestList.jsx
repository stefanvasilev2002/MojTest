import React from "react";
import { useNavigate } from "react-router-dom";
import useStudentTests from "../../hooks/crud/useStudentTests"; // Use the hook created earlier
import Alert from "../Alert.jsx";
import CrudActionTable from "../CrudActionTable.jsx";

const StudentTestList = () => {
    const { items: studentTests, loading, error, remove } = useStudentTests();
    const navigate = useNavigate();

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student test?")) {
            await remove(id);
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Student Tests List</h1>
                <p>Loading student tests...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the student tests." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Student Tests List</h1>
            <button
                onClick={() => navigate("/crud/student-tests/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Student Test
            </button>
            {studentTests.length === 0 ? (
                <p>No student tests found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Student", "Test", "Score", "Date Taken"]}
                    rows={studentTests.map((test) => [
                        test.id,
                        test.student?.name || "N/A",
                        test.test?.name || "N/A",
                        test.score,
                        test.dateTaken,
                    ])}
                    onEdit={(test) => navigate(`/crud/student-tests/edit/${test.id}`)}
                    onDelete={(test) => handleDelete(test.id)}
                />
            )}
        </div>
    );
};

export default StudentTestList;
