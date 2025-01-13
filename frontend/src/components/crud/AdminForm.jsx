import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAdmin from "../../hooks/crud/useAdmin";
import formConfigs from "../../config/formConfigs";
import CrudForm from "./CrudForm.jsx";
import Alert from "../Alert.jsx";

const AdminForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { create, update, fetchById, loading, error } = useAdmin();
    const [admin, setAdmin] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);

    useEffect(() => {
        if (!isInitialValuesSet) {
            if (id) {
                fetchById(id).then((data) => {
                    if (data) {
                        setAdmin(data);
                    }
                    setIsInitialValuesSet(true);
                });
            } else {
                setAdmin(null);
                setIsInitialValuesSet(true);
            }
        }
    }, [id, fetchById, isInitialValuesSet]);

    const handleSubmit = async (values) => {
        try {
            if (id) {
                await update(id, values);
            } else {
                await create(values);
            }
            navigate("/crud/users/Admin");
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

            <CrudForm
                entity="Admin"
                formConfigs={formConfigs}
                initialData={admin || {}}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default AdminForm;
