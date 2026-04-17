import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved ? saved === 'dark' : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      // Dark mode - deep dark background (#0f1115)
      bg: {
        primary: 'bg-[#0f1115]',
        secondary: 'bg-[#1a1d25]',
        tertiary: 'bg-[#252a35]',
        card: 'bg-gradient-to-br from-[#0f1115] to-[#1a1d25]/40',
      },
      border: 'border-[#2a2d35]',
      text: {
        primary: 'text-white',
        secondary: 'text-[#b0b3b8]',
        tertiary: 'text-[#8a8d93]',
      },
      accent: 'text-[#0055ff]',
      accentOrange: 'text-[#ff5500]',
      gradient: 'from-[#0055ff] via-[#00aaff] to-[#ff5500]',
      gradientNeon: 'from-[#0055ff] to-[#ff5500]',
    } : {
      // Light mode
      bg: {
        primary: 'bg-white',
        secondary: 'bg-gray-50',
        tertiary: 'bg-gray-100',
        card: 'bg-white/90 backdrop-blur-sm',
      },
      border: 'border-gray-200',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        tertiary: 'text-gray-500',
      },
      accent: 'text-[#0055ff]',
      accentOrange: 'text-[#ff5500]',
      gradient: 'from-[#0055ff] via-[#00aaff] to-[#ff5500]',
      gradientNeon: 'from-[#0055ff] to-[#ff5500]',
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
