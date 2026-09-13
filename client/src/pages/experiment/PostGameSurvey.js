import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
  SurveyContainer,
  SurveyCard,
  Question,
  Options,
  Option,
  ScaleLabel,
  Instructions,
} from './PreGameSurvey.styles';

import { useTheme } from '../../context/ThemeContext';
import { updateUserSettings } from '../../store/thunks';

function PostGameSurvey() {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gameId } = useParams();

  const currentUser = useSelector((state) => state.user.user);

  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settings = currentUser?.settings || {};
  const gameData = settings.gameData || [];

  const game = gameData.find((game) => game.gameId === gameId);

  useEffect(() => {
    if (game?.postGameSurvey?.interactionAgain) {
      setAnswer(game.postGameSurvey.interactionAgain);
    }
  }, [game]);

  if (!game) {
    return (
      <SurveyContainer $background={theme.colors.background}>
        <SurveyCard $background={theme.colors.card}>
          <Question $background={theme.colors.primaryButton} $color="white">
            Game Not Found
          </Question>

          <Instructions $color={theme.colors.text}>
            We couldn't find the game associated with this survey.
          </Instructions>

          <button
            type="button"
            onClick={() => navigate('/data')}
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
            Return to My Data
          </button>
        </SurveyCard>
      </SurveyContainer>
    );
  }

  const handleSubmit = async () => {
    if (!answer || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const updatedGameData = gameData.map((currentGame) => {
      if (currentGame.gameId !== gameId) {
        return currentGame;
      }

      return {
        ...currentGame,
        postGameSurvey: {
          interactionAgain: answer,
        },
      };
    });

    const formData = {
      gameData: updatedGameData,
    };

    console.log('Post-game survey submission:', formData);

    const result = await dispatch(updateUserSettings(formData));

    if (updateUserSettings.fulfilled.match(result)) {
      console.log('Post-game survey successfully saved!');

      navigate('/data');
    } else {
      console.error('Failed to save post-game survey:', result.payload);

      setIsSubmitting(false);
    }
  };

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        <Question $background={theme.colors.primaryButton} $color="white">
          How likely would you be to interact with this person again?
        </Question>

        <Instructions $color={theme.colors.text}>Game with {game.partnerEmail}</Instructions>

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
          disabled={!answer || isSubmitting}
          style={{
            marginTop: '30px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            background: theme.colors.primaryButton,
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: !answer || isSubmitting ? 'default' : 'pointer',
            opacity: !answer || isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? 'Saving...' : 'Submit'}
        </button>
      </SurveyCard>
    </SurveyContainer>
  );
}

export default PostGameSurvey;
