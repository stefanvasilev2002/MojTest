import React from "react";
import { useNavigate } from "react-router-dom";
import useStudent from "../../hooks/crud/useStudent.js"; // Import the custom hook for students
import Alert from "../Alert.jsx"; // Import the Alert component
import CrudActionTable from "../CrudActionTable.jsx"; // Import the reusable table

const StudentList = () => {
    const { items: studentsList, loading, error, remove } = useStudent(); // Fetch students data and remove method
    const navigate = useNavigate();

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await remove(id); // Call the remove method from the hook
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Students</h1>
                <p>Loading students...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the students." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Students</h1>
            <button
                onClick={() => navigate("/crud/users/student/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Student
            </button>
            {studentsList.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Username", "Email", "Full Name", "Grade", "Taken Tests"]}
                    rows={studentsList.map((student) => [
                        student.id,
                        student.username,
                        student.email,
                        student.fullName,
                        student.grade,
                        student.takenTests.length,
                    ])}
                    onEdit={(id) => navigate(`/crud/users/student/edit/${id}`)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    );
};

export default StudentList;
