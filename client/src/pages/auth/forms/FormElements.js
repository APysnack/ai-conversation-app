import {
  Container as StyledContainer,
  Card as StyledCard,
  Title as StyledTitle,
  Subtitle as StyledSubtitle,
  Form,
  FormGroup,
  Input as StyledInput,
  PrimaryButton as StyledPrimaryButton,
  SecondaryButton as StyledSecondaryButton,
  Divider as StyledDivider,
  Alert as StyledAlert,
} from './FormElements.styles';
import { useTheme } from '../../../context/ThemeContext';

export const Container = (props) => {
  const { theme } = useTheme();
  return <StyledContainer $background={theme.colors.background} {...props} />;
};

export const Card = (props) => {
  const { theme } = useTheme();
  return (
    <StyledCard $background={theme.colors.card} $border={theme.colors.cardBorder} {...props} />
  );
};

export const Title = (props) => {
  const { theme } = useTheme();
  return <StyledTitle $color={theme.colors.text} {...props} />;
};

export const Subtitle = (props) => {
  const { theme } = useTheme();
  return <StyledSubtitle $color={theme.colors.textSecondary} {...props} />;
};

export const Input = (props) => {
  const { theme } = useTheme();
  return (
    <StyledInput
      $borderColor={theme.colors.inputBorder}
      $backgroundColor={theme.colors.input}
      $textColor={theme.colors.text}
      $placeholderColor={theme.colors.textTertiary}
      $focusColor={theme.colors.inputFocus}
      {...props}
    />
  );
};

export const PrimaryButton = (props) => {
  const { theme } = useTheme();
  return (
    <StyledPrimaryButton
      $background={theme.colors.primaryButton}
      $hoverBackground={theme.colors.primaryButtonHover}
      $activeBackground={theme.colors.primaryButtonActive}
      {...props}
    />
  );
};

export const SecondaryButton = (props) => {
  const { theme } = useTheme();
  return (
    <StyledSecondaryButton
      $background={theme.colors.secondaryButton}
      $textColor={theme.colors.secondaryButtonText}
      $borderColor={theme.colors.secondaryButtonBorder}
      $hoverBackground={theme.colors.secondaryButtonHover}
      $activeBackground={theme.colors.secondaryButtonHover}
      {...props}
    />
  );
};

export const Divider = (props) => {
  const { theme } = useTheme();
  return (
    <StyledDivider
      $textColor={theme.colors.dividerText}
      $lineColor={theme.colors.divider}
      {...props}
    />
  );
};

export const Alert = (props) => {
  const { theme } = useTheme();
  return (
    <StyledAlert
      $backgroundColor={theme.colors.alert}
      $textColor={theme.colors.alertText}
      $borderColor={theme.colors.alertBorder}
      {...props}
    />
  );
};

export { Form, FormGroup };
