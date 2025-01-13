import React, { createContext, useContext, useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode';
import {endpoints} from "../config/api.config.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedToken = jwt_decode.jwtDecode(storedToken);
                const userInfo = {
                    id: decodedToken.userId,
                    username: decodedToken.sub,
                    token: storedToken,
                    fullName: decodedToken.fullName,
                };

                fetch(endpoints.users.getById(decodedToken.userId), {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        const updatedUser = {
                            ...userInfo,
                            username: data.username,
                            grade: data.grade,
                            email: data.email,
                            fullName: data.fullName || decodedToken.fullName,
                        };
                        setUser(updatedUser);
                    })
                    .catch(error => {
                        console.error('Error fetching user details:', error);
                    });

                return userInfo;
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

    const login = async (token, userRole) => {
        try {
            const decodedToken = jwt_decode.jwtDecode(token);
            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);

            const response = await fetch(endpoints.users.getById(decodedToken.userId), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const userData = await response.json();

            setUser({
                id: decodedToken.userId,
                username: decodedToken.sub,
                token: token,
                grade: userData.grade,
                email: userData.email,
                fullName: userData.fullName || decodedToken.fullName
            });

            setRole(userRole);
        } catch (error) {
            console.error('Error during login:', error);
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