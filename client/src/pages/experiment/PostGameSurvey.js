import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
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

import {
  GET_MY_GAME_PARTICIPATIONS,
  UPDATE_GAME_PARTICIPATION_MUTATION,
} from '../../utils/graphqlQueries';

function PostGameSurvey() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { gameId } = useParams();

  const [answer, setAnswer] = useState('');
  const [submissionError, setSubmissionError] = useState('');

  const {
    data,
    loading: loadingParticipations,
    error: participationError,
  } = useQuery(GET_MY_GAME_PARTICIPATIONS);

  const [updateGameParticipation, { loading: isSubmitting }] = useMutation(
    UPDATE_GAME_PARTICIPATION_MUTATION
  );

  const participations = data?.myGameParticipations || [];

  const participation = participations.find(
    (item) => String(item.gameSession?.id) === String(gameId)
  );

  const gameSession = participation?.gameSession;

  const currentUserId = participation?.user?.id;

  const partner = [gameSession?.userOne, gameSession?.userTwo].find(
    (user) => String(user?.id) !== String(currentUserId)
  );

  const partnerEmail = partner?.email || 'your conversation partner';

  const savedAnswer = participation?.postGameSurvey?.interactionAgain;

  useEffect(() => {
    setAnswer(savedAnswer ? String(savedAnswer) : '');
  }, [participation?.id, savedAnswer]);

  const handleSubmit = async () => {
    if (!answer || !participation || isSubmitting) {
      return;
    }

    setSubmissionError('');

    try {
      const result = await updateGameParticipation({
        variables: {
          participationId: participation.id,
          postGameSurvey: {
            interactionAgain: Number(answer),
          },
        },
      });

      const response = result.data?.updateGameParticipation;

      if (response?.success) {
        navigate('/data');
      } else {
        setSubmissionError(response?.message || 'Something went wrong while saving your survey.');
      }
    } catch (error) {
      console.error('Failed to save post-game survey:', error);
      setSubmissionError('We could not save your survey. Please try again.');
    }
  };

  const returnButtonStyle = {
    marginTop: '30px',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: theme.colors.primaryButton,
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  if (loadingParticipations) {
    return (
      <SurveyContainer $background={theme.colors.background}>
        <SurveyCard $background={theme.colors.card}>
          <Instructions $color={theme.colors.text}>Loading your survey...</Instructions>
        </SurveyCard>
      </SurveyContainer>
    );
  }

  if (participationError) {
    return (
      <SurveyContainer $background={theme.colors.background}>
        <SurveyCard $background={theme.colors.card}>
          <Question $background={theme.colors.primaryButton} $color="white">
            Unable to Load Survey
          </Question>

          <Instructions $color={theme.colors.text}>
            We couldn't retrieve your game participation. Please try again.
          </Instructions>
        </SurveyCard>
      </SurveyContainer>
    );
  }

  if (!participation) {
    return (
      <SurveyContainer $background={theme.colors.background}>
        <SurveyCard $background={theme.colors.card}>
          <Question $background={theme.colors.primaryButton} $color="white">
            Game Not Found
          </Question>

          <Instructions $color={theme.colors.text}>
            We couldn't find a game session associated with this survey in your account.
          </Instructions>

          <button type="button" onClick={() => navigate('/data')} style={returnButtonStyle}>
            Return to My Data
          </button>
        </SurveyCard>
      </SurveyContainer>
    );
  }

  if (!participation.conversationCompletedAt) {
    return (
      <SurveyContainer $background={theme.colors.background}>
        <SurveyCard $background={theme.colors.card}>
          <Question $background={theme.colors.primaryButton} $color="white">
            Survey Not Available Yet
          </Question>

          <Instructions $color={theme.colors.text}>
            This conversation has not been marked as complete yet. You'll be able to complete your
            survey after the conversation.
          </Instructions>

          <button type="button" onClick={() => navigate('/data')} style={returnButtonStyle}>
            Return to My Data
          </button>
        </SurveyCard>
      </SurveyContainer>
    );
  }

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        <Question $background={theme.colors.primaryButton} $color="white">
          How likely would you be to interact with this person again?
        </Question>

        <Instructions $color={theme.colors.text}>Game with {partnerEmail}</Instructions>

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

        {submissionError && <Instructions $color="red">{submissionError}</Instructions>}

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
