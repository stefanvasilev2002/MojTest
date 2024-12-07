import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTeacher from "../../hooks/crud/useTeacher"; // Custom hook for Teacher CRUD operations
import formConfigs from "../../config/formConfigs"; // Import the form configurations
import CrudForm from "./CrudForm.jsx";
import Alert from "../Alert.jsx";

const TeacherForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get Teacher ID for edit mode
    const { create, update, fetchById, loading, error } = useTeacher();

    // State for the fetched Teacher data
    const [teacher, setTeacher] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);

    // Fetch teacher for editing if ID is provided
    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                fetchById(id).then((data) => {
                    if (data) {
                        setTeacher(data);
                    }
                    setIsInitialValuesSet(true); // Mark as ready for rendering
                });
            } else {
                setTeacher(null); // No initial data for new creation
                setIsInitialValuesSet(true); // Ready to render empty form
            }
        }
    }, [id, fetchById, isInitialValuesSet]);

    // Handle form submission
    const handleSubmit = async (values) => {
        try {
            if (id) {
                await update(id, values);
            } else {
                await create(values);
            }
            navigate("crud/users/Teacher"); // Redirect after submission
        } catch (err) {
            console.error("Error submitting teacher", err);
        }
    };

    if (loading || !isInitialValuesSet) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{id ? "Edit Teacher" : "Create Teacher"}</h1>
            {error && <Alert message="An error occurred while loading data." type="error" />}

            <CrudForm
                entity="Teacher"
                formConfigs={formConfigs}
                initialData={teacher || {}} // Pass either fetched data or empty object
                onSubmit={handleSubmit}
                relatedData={{}} // No related data for Teacher currently
            />
        </div>
    );
};

export default TeacherForm;
