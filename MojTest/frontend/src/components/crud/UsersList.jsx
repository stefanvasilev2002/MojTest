import React from "react";
import { useNavigate } from "react-router-dom";
import useUsers from "../../hooks/crud/useUsers";  // Import your custom hook
import Alert from "../Alert.jsx"; // Import the Alert component
import CrudActionTable from "../CrudActionTable.jsx"; // Import the reusable table

const UsersList = () => {
    const { items: usersList, loading, error } = useUsers();  // Fetch users data
    const navigate = useNavigate();

    // Graceful loading UI
    if (loading) {
        return (
            <div>
                <h1>Users List</h1>
                <p>Loading users...</p>
            </div>
        );
    }

    // Handle navigation to the respective user role list page
    const handleRoleNavigation = (role) => {
        navigate(`/crud/users/${role}`);
    };

    return (
        <div className="space-y-6">
            {/* Error handling UI */}
            {error && (
                <div className="mb-4">
                    <Alert message="There was an issue loading the users." type="error" />
                </div>
            )}

            {/* Cards for role-based lists */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div
                    className="bg-blue-500 p-6 rounded-lg text-white text-center cursor-pointer"
                    onClick={() => handleRoleNavigation("Admin")}
                >
                    <h2 className="text-xl">Admins</h2>
                    <p className="text-lg">View all Admin users</p>
                </div>
                <div
                    className="bg-green-500 p-6 rounded-lg text-white text-center cursor-pointer"
                    onClick={() => handleRoleNavigation("Teacher")}
                >
                    <h2 className="text-xl">Teachers</h2>
                    <p className="text-lg">View all Teacher users</p>
                </div>
                <div
                    className="bg-yellow-500 p-6 rounded-lg text-white text-center cursor-pointer"
                    onClick={() => handleRoleNavigation("Student")}
                >
                    <h2 className="text-xl">Students</h2>
                    <p className="text-lg">View all Student users</p>
                </div>
            </div>

            {/* General user list */}
            <h1 className="mt-6 text-2xl">All Users</h1>

            {usersList.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <CrudActionTable
                    headers={["ID", "Username", "Email", "Full Name", "Role"]}
                    rows={usersList.map((user) => [
                        user.id,
                        user.username,
                        user.email,
                        user.fullName,
                        user.role,
                    ])}
                    onEdit={(user) => navigate(`/crud/users/edit/${user.id}`)}
                    // For delete action you might want to integrate the remove logic like in the other lists
                    onDelete={(user) => handleDelete(user.id)}
                />
            )}
        </div>
    );
};

// Optional: Assuming handleDelete function is similar to the others
const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        await remove(id); // Call the remove method from your hook (you might need to adjust it)
    }
};

export default UsersList;
