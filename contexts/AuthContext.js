import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [attemptCount, setAttemptCount] = useState(0);
    
    const MAX_ATTEMPTS = 5; // Define it inside the provider

    useEffect(() => {
        const loadAuth = async () => {
            try {
                const storedAuth = await AsyncStorage.getItem('auth');
                if (storedAuth) {
                    setAuth(JSON.parse(storedAuth));
                    console.log("Auth loaded:", JSON.parse(storedAuth));
                } else {
                    console.log("No auth data found.");
                }
                
                // Load attempt count if it exists in AsyncStorage
                const storedAttemptCount = await AsyncStorage.getItem('attemptCount');
                setAttemptCount(parseInt(storedAttemptCount) || 0);
            } catch (error) {
                console.error("Error loading auth or attempt count:", error);
            }
        };
        loadAuth();
    }, []);

    const login = async (authData) => {
        try {
            await AsyncStorage.setItem('auth', JSON.stringify(authData));
            await AsyncStorage.setItem('attemptCount', '0'); // Reset on successful login
            setAuth(authData);
            setAttemptCount(0);
            console.log("Login Auth Data:", authData);
        } catch (error) {
            console.error("Error saving auth data:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('auth');
            setAuth(null);
            console.log("Logged out, auth cleared.");
        } catch (error) {
            console.error("Error clearing auth data:", error);
        }
    };

    const incrementAttemptCount = async () => {
        const newCount = attemptCount + 1;
        setAttemptCount(newCount);
        await AsyncStorage.setItem('attemptCount', newCount.toString());
        return newCount;
    };

    const resetAttemptCount = async () => {
        setAttemptCount(0);
        await AsyncStorage.setItem('attemptCount', '0');
    };
    
    return (
        <AuthContext.Provider value={{ auth, login, logout, attemptCount, incrementAttemptCount, resetAttemptCount, MAX_ATTEMPTS }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
