import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOutUser } from '../store/thunks';
import { LogoutButton } from '../pages/auth/UserDashboard/DashboardElements';
import { useTheme } from '../context/ThemeContext';
import { HeaderBar, Brand, Logo, Title, Actions, ActionItem } from './Header.styles';
import { MembersIcon, LogoutIcon, SettingsIcon, AdminIcon, AtomLogo } from './icons';

function Header({ title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const location = useLocation();
  const colors = theme?.colors || {};

  const loading = useSelector((state) => state.user.loading);
  const user = useSelector((state) => state.user.user);

  const actionItems = [
    { label: 'Members', to: '/members', icon: MembersIcon },

    ...(user?.isAdmin ? [{ label: 'Admin', to: '/admin', icon: AdminIcon }] : []),

    { label: 'Settings', to: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    await dispatch(signOutUser());
    navigate('/', { replace: true });
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <HeaderBar $background={colors.card} $border={colors.divider}>
      <Brand onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <Logo $logoBackground={colors.primaryButton} $logoColor={colors.text}>
          <AtomLogo size={36} color={colors.text} />
        </Logo>
        <Title $color={colors.text}>{title || 'Ethos'}</Title>
      </Brand>

      <Actions>
        {actionItems.map((item) => {
          const isActive =
            location.pathname === item.to || location.pathname.startsWith(item.to + '/');

          return (
            <ActionItem
              key={item.to}
              onClick={() => navigate(item.to)}
              $active={isActive}
              $color={colors.textSecondary}
              $colorActive={colors.text}
              $activeBg={colors.primaryButtonHover || colors.primaryButton}
              $hoverBg={colors.primaryButtonHover || colors.primaryButton}
              title={item.label}
            >
              <item.icon color={isActive ? colors.text : colors.textSecondary} />
            </ActionItem>
          );
        })}

        <LogoutButton onClick={handleLogout} disabled={loading} title="Log out">
          <LogoutIcon color="white" />
        </LogoutButton>
      </Actions>
    </HeaderBar>
  );
}

export default Header;
