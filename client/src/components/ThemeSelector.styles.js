import styled from 'styled-components';

export const SelectorContainer = styled.div`
  position: static;
  top: auto;
  right: auto;
  display: inline-block;
`;

export const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.18s;

  border-color: ${(props) => props.$borderColor};
  background-color: ${(props) => props.$backgroundColor};
  color: ${(props) => props.$textColor};

  &:hover {
    opacity: 0.98;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.04);
  }

  option {
    /* keep default colors so the native select shows readable options */
  }
`;
