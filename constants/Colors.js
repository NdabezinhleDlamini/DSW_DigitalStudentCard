const tintColorLight = '#005f73'; // Dark teal for a more serious tone
const tintColorDark = '#94d2bd';  // Soft mint for dark mode
const highlightColor = '#ee9b00'; // Amber for highlights

export const Colors = {
  light: {
    text: '#151515',          
    background: '#efefef',    
    tint: tintColorLight,
    icon: '#3d5a80',          
    tabIconDefault: '#3d5a80',
    tabIconSelected: tintColorLight,
    highlight: highlightColor,
    border: '#3d5a80',        
    shadowColor: '#000',      
    primaryButtonBackground: '#1e90ff',
    primaryButtonText: '#ffffff',
    secondaryButtonBackground: '#a8dadc',
  },
  dark: {
    text: '#dddddd',          
    background: '#202020',    
    tint: tintColorDark,
    icon: '#a8dadc',          
    tabIconDefault: '#a8dadc',
    tabIconSelected: tintColorDark,
    highlight: highlightColor,
    border: '#a8dadc',        
    shadowColor: '#000',      
    primaryButtonBackground: '#1e90ff',
    primaryButtonText: '#ffffff',
    secondaryButtonBackground: '#f1faee',
    dangerButtonBackground: '#e63946',
  },
};
