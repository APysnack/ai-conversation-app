import {
  DashboardContainer as StyledDashboardContainer,
  DashboardCard as StyledDashboardCard,
  DashboardTitle as StyledDashboardTitle,
  LogoutButton as StyledLogoutButton,
} from './UserDashboard.styles';
import { useTheme } from '../../../context/ThemeContext';

export const DashboardContainer = (props) => {
  const { theme } = useTheme();
  return <StyledDashboardContainer $background={theme.colors.background} {...props} />;
};

export const DashboardCard = (props) => {
  const { theme } = useTheme();
  return (
    <StyledDashboardCard
      $background={theme.colors.card}
      $border={theme.colors.cardBorder}
      {...props}
    />
  );
};

export const DashboardTitle = (props) => {
  const { theme } = useTheme();
  return <StyledDashboardTitle $color={theme.colors.text} {...props} />;
};

export const LogoutButton = (props) => {
  const { theme } = useTheme();
  return (
    <StyledLogoutButton
      $background={theme.colors.primaryButton}
      $textColor="white"
      $hoverBackground={theme.colors.primaryButtonHover}
      {...props}
    />
  );
};
