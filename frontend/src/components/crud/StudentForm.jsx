import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStudent from "../../hooks/crud/useStudent"; // Custom hook to handle student CRUD operations
import formConfigs from "../../config/formConfigs"; // Import form configurations
import CrudForm from "./CrudForm.jsx"; // Reusable CrudForm component
import Alert from "../Alert.jsx"; // Alert component for error messages

const StudentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the student ID for edit mode
    const { create, update, fetchById, loading, error } = useStudent(); // Hooks for create, update, and fetch
    const [student, setStudent] = useState(null); // State to store fetched student data
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure initial data is set only once

    // Fetch student data for editing if an ID is provided
    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                // Fetch student data if in edit mode
                fetchById(id).then((data) => {
                    if (data) {
                        setStudent(data); // Set the student data for editing
                    }
                    setIsInitialValuesSet(true); // Mark the data as ready
                });
            } else {
                setStudent(null); // No student data for new creation
                setIsInitialValuesSet(true); // Ready to render empty form
            }
        }
    }, [id, fetchById, isInitialValuesSet]);

    // Handle form submission (create or update)
    const handleSubmit = async (values) => {
        try {
            if (id) {
                // Update student if in edit mode
                await update(id, values);
            } else {
                // Create new student if in add mode
                await create(values);
            }
            navigate("/crud/users/Student"); // Redirect to users page after submission
        } catch (err) {
            console.error("Error submitting student data", err);
        }
    };

    if (loading || !isInitialValuesSet) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{id ? "Edit Student" : "Create Student"}</h1>
            {error && <Alert message="An error occurred while loading data." type="error" />}

            {/* Pass either fetched student data or empty object */}
            <CrudForm
                entity="Student"
                formConfigs={formConfigs}
                initialData={student || {}} // If student data exists, use it, otherwise use an empty object
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default StudentForm;
