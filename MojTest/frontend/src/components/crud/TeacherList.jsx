import React from "react";
import { useNavigate } from "react-router-dom";
import useTeacher from "../../hooks/crud/useTeacher.js"; // Import the custom hook for teachers
import Alert from "../Alert.jsx"; // Import the Alert component
import CrudActionTable from "../CrudActionTable.jsx"; // Import the reusable table

const TeacherList = () => {
    const { items: teachersList, loading, error, remove } = useTeacher(); // Fetch teacher data and remove method
    const navigate = useNavigate();

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            await remove(id); // Call the remove method from the hook
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Teachers</h1>
                <p>Loading teachers...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the teachers." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Teachers</h1>
            <button
                onClick={() => navigate("/crud/users/teacher/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Teacher
            </button>
            {teachersList.length === 0 ? (
                <p>No teachers found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Username", "Email", "Full Name", "Created Tests"]}
                    rows={teachersList.map((teacher) => [
                        teacher.id,
                        teacher.username,
                        teacher.email,
                        teacher.fullName,
                        teacher.createdTests.length,
                    ])}
                    onEdit={(id) => navigate(`/crud/users/teacher/edit/${id}`)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    );
};

export default TeacherList;
