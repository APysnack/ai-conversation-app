import { createContext, useState, useEffect, useContext } from 'react';
import { useSettings } from './SettingsContext';
import {
  discordDarkTheme,
  modernSlateTheme,
  minimalistBlueTheme,
  modernTealTheme,
  purpleTheme,
} from '../themes/themeDefinitions';

export const ThemeContext = createContext();

ThemeContext.displayName = 'ThemeContext';

const themes = {
  'discord-dark': discordDarkTheme,
  'modern-slate': modernSlateTheme,
  'minimalist-blue': minimalistBlueTheme,
  'modern-teal': modernTealTheme,
  'purple-theme': purpleTheme,
};

export const ThemeProvider = ({ children }) => {
  const { settings: userSettings, updateSettings } = useSettings();
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedTheme');
      return saved || null;
    } catch (e) {
      return null;
    }
  });

  const theme = themes[currentTheme] || modernSlateTheme;

  useEffect(() => {
    const themeFromUser = userSettings && userSettings.theme;
    if (themeFromUser && themes[themeFromUser] && themeFromUser !== currentTheme) {
      setCurrentTheme(themeFromUser);
      return;
    }

    if (currentTheme === null) {
      setCurrentTheme((prev) => prev || 'modern-slate');
    }
  }, [userSettings, currentTheme]);

  useEffect(() => {
    if (currentTheme == null) return;
    try {
      localStorage.setItem('selectedTheme', currentTheme);
    } catch (e) {
      // ignore storage errors
    }
  }, [currentTheme]);

  async function switchTheme(themeName) {
    if (!themes[themeName]) return;
    setCurrentTheme(themeName);
    try {
      await updateSettings({ theme: themeName });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist theme setting:', e);
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        theme,
        switchTheme,
        availableThemes: Object.keys(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
