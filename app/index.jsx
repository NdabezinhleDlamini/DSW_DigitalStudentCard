import Navigation from '../components/navigation';
import SplashScreen from '../screens/SplashScreen';
import { useState, useEffect } from 'react';

export default function App() {
    const [isShowSplash, setIsShowSplash] = useState(true);

    // show splahs screen for a short period
    useEffect(() => {
        setTimeout(() => {
            setIsShowSplash(false);
        }, 3000);
    },);

    return (
        <> 
            {isShowSplash ? <SplashScreen /> : <Navigation />}
        </>
    );
}