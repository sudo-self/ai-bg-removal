'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [isMounted, setIsMounted] = useState(false);

  // Helper to apply theme class on <html>
  const applyThemeClass = (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  useEffect(() => {
    setIsMounted(true);

    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;

    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyThemeClass(initialTheme);
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('theme') || 'light';
      setTheme(newTheme);
      applyThemeClass(newTheme);
    };

    window.addEventListener('themeChange', handleThemeChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        handleThemeChange();
      }
    });

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return;

    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyThemeClass(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyThemeClass(newTheme);
    window.dispatchEvent(new CustomEvent('themeChange'));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
