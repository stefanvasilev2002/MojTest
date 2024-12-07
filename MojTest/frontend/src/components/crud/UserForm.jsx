import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useUsers from "../../hooks/crud/useUsers.js";
import formConfigs from "../../config/formConfigs"; // Import the form configurations
import CrudForm from "./CrudForm.jsx"; // Import the reusable CrudForm component
import Alert from "../Alert.jsx"; // Import Alert component for error handling

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get User ID from URL parameters for edit mode
    const { create, update, fetchById, loading, error } = useUsers(); // Custom hook to interact with User API

    // State for holding the fetched User data
    const [user, setUser] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure values are set only once

    // Fetch User data for editing if ID is provided
    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                fetchById(id).then((data) => {
                    if (data) {
                        setUser(data); // Set fetched User data
                    }
                    setIsInitialValuesSet(true); // Mark as ready for rendering
                });
            } else {
                setUser(null); // No initial data for new creation
                setIsInitialValuesSet(true); // Ready to render empty form
            }
        }
    }, [id, fetchById, isInitialValuesSet]); // Fetch User data only once

    // Handle form submission for User
    const handleSubmit = async (values) => {
        try {
            if (id) {
                await update(id, values); // Update existing User data
            } else {
                await create(values); // Create new User data
            }
            navigate("/crud/user"); // Redirect to User listing page after successful submission
        } catch (err) {
            console.error("Error submitting user", err);
        }
    };

    // While loading or fetching initial data
    if (loading || !isInitialValuesSet) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{id ? "Edit User" : "Create User"}</h1>
            {error && <Alert message="An error occurred while loading data." type="error" />}

            <CrudForm
                entity="User" // Entity name used in the form
                formConfigs={formConfigs} // Form configuration for User
                initialData={user || {}} // Fetched user data or empty object
                onSubmit={handleSubmit} // Submit handler
            />
        </div>
    );
};

export default UserForm;
