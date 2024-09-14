const tintColorLight = '#005f73'; // A darker teal for a more serious tone
const tintColorDark = '#94d2bd';  // A softer mint for dark mode
const highlightColor = '#ee9b00'; // A vibrant amber for highlights

export const Colors = {
  light: {
    text: '#0b132b',          // Very dark blue for strong readability
    background: '#f1faee',    // Soft off-white for a clean background
    tint: tintColorLight,
    icon: '#3d5a80',          // Muted blue for a modern look
    tabIconDefault: '#3d5a80',
    tabIconSelected: tintColorLight,
    highlight: highlightColor,
    border: '#3d5a80',        // Use for borders to match the muted blue
    shadowColor: '#000',      // Standard black shadow
  },
  dark: {
    text: '#edf6f9',          // Light cyan for readability in dark mode
    background: '#1d3557',    // Deep navy blue for the background
    tint: tintColorDark,
    icon: '#a8dadc',          // Soft cyan for subtlety in dark mode
    tabIconDefault: '#a8dadc',
    tabIconSelected: tintColorDark,
    highlight: highlightColor,
    border: '#a8dadc',        // Use for borders to match soft cyan
    shadowColor: '#000',      // Standard black shadow
  },
};
