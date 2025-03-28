'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

const pageThemes: Record<string, ThemeColors> = {
  home: {
    primary: 'from-emerald-600 to-blue-600',
    secondary: 'emerald-600',
    accent: 'blue-600',
    background: 'emerald-50',
    text: 'emerald-600'
  },
  news: {
    primary: 'from-indigo-600 to-purple-600',
    secondary: 'indigo-600',
    accent: 'purple-600',
    background: 'indigo-50',
    text: 'indigo-600'
  },
  games: {
    primary: 'from-rose-600 to-orange-500',
    secondary: 'rose-600',
    accent: 'orange-500',
    background: 'rose-50',
    text: 'rose-600'
  },
  courses: {
    primary: 'from-cyan-600 to-teal-600',
    secondary: 'cyan-600',
    accent: 'teal-600',
    background: 'cyan-50',
    text: 'cyan-600'
  },
  trainings: {
    primary: 'from-violet-600 to-fuchsia-600',
    secondary: 'violet-600',
    accent: 'fuchsia-600',
    background: 'violet-50',
    text: 'violet-600'
  }
};

const ThemeContext = createContext<{
  colors: ThemeColors;
  setPageColor: (path: string) => void;
}>({
  colors: pageThemes.home,
  setPageColor: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(pageThemes.home);
  const pathname = usePathname();

  const setPageColor = (path: string) => {
    const segments = path.split('/');
    const page = segments[segments.length - 1] || 'home';
    const theme = pageThemes[page] || pageThemes.home;

    // Only update if the theme is different
    if (JSON.stringify(theme) !== JSON.stringify(colors)) {
      setColors(theme);
      document.documentElement.style.setProperty('--transition-speed', '0.5s');
      document.documentElement.classList.add('color-transition');
      setTimeout(() => {
        document.documentElement.classList.remove('color-transition');
      }, 500);
    }
  };

  useEffect(() => {
    setPageColor(pathname);
  }, [pathname]);

  return (
    <ThemeContext.Provider value={{ colors, setPageColor }}>
      {children}
    </ThemeContext.Provider>
  );
} 