import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosConfig'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Initialize state IMMEDIATELY from localStorage
    // This prevents the app from thinking you're logged out on page refresh
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 2. Validate token/user on app mount
        const validateAuth = () => {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (!savedToken || !savedUser) {
                logout(false); // Clean up if data is mismatched
            }
            setLoading(false);
        };

        validateAuth();
    }, []);

    /**
     * TASK 5: Login Function
     * Saves data to storage and updates state
     */
    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setToken(userToken);
        setUser(userData);
    };

    /**
     * Logout Function
     * @param {boolean} shouldRedirect - whether to force a page reload
     */
    const logout = (shouldRedirect = true) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        
        if (shouldRedirect) {
            window.location.href = '/login'; 
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            login, 
            logout, 
            loading,
            // Requirement #3: Toggle Navbar icons based on this
            isLoggedIn: !!token 
        }}>
            {/* 3. Global Loading Guard to prevent protected route glitches */}
            {!loading ? children : (
                <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#f5c27a] border-t-transparent"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
