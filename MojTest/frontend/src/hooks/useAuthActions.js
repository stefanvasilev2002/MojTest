// src/hooks/useAuthActions.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const useAuthActions = () => {
    const { login, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle login
    const handleLogin = async (username, password, role) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate login - normally you'd send a request to the backend here
            const userData = { username, password };  // Mock data for now
            login(userData, role);  // Save user and role to context and localStorage
            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            setError("Failed to login.");
            return { success: false, error: err };
        }
    };

    // Function to handle registration
    const handleRegister = async (username, password, role) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate registration - normally you'd send a request to the backend here
            const userData = { username, password };  // Mock data for now
            login(userData, role);  // Save user and role to context and localStorage
            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            setError("Failed to register.");
            return { success: false, error: err };
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        logout();
    };

    return {
        handleLogin,
        handleRegister,
        handleLogout,
        loading,
        error,
    };
};

export default useAuthActions;
