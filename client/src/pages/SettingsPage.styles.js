import styled from 'styled-components';

export const Container = styled.div`
  min-height: calc(100vh - 64px);
  padding: 40px 20px;
  background: ${(p) => p.$background};
  color: ${(p) => p.$color};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
`;

export const Card = styled.div`
  background: ${(p) => p.$card};
  border: 1px solid ${(p) => p.$border};
  border-radius: 12px;
  padding: 28px;
  max-width: 920px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.12);
`;

export const Heading = styled.h2`
  margin: 0 0 16px 0;
  color: ${(p) => p.$color};
  font-size: 20px;
`;

export const Sub = styled.p`
  margin: 0 0 18px 0;
  color: ${(p) => p.$subColor};
`;
