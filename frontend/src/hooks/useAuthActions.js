import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import * as jwt_decode from 'jwt-decode';

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

    const handleUpdate = async (updatedData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.update(updatedData);

            if (response.success) {
                const decodedToken = jwt_decode.jwtDecode(response.data);

                console.log("RESPONSE: "+decodedToken);
                const role = decodedToken.roles[0].replace("ROLE_", "").toLowerCase();
                contextLogin(response.data, role);
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
                'Updating profile failed';

            setError(errorMessage);
            return {
                success: false,
                error: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.changePassword(formData);

            if (response.success) {
                const decodedToken = jwt_decode.jwtDecode(response.data);

                console.log("RESPONSE: "+decodedToken);
                const role = decodedToken.roles[0].replace("ROLE_", "").toLowerCase();
                contextLogin(response.data, role);
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
                'Updating profile failed';

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
        handleUpdate,
        handlePasswordChange,
        clearError,
        loading,
        error,
    };
};

export default useAuthActions;