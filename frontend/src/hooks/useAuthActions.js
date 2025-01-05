import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

const useAuthActions = () => {
    const { login: contextLogin, logout: contextLogout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (username, password) => {
        try {
            setLoading(true);
            const response = await authService.login(username, password);

            if (response.success) {
                setError(null);
                console.log(response.data)
                console.log(response.data.roles)
                contextLogin(response.data.token, response.data.role);
                return {
                    success: true,
                    data: response.data
                };
            } else {
                setError(response.error);
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message
                || err.response?.data
                || err.message
                || 'Invalid username or password';

            setError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (registerData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.register(registerData);

            if (response.success) {
                contextLogin(response.data.token, response.data.role);
                return {
                    success: true,
                    data: response.data
                };
            } else {
                setError(response.error);
                return {
                    success: false,
                    error: response.error
                };
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                'Registration failed';

            setError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const handleLogout = () => {
        setError(null);
        authService.logout();
        contextLogout();
    };

    return {
        handleLogin,
        handleRegister,
        handleLogout,
        clearError,
        loading,
        error,
    };
};

export default useAuthActions;