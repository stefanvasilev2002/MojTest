import axios from 'axios';

// Set up Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Use the environment variable
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add a request interceptor (optional, for auth tokens)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Example: Retrieve token from storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor (optional, for error handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;
