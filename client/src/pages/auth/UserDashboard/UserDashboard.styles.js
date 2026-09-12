import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${(props) => props.$background};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

export const DashboardCard = styled.div`
  background: ${(props) => props.$background};
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  border: ${(props) => (props.$border ? `1px solid ${props.$border}` : 'none')};
  text-align: center;
`;

export const DashboardTitle = styled.h1`
  margin: 0 0 20px 0;
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.$color};
`;

export const LogoutButton = styled.button`
  background: ${(props) => props.$background};
  color: ${(props) => props.$textColor};
  border: ${(props) => (props.$border ? `1px solid ${props.$border}` : 'none')};
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.$hoverBackground};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
