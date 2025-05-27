'use client';
// components/GlobalStyles.tsx
import { useEffect } from 'react';
import { useConfigStore } from '@/store/useConfigStore';

export const GlobalStyles = () => {
  const {
    theme,
    primaryColor,
    backgroundColor,
    textColor,
    fontFamily,
  } = useConfigStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.body.style.fontFamily = fontFamily;
  }, [theme, primaryColor, backgroundColor, textColor, fontFamily]);

  return null;
};
