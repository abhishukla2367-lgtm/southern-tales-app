import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosConfig'; 

// 1. Create the Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // PERSISTENCE: Re-authenticate user on page refresh (Task 2)
    useEffect(() => {
        const initializeAuth = () => {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');

            if (savedUser && savedToken) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setToken(savedToken);
                    
                    // Requirement #2: Attach token to all outgoing requests
                    API.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
                } catch (error) {
                    console.error("Auth Initialization Error:", error);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    /**
     * TASK 5: Login Function
     * Handles User Data and Token storage
     */
    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        API.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        setToken(userToken);
        setUser(userData);
    };

    /**
     * Logout Function
     */
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete API.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
        window.location.href = '/login'; 
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            loading,
            // Requirement #3: Helper for Header toggle logic
            isLoggedIn: !!user 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

/**
 * CUSTOM HOOK (Fixes the CartDrawer.jsx error)
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
