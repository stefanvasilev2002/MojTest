// src/hooks/useAuthActions.js
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {jwtDecode} from 'jwt-decode'; // {jwtDecode} is the correct way to import this

const useAuthActions = () => {
    const { login, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle login
    const handleLogin = async (username, password, role) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:8081/api/auth/login", {
                username,
                password,
            });

            // Assuming the JWT token is in the response data
            const token = response.data.jwtToken;
            const decodedToken = jwtDecode (token);
            login(decodedToken, decodedToken.roles)
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
            const response = await axios.post("http://localhost:8081/api/auth/register", {
                username,
                password,
                email: `${username}@example.com`, // Example email (update logic as needed)
                fullName: username, // Use username as full name if not provided
                registrationDate: new Date().toISOString().split("T")[0],
                role,
            });
            const  token = response.data.jwtToken;
            const decodedToken = jwtDecode (token);
            login(decodedToken, decodedToken.roles)
            return { success: true, data: response.data };
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
