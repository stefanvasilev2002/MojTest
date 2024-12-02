import React from "react";
import { useNavigate } from "react-router-dom";
import useStudentAnswers from "../../hooks/crud/useStudentAnswers.js";
import Alert from "../Alert.jsx";
import CrudActionTable from "../CrudActionTable.jsx";

const StudentAnswersList = () => {
    const { items: studentAnswers, loading, error, remove } = useStudentAnswers(); // Fetch student answers and remove method
    const navigate = useNavigate();

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student answer?")) {
            await remove(id);
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Student Answers List</h1>
                <p>Loading student answers...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the student answers." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Student Answers List</h1>
            <button
                onClick={() => navigate("/crud/student-answers/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Student Answer
            </button>
            {studentAnswers.length === 0 ? (
                <p>No student answers found.</p>
            ) : (
                <CrudActionTable
                    headers={[
                        "ID",
                        "Submitted Value",
                        "Student Test ID",
                        "Test Question ID",
                        "Chosen Answer ID",
                    ]}
                    rows={studentAnswers.map((answer) => [
                        answer.id,
                        answer.submittedValue,
                        answer.studentTest.id,
                        answer.testQuestion.id,
                        answer.chosenAnswer.id,
                    ])}
                    onEdit={(answer) => navigate(`/crud/student-answers/edit/${answer.id}`)}
                    onDelete={(answer) => handleDelete(answer.id)}
                />
            )}
        </div>
    );
};

export default StudentAnswersList;
