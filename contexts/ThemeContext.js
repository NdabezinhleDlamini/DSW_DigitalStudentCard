import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native'; // Import StatusBar
import { Colors } from '@/constants/Colors';

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load the saved theme preference from AsyncStorage when the app loads
    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'dark');
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    const currentColors = isDarkMode ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, currentColors }}>
            <StatusBar
                style={isDarkMode ? "light" : "dark"}
                barStyle={isDarkMode ? "light-content" : "dark-content"}
                translucent={true}
                backgroundColor={currentColors.background}
            />
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeProvider, ThemeContext };
