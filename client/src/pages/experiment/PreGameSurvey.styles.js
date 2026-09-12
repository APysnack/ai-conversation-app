import styled from 'styled-components';

export const SurveyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${(props) => props.$card};
`;

export const SurveyCard = styled.div`
  width: 100%;
  max-width: 70vw;
  padding: 40px;
`;

export const Instructions = styled.p`
  margin-bottom: 40px;
  text-align: center;
  color: ${(props) => props.$color};
`;

export const Question = styled.div`
  margin: 20px;
  background-color: ${(props) => props.$background};
  text-align: center;
  padding: 10px;
  color: ${(props) => props.$color};
  border-radius: 5px;
`;

export const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
`;

export const Option = styled.input`
  justify-self: center;
  cursor: pointer;
`;

export const ScaleLabel = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 40px;
  font-size: 14px;
  color: ${(props) => props.$color};

  span {
    text-align: center;
  }

  span:first-child {
    grid-column: 1;
  }

  span:nth-child(2) {
    grid-column: 4;
  }

  span:last-child {
    grid-column: 7;
  }
`;
