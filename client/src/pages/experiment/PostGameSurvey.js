import { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  SurveyContainer,
  SurveyCard,
  Question,
  Options,
  Option,
  ScaleLabel,
} from './PreGameSurvey.styles';

import { useTheme } from '../../context/ThemeContext';
import { updateUserSettings } from '../../store/thunks';

function PostGameSurvey() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [answer, setAnswer] = useState('');

  const handleSubmit = async () => {
    const formData = {
      postGameSurvey: {
        interactionAgain: answer,
      },
    };

    console.log('Post-game survey submission:', formData);

    const result = await dispatch(updateUserSettings(formData));

    if (updateUserSettings.fulfilled.match(result)) {
      console.log('Post-game survey successfully saved!');
    } else {
      console.error('Failed to save post-game survey:', result.payload);
    }
  };

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        <Question $background={theme.colors.primaryButton} $color="white">
          How likely would you be to interact with this person again?
        </Question>

        <Options>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <Option
              key={value}
              type="radio"
              name="interactionAgain"
              value={value}
              checked={answer === value.toString()}
              onChange={(event) => setAnswer(event.target.value)}
            />
          ))}
        </Options>

        <ScaleLabel $color={theme.colors.text}>
          <span>Very unlikely</span>
          <span>Neutral</span>
          <span>Very likely</span>
        </ScaleLabel>

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            marginTop: '30px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            background: theme.colors.primaryButton,
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Submit
        </button>
      </SurveyCard>
    </SurveyContainer>
  );
}

export default PostGameSurvey;
