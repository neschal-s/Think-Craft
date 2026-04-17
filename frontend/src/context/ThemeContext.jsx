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
      // Dark mode
      bg: {
        primary: 'bg-slate-900',
        secondary: 'bg-slate-800',
        tertiary: 'bg-slate-700',
        card: 'bg-gradient-to-br from-slate-800 to-slate-900',
      },
      border: 'border-slate-700',
      text: {
        primary: 'text-white',
        secondary: 'text-slate-300',
        tertiary: 'text-slate-400',
      },
      accent: 'text-cyan-400',
      gradient: 'from-cyan-400 via-blue-400 to-purple-400',
    } : {
      // Light mode
      bg: {
        primary: 'bg-white/70',
        secondary: 'bg-white/50',
        tertiary: 'bg-white/40',
        card: 'bg-white/80 backdrop-blur-sm',
      },
      border: 'border-gray-300',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-700',
        tertiary: 'text-gray-600',
      },
      accent: 'text-blue-600',
      gradient: 'from-blue-600 via-blue-500 to-purple-600',
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
