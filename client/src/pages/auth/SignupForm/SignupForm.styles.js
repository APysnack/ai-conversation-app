import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${(props) => props.$background};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

export const Card = styled.div`
  background: ${(props) => props.$background};
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  border: ${(props) => (props.$border ? `1px solid ${props.$border}` : 'none')};

  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.$color};
  text-align: center;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  margin: 0 0 30px 0;
  font-size: 14px;
  color: ${(props) => props.$color};
  text-align: center;
`;

export const Form = styled.form`
  margin-bottom: 24px;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${(props) => props.$borderColor};
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
  background: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$textColor};

  &::placeholder {
    color: ${(props) => props.$placeholderColor};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.$focusColor};
    box-shadow: 0 0 0 3px rgba(88, 101, 242, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  @media (max-width: 480px) {
    padding: 11px 14px;
    font-size: 13px;
  }
`;

export const PrimaryButton = styled(Button)`
  background: ${(props) => props.$background};
  color: white;
  margin-bottom: 16px;

  &:hover {
    background: ${(props) => props.$hoverBackground};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(88, 101, 242, 0.4);
  }

  &:active {
    background: ${(props) => props.$activeBackground};
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${(props) => props.$background};
  color: ${(props) => props.$textColor};
  border: ${(props) => `1px solid ${props.$borderColor}`};

  &:hover {
    background: ${(props) => props.$hoverBackground};
  }

  &:active {
    background: ${(props) => props.$activeBackground};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  font-size: 12px;
  color: ${(props) => props.$textColor};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${(props) => props.$lineColor};
  }

  &::before {
    margin-right: 12px;
  }

  &::after {
    margin-left: 12px;
  }
`;

export const Alert = styled.div`
  padding: 12px 14px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
  background: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$textColor};
  border: 1px solid ${(props) => props.$borderColor};
`;
