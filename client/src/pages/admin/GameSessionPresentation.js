import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';
import client from '../../utils/apolloClient';

import { GET_GAME_SESSION_FOR_PRESENTATION } from '../../utils/graphqlQueries';

import {
  SurveyContainer,
  SurveyCard,
  Instructions,
  Question,
} from '../experiment/PreGameSurvey.styles';

const CONTROL_QUESTIONS = [
  'What is your favorite color?',
  'What was the name of your first pet?',
  'What is something you have always wanted to learn?',
];

const COMPLETE_GAME_SESSION_MUTATION = gql`
  mutation CompleteGameSession($id: ID!) {
    completeGameSession(id: $id) {
      success
      message
      gameSession {
        id
        status
      }
    }
  }
`;

function GameSessionPresentation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [gameSession, setGameSession] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadGameSession = async () => {
      try {
        setIsLoading(true);
        setError('');

        const { data } = await client.query({
          query: GET_GAME_SESSION_FOR_PRESENTATION,
          variables: { id },
          fetchPolicy: 'network-only',
        });

        if (isMounted) {
          setGameSession(data.gameSessionForPresentation);
          setCurrentImageIndex(0);
        }
      } catch (error) {
        console.error('Failed to load game session:', error);

        if (isMounted) {
          setError(error.message || 'Unable to load this game session.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadGameSession();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const isAiMediated = gameSession?.condition === 'ai_mediated';
  const isCompleted = gameSession?.status === 'completed';

  const participations = gameSession?.gameParticipations || [];

  const userOneParticipation = participations.find(
    (participation) => participation.user.id === gameSession?.userOne.id
  );

  const userTwoParticipation = participations.find(
    (participation) => participation.user.id === gameSession?.userTwo.id
  );

  const getImages = (participation) => {
    return Array.isArray(participation?.generatedImages) ? participation.generatedImages : [];
  };

  const userOneImages = getImages(userOneParticipation);
  const userTwoImages = getImages(userTwoParticipation);

  // Alternate between participants' images.
  const imageSlides = [];

  for (let index = 0; index < 3; index += 1) {
    imageSlides.push({
      image: userOneImages[index],
      user: gameSession?.userOne,
      imageNumber: index + 1,
    });

    imageSlides.push({
      image: userTwoImages[index],
      user: gameSession?.userTwo,
      imageNumber: index + 1,
    });
  }

  const hasDiscussionMaterials = isAiMediated
    ? imageSlides.every((slide) => Boolean(slide.image))
    : true;

  const currentSlide = imageSlides[currentImageIndex];

  const handlePreviousImage = () => {
    setCurrentImageIndex((previous) => Math.max(0, previous - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((previous) => Math.min(5, previous + 1));
  };

  const handleCompleteSession = async () => {
    if (!gameSession || isCompleting || isCompleted) {
      return;
    }

    if (!hasDiscussionMaterials) {
      setError('The discussion materials are not ready yet.');
      return;
    }

    if (isAiMediated && currentImageIndex !== 5) {
      setError('Please go through all six images before completing this session.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to mark this entire game session as completed?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsCompleting(true);
      setError('');

      const { data } = await client.mutate({
        mutation: COMPLETE_GAME_SESSION_MUTATION,
        variables: { id },
      });

      const result = data.completeGameSession;

      if (!result.success) {
        throw new Error(result.message);
      }

      setGameSession((previous) => ({
        ...previous,
        status: result.gameSession.status,
      }));
    } catch (error) {
      console.error('Failed to complete game session:', error);
      setError(error.message || 'Unable to complete this game session.');
    } finally {
      setIsCompleting(false);
    }
  };

  const navigationButtonStyle = (disabled, secondary = false) => ({
    flex: 1,
    padding: '12px 20px',
    border: secondary ? `1px solid ${theme.colors.cardBorder}` : 'none',
    borderRadius: '8px',
    background: secondary ? theme.colors.background : theme.colors.primaryButton,
    color: secondary ? theme.colors.text : 'white',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.5 : 1,
  });

  const completeButtonStyle = {
    width: '100%',
    padding: '14px 24px',
    border: 'none',
    borderRadius: '8px',
    background: theme.colors.primaryButton,
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: isCompleting || isCompleted ? 'default' : 'pointer',
    opacity: isCompleting || isCompleted ? 0.6 : 1,
  };

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          style={{
            padding: '10px 16px',
            marginBottom: '20px',
            border: `1px solid ${theme.colors.cardBorder}`,
            borderRadius: '8px',
            background: theme.colors.background,
            color: theme.colors.text,
            cursor: 'pointer',
          }}
        >
          ← Back to Admin Panel
        </button>

        <h2 style={{ color: theme.colors.text }}>Game Session #{id}</h2>

        {isLoading && (
          <Instructions $color={theme.colors.text}>Loading game session...</Instructions>
        )}

        {!isLoading && !gameSession && !error && (
          <Instructions $color={theme.colors.text}>Game session not found.</Instructions>
        )}

        {!isLoading && gameSession && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '20px',
                padding: '16px',
                borderRadius: '10px',
                background: theme.colors.background,
                border: `1px solid ${theme.colors.cardBorder}`,
                color: theme.colors.text,
              }}
            >
              <div>
                <strong>Participant 1</strong>
                <div>{gameSession.userOne.email}</div>
              </div>

              <div>
                <strong>Participant 2</strong>
                <div>{gameSession.userTwo.email}</div>
              </div>

              <div>
                <strong>Condition</strong>
                <div>{isAiMediated ? 'AI-mediated' : 'Control'}</div>
              </div>

              <div>
                <strong>Status</strong>
                <div>{gameSession.status}</div>
              </div>
            </div>

            <div
              style={{
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: `1px solid ${theme.colors.cardBorder}`,
              }}
            >
              <h2 style={{ color: theme.colors.text }}>
                {isAiMediated ? 'Image Presentation' : 'Control Questions'}
              </h2>

              {isCompleted ? (
                <div
                  style={{
                    padding: '20px',
                    borderRadius: '10px',
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.cardBorder}`,
                    color: theme.colors.text,
                  }}
                >
                  <h3 style={{ color: '#238636', marginTop: 0 }}>✓ Session completed</h3>
                  This game session has already been marked as completed.
                </div>
              ) : isAiMediated ? (
                <>
                  <Instructions $color={theme.colors.text}>
                    Present each image to both participants in order. Allow them time to discuss
                    each image before moving to the next one.
                  </Instructions>

                  {hasDiscussionMaterials ? (
                    <div style={{ marginTop: '24px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '12px',
                          color: theme.colors.text,
                        }}
                      >
                        <strong>
                          {currentSlide.user.email}'s Image {currentSlide.imageNumber}
                        </strong>

                        <strong>Image {currentImageIndex + 1} of 6</strong>
                      </div>

                      <div
                        style={{
                          width: '100%',
                          padding: '12px',
                          boxSizing: 'border-box',
                          borderRadius: '10px',
                          background: theme.colors.background,
                          border: `1px solid ${theme.colors.cardBorder}`,
                        }}
                      >
                        <img
                          src={currentSlide.image}
                          alt={`${currentSlide.user.email}'s image ${currentSlide.imageNumber}`}
                          style={{
                            display: 'block',
                            width: '100%',
                            maxHeight: '600px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          marginTop: '16px',
                        }}
                      >
                        {imageSlides.map((slide, index) => (
                          <div
                            key={index}
                            style={{
                              flex: 1,
                              height: '6px',
                              borderRadius: '4px',
                              background:
                                index <= currentImageIndex
                                  ? theme.colors.primaryButton
                                  : theme.colors.cardBorder,
                            }}
                          />
                        ))}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                          marginTop: '20px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={handlePreviousImage}
                          disabled={currentImageIndex === 0}
                          style={navigationButtonStyle(currentImageIndex === 0, true)}
                        >
                          Previous
                        </button>

                        <button
                          type="button"
                          onClick={handleNextImage}
                          disabled={currentImageIndex === 5}
                          style={navigationButtonStyle(currentImageIndex === 5)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: '20px',
                        padding: '20px',
                        borderRadius: '10px',
                        background: theme.colors.background,
                        color: theme.colors.text,
                      }}
                    >
                      <strong>The discussion images aren't ready yet.</strong>

                      <Instructions $color={theme.colors.text}>
                        Both participants need three generated images before the presentation can
                        begin.
                      </Instructions>

                      <Instructions $color={theme.colors.text}>
                        {gameSession.userOne.email}: {userOneImages.filter(Boolean).length}/3
                        <br />
                        {gameSession.userTwo.email}: {userTwoImages.filter(Boolean).length}/3
                      </Instructions>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Instructions $color={theme.colors.text}>
                    Present these questions to the participants. Allow them time to take turns
                    answering and discussing their responses.
                  </Instructions>

                  <div style={{ marginTop: '24px' }}>
                    {CONTROL_QUESTIONS.map((question, index) => (
                      <div key={index} style={{ marginBottom: '20px' }}>
                        <Question $background={theme.colors.primaryButton} $color="white">
                          {question}
                        </Question>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!isCompleted && (
                <div style={{ marginTop: '32px' }}>
                  <button
                    type="button"
                    onClick={handleCompleteSession}
                    disabled={
                      isCompleting ||
                      !hasDiscussionMaterials ||
                      (isAiMediated && currentImageIndex !== 5)
                    }
                    style={{
                      ...completeButtonStyle,
                      opacity:
                        isCompleting ||
                        !hasDiscussionMaterials ||
                        (isAiMediated && currentImageIndex !== 5)
                          ? 0.6
                          : 1,
                      cursor:
                        isCompleting ||
                        !hasDiscussionMaterials ||
                        (isAiMediated && currentImageIndex !== 5)
                          ? 'default'
                          : 'pointer',
                    }}
                  >
                    {isCompleting ? 'Completing Session...' : 'Complete Session'}
                  </button>

                  {isAiMediated && currentImageIndex !== 5 && (
                    <Instructions $color={theme.colors.text}>
                      Go through all six images before completing this session.
                    </Instructions>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {error && (
          <p role="alert" style={{ color: 'red', marginTop: '20px' }}>
            {error}
          </p>
        )}
      </SurveyCard>
    </SurveyContainer>
  );
}

export default GameSessionPresentation;
