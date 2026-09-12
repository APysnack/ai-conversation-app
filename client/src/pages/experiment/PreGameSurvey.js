import { useState, useEffect } from 'react';
import {
  SurveyContainer,
  SurveyCard,
  Instructions,
  Question as StyledQuestion,
  Options,
  Option,
  ScaleLabel,
} from './PreGameSurvey.styles';

import { useTheme } from '../../context/ThemeContext';

function PreGameSurvey() {
  const { theme } = useTheme();

  const [answers, setAnswers] = useState({
    comfort: '',
    personalInformation: '',
  });

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  const handleAnswer = (question, value) => {
    setAnswers((previous) => ({
      ...previous,
      [question]: value,
    }));
  };

  return (
    <SurveyContainer $card={theme.colors.card}>
      <SurveyCard>
        <Instructions $color={theme.colors.text}>
          Rank each statement from strongly disagree to strongly agree.
        </Instructions>

        <StyledQuestion $background={theme.colors.primaryButton} $color="white">
          How comfortable are you meeting and talking with someone you’ve never met before?
        </StyledQuestion>

        <Options>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <Option
              key={value}
              type="radio"
              name="comfort"
              value={value}
              checked={answers.comfort === value.toString()}
              onChange={(event) => handleAnswer('comfort', event.target.value)}
            />
          ))}
        </Options>

        <ScaleLabel $color={theme.colors.text}>
          <span>Strongly disagree</span>
          <span>Neutral</span>
          <span>Strongly agree</span>
        </ScaleLabel>

        <StyledQuestion $background={theme.colors.primaryButton} $color="white">
          How comfortable are you meeting and talking with someone you’ve never met before?
        </StyledQuestion>

        <Options>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <Option
              key={value}
              type="radio"
              name="personalInformation"
              value={value}
              checked={answers.personalInformation === value.toString()}
              onChange={(event) => handleAnswer('personalInformation', event.target.value)}
            />
          ))}
        </Options>

        <ScaleLabel $color={theme.colors.text}>
          <span>Strongly disagree</span>
          <span>Neutral</span>
          <span>Strongly agree</span>
        </ScaleLabel>
      </SurveyCard>
    </SurveyContainer>
  );
}

export default PreGameSurvey;
