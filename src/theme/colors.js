// 🎨 KaamBuddy Color Theme Configuration
// Update these colors to match your logo colors

export const colors = {
  // Primary brand color (should match your logo's main color)
  primary: '#fdd017', // Green - Update this to match your logo
  
  // Secondary colors (complementary to your logo)
  secondary: '#f4f5f7', // Light gray background
  accent: '#5a9c00', // Darker shade of primary for hover states
  
  // Text colors
  textPrimary: '#333333', // Dark text
  textSecondary: '#666666', // Medium text
  textLight: '#ffffff', // White text on dark backgrounds
  
  // Background colors
  background: '#f4f5f7', // Main background
  surface: '#ffffff', // Card/input backgrounds
  
  // Border colors
  border: '#e1e5e9', // Light borders
  
  // Status colors
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
  
  // Button colors
  buttonPrimary: '#fdd017', // Primary button background
  buttonPrimaryText: '#ffffff', // Primary button text
  buttonSecondary: '#ffffff', // Secondary button background
  buttonSecondaryText: '#333333', // Secondary button text
  buttonBorder: '#e1e5e9', // Secondary button border
  
  // Link colors
  link: '#fdd017', // Link text color
  
  // Overlay colors
  overlay: 'rgba(253, 208, 23, 0.3)', // Semi-transparent overlay using primary color
};

// Helper function to get color with opacity
export const withOpacity = (color, opacity) => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default colors;
