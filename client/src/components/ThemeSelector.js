import { useTheme } from '../context/ThemeContext';
import { SelectorContainer, Select } from './ThemeSelector.styles';

export const ThemeSelector = ({ inline = false }) => {
  const {
    currentTheme,
    switchTheme,
    availableThemes,
    theme: { colors },
  } = useTheme();

  const themeLabels = {
    'discord-dark': 'Discord Dark',
    'modern-slate': 'Modern Slate',
    'minimalist-blue': 'Minimalist Blue',
    'modern-teal': 'Modern Teal',
    'purple-theme': 'Purple Theme',
  };

  return (
    <SelectorContainer $inline={inline}>
      <Select
        value={currentTheme || ''}
        onChange={(e) => switchTheme(e.target.value)}
        $backgroundColor={colors.card}
        $borderColor={colors.cardBorder || colors.inputBorder}
        $textColor={colors.text}
      >
        {availableThemes.map((theme) => (
          <option key={theme} value={theme}>
            {themeLabels[theme]}
          </option>
        ))}
      </Select>
    </SelectorContainer>
  );
};

export default ThemeSelector;
