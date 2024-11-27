// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use authentication context
export const useAuth = () => {
    return useContext(AuthContext); // Ensure this matches the context export in 'AuthContext'
};

// AuthProvider component that will provide authentication state to the app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (storedUser && storedRole) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        }
    }, []);

    const login = (userData, userRole) => {
        // Store user and role in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userRole);

        setUser(userData);
        setRole(userRole);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
