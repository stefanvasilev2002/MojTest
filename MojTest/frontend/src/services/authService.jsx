import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// Configure axios defaults
axios.defaults.headers.post['Content-Type'] = 'application/json';

const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                return {
                    success: true,
                    data: response.data
                };
            }

            throw new Error('No token received');

        } catch (error) {
            if (error.response) {
                // The server responded with an error status
                return {
                    success: false,
                    error: error.response.data?.message || error.response.data || 'Invalid credentials'
                };
            } else if (error.request) {
                // The request was made but no response was received
                return {
                    success: false,
                    error: 'No response from server'
                };
            } else {
                // Something happened in setting up the request
                return {
                    success: false,
                    error: error.message || 'Error setting up the request'
                };
            }
        }
    },

        register: async (userData) => {
            try {
                const response = await axios.post(`${API_URL}/register`, {
                    username: userData.username,
                    password: userData.password,
                    email: userData.email,
                    fullName: userData.fullName,
                    registrationDate: userData.registrationDate,
                    role: userData.role
                });

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
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
                // Handle specific error cases
                if (error.response) {
                    const errorMessage = error.response.data?.message || error.response.data;

                    // Check for specific error types
                    if (errorMessage.includes('Email already exists')) {
                        return {
                            success: false,
                            error: 'Email is already registered'
                        };
                    }
                    if (errorMessage.includes('Username already exists')) {
                        return {
                            success: false,
                            error: 'Username is already taken'
                        };
                    }

                    return {
                        success: false,
                        error: errorMessage
                    };
                }

                return {
                    success: false,
                    error: 'An error occurred during registration'
                };
            }
        },

    logout: () => {
        // Clear all auth-related data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        // Clear any other user-related data
        localStorage.removeItem('userPreferences');

        // Optional: Clear axios default headers
        delete axios.defaults.headers.common['Authorization'];
    },

    getCurrentUser: () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            // Decode the JWT token to get user info
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing user token:', error);
            return null;
        }
    },

    // Helper method to set up auth header
    setupAuthHeader: () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    },

    // Method to check if token is expired
    isTokenValid: () => {
        const user = authService.getCurrentUser();
        if (!user) return false;

        // Check if token is expired
        return user.exp * 1000 > Date.now();
    }
};

// Set up auth header on service initialization
authService.setupAuthHeader();

export default authService;