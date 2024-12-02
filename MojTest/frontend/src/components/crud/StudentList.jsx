import React from "react";
import { useNavigate } from "react-router-dom";
import useUsers from "../../hooks/crud/useUsers.js"; // Import your custom hook
import Alert from "../Alert.jsx"; // Import the Alert component
import CrudActionTable from "../CrudActionTable.jsx"; // Import the reusable table

const StudentList = () => {
    const { items: usersList, loading, error, remove } = useUsers(); // Fetch users data and remove method
    const navigate = useNavigate();

    // Filter users by Student role
    const filteredStudents = usersList.filter(user => user.role === "Student");

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
            {filteredStudents.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Username", "Email", "Full Name", "Grade", "Taken Tests"]}
                    rows={filteredStudents.map((student) => [
                        student.id,
                        student.username,
                        student.email,
                        student.fullName,
                        student.grade,
                        student.takenTests.length,
                    ])}
                    onEdit={(student) => navigate(`/crud/users/student/edit/${student.id}`)}
                    onDelete={(student) => handleDelete(student.id)}
                />
            )}
        </div>
    );
};

export default StudentList;
