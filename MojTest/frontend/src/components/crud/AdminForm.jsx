import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAdmin from "../../hooks/crud/useAdmin"; // Custom hook to handle admin CRUD operations
import formConfigs from "../../config/formConfigs"; // Import form configurations
import CrudForm from "./CrudForm.jsx"; // Reusable CrudForm component
import Alert from "../Alert.jsx"; // Alert component for error messages

const AdminForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the admin ID for edit mode
    const { create, update, fetchById, loading, error } = useAdmin(); // Hooks for create, update, and fetch
    const [admin, setAdmin] = useState(null); // State to store fetched admin data
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure initial data is set only once

    // Fetch admin data for editing if an ID is provided
    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                // Fetch admin data if in edit mode
                fetchById(id).then((data) => {
                    if (data) {
                        setAdmin(data); // Set the admin data for editing
                    }
                    setIsInitialValuesSet(true); // Mark the data as ready
                });
            } else {
                setAdmin(null); // No admin data for new creation
                setIsInitialValuesSet(true); // Ready to render empty form
            }
        }
    }, [id, fetchById, isInitialValuesSet]);

    // Handle form submission (create or update)
    const handleSubmit = async (values) => {
        try {
            if (id) {
                // Update admin if in edit mode
                await update(id, values);
            } else {
                // Create new admin if in add mode
                await create(values);
            }
            navigate("/crud/users/Admin"); // Redirect to admin list page after submission
        } catch (err) {
            console.error("Error submitting admin data", err);
        }
    };

    if (loading || !isInitialValuesSet) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{id ? "Edit Admin" : "Create Admin"}</h1>
            {error && <Alert message="An error occurred while loading data." type="error" />}

            {/* Pass either fetched admin data or empty object */}
            <CrudForm
                entity="Admin"
                formConfigs={formConfigs}
                initialData={admin || {}} // If admin data exists, use it, otherwise use an empty object
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AdminForm;
