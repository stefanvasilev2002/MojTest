import React, { createContext, useContext, useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedToken = jwt_decode.jwtDecode(storedToken);
                return {
                    id: decodedToken.userId, // Changed from sub to userId
                    username: decodedToken.sub,
                    token: storedToken
                };
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                return null;
            }
        }
        return null;
    });

    const [role, setRole] = useState(() => {
        return localStorage.getItem('role') || null;
    });
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    const login = (token, userRole) => {
        try {
            const decodedToken = jwt_decode.jwtDecode(token);
            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);
            setUser({
                id: decodedToken.userId, // Changed from sub to userId
                username: decodedToken.sub,
                token: token
            });
            setRole(userRole);
        } catch (error) {
            console.error('Error decoding token:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setRole(null);
    };

    if (!isInitialized) {
        return null;
    }

    return (
        <AuthContext.Provider value={{
            user,
            role,
            login,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};