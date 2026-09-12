import styled from 'styled-components';

export const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  height: 64px;
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  background: ${(p) => p.$background || 'rgba(255,255,255,0.6)'};
  border-bottom: 1px solid ${(p) => p.$border || 'rgba(0,0,0,0.08)'};
  box-shadow: 0 6px 20px rgba(2, 6, 23, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Logo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: ${(p) => p.$logoBackground || 'linear-gradient(135deg,#fff,#eee)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.$logoColor || '#111'};
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(2, 6, 23, 0.12);
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${(p) => p.$color || '#111'};
  letter-spacing: -0.02em;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionItem = styled.button`
  background: ${(p) => (p.$active ? p.$activeBg || `rgba(255,255,255,0.1)` : 'transparent')};
  color: ${(p) => (p.$active ? p.$colorActive || p.$color : p.$color)};
  border: none;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.18s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 40px;

  &:hover {
    transform: translateY(-2px);
    background: ${(p) => p.$hoverBg || (p.$active ? p.$activeBg : 'rgba(255,255,255,0.06)')};
  }
`;
