import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/auth';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

const authService = {
    login: async (username, password) => {
        try {
            const response = await axiosInstance.post('/login', {
                username,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('fullName', response.data.fullName);

                // Set up auth header for future requests
                authService.setupAuthHeader();

                return {
                    success: true,
                    data: response.data
                };
            }

            throw new Error('No token received');

        } catch (error) {
            return authService.handleError(error, 'Login failed');
        }
    },

    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/register', {
                username: userData.username,
                password: userData.password,
                email: userData.email,
                fullName: userData.fullName,
                registrationDate: userData.registrationDate,
                grade: userData.grade,
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('fullName', response.data.fullName);

                // Set up auth header for future requests
                authService.setupAuthHeader();

                return {
                    success: true,
                    data: response.data
                };
            }

            return {
                success: false,
                error: 'Registration failed: No token received'
            };
        } catch (error) {
            return authService.handleError(error, 'Registration failed');
        }
    },

    logout: () => {
        // Clear all auth-related data
        const keysToRemove = ['token', 'user', 'role', 'fullName', 'userPreferences'];
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Clear auth header
        delete axiosInstance.defaults.headers.common['Authorization'];
    },

    getCurrentUser: () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            // Parse JWT payload
            const payload = authService.parseJwt(token);

            // Add additional user info from localStorage
            return {
                ...payload,
                role: localStorage.getItem('role'),
                fullName: localStorage.getItem('fullName')
            };
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    setupAuthHeader: () => {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    },

    isTokenValid: () => {
        const user = authService.getCurrentUser();
        if (!user) return false;

        // Add 5 minute buffer for token expiration
        const bufferedExpiry = (user.exp * 1000) - (5 * 60 * 1000);
        return bufferedExpiry > Date.now();
    },

    // Helper methods
    parseJwt: (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    },

    handleError: (error, defaultMessage = 'An error occurred') => {
        if (error.response) {
            // Server responded with error
            const errorMessage = error.response.data?.message || error.response.data;

            // Handle specific error cases
            if (errorMessage.includes('already exists')) {
                return {
                    success: false,
                    error: errorMessage
                };
            }

            return {
                success: false,
                error: errorMessage || defaultMessage
            };
        }

        if (error.request) {
            // Request made but no response
            return {
                success: false,
                error: 'No response from server. Please check your connection.'
            };
        }

        // Something else went wrong
        return {
            success: false,
            error: error.message || defaultMessage
        };
    }
};

// Initialize auth header
authService.setupAuthHeader();

export default authService;