import React, { createContext, useState, useEffect } from 'react';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const storedAuth = await ReactNativeAsyncStorage.getItem('auth');
                if (storedAuth) {
                    setAuth(JSON.parse(storedAuth));
                    console.log("Auth loaded:", JSON.parse(storedAuth));
                } else {
                    console.log("No auth data found.");
                }
            } catch (error) {
                console.error("Error loading auth:", error);
            }
        };
        loadAuth();
    }, []);

    const login = async (authData) => {
        try {
            await ReactNativeAsyncStorage.setItem('auth', JSON.stringify(authData));
            setAuth(authData);
            console.log("Login Auth Data:", authData);
        } catch (error) {
            console.error("Error saving auth data:", error);
        }
    };

    const logout = async () => {
        try {
            await ReactNativeAsyncStorage.removeItem('auth');
            setAuth(null);
            console.log("Logged out, auth cleared.");
        } catch (error) {
            console.error("Error clearing auth data:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
