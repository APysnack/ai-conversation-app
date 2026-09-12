import { useTheme } from '../context/ThemeContext';
import ThemeSelector from '../components/ThemeSelector';
import { Container, Card, Heading, Sub } from './SettingsPage.styles';

export default function SettingsPage() {
  const { theme } = useTheme();
  const colors = theme?.colors || {};

  return (
    <Container $background={colors.background} $color={colors.text}>
      <Card $card={colors.card} $border={colors.divider}>
        <Heading $color={colors.text}>Settings</Heading>
        <Sub $subColor={colors.textSecondary}>Adjust your preferences and theme settings.</Sub>
        <section>
          <h3 style={{ marginTop: 0, color: colors.text }}>Theme</h3>
          <p style={{ color: colors.textSecondary }}>
            Change your app theme from the header selector.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <div style={{ minWidth: 120, fontWeight: 600, color: colors.text }}>Appearance</div>
            <ThemeSelector />
          </div>
        </section>
      </Card>
    </Container>
  );
}
