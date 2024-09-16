import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext'; // Update the path based on where you placed your context

import Navigation from '../components/navigation';
import SplashScreen from '../screens/SplashScreen';

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  // Show splash screen for a short period
  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);

    return () => clearTimeout(splashTimeout); // Cleanup timeout on unmount
  }, []);

  return (
    <ThemeProvider>
      {isShowSplash ? <SplashScreen /> : <Navigation />}
    </ThemeProvider>
  );
}