import React from "react";
import { useNavigate } from "react-router-dom";
import useAdmin from "../../hooks/crud/useAdmin.js"; // Import the custom hook for admins
import Alert from "../Alert.jsx"; // Import the Alert component
import CrudActionTable from "../CrudActionTable.jsx"; // Import the reusable table

const AdminList = () => {
    const { items: adminsList, loading, error, remove } = useAdmin(); // Fetch admins data and remove method
    const navigate = useNavigate();

    // Handle delete action
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            await remove(id); // Call the remove method from the hook
        }
    };

    if (loading) {
        return (
            <div>
                <h1>Admins</h1>
                <p>Loading admins...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the admins." type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">Admins</h1>
            <button
                onClick={() => navigate("/crud/users/admin/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add Admin
            </button>
            {adminsList.length === 0 ? (
                <p>No admins found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Username", "Email", "Full Name"]}
                    rows={adminsList.map((admin) => [
                        admin.id,
                        admin.username,
                        admin.email,
                        admin.fullName,
                    ])}
                    onEdit={(id) => navigate(`/crud/users/admin/edit/${id}`)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    );
};

export default AdminList;
