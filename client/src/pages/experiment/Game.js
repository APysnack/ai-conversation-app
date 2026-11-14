import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import client from '../../utils/apolloClient';

import {
  GET_MY_GAME_PARTICIPATIONS,
  UPDATE_GAME_PARTICIPATION_MUTATION,
} from '../../utils/graphqlQueries';

import { SurveyContainer, SurveyCard, Instructions, Question } from './PreGameSurvey.styles';

const CONTROL_QUESTIONS = [
  'What is your favorite color?',
  'What was the name of your first pet?',
  'What is something you have always wanted to learn?',
];

function Game() {
  const { theme } = useTheme();

  const [participations, setParticipations] = useState([]);
  const [selectedParticipationId, setSelectedParticipationId] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState('');

  const selectedParticipation = participations.find(
    (participation) => participation.id === selectedParticipationId
  );

  const isCompleted = Boolean(selectedParticipation?.conversationCompletedAt);

  const isAiMediated = selectedParticipation?.gameSession.condition === 'ai_mediated';

  // Retrieve both participants' records from the selected game session.
  const sessionParticipations = selectedParticipation?.gameSession.gameParticipations || [];

  const gameSession = selectedParticipation?.gameSession;

  const userOneParticipation = sessionParticipations.find(
    (participation) => participation.user.id === gameSession?.userOne.id
  );

  const userTwoParticipation = sessionParticipations.find(
    (participation) => participation.user.id === gameSession?.userTwo.id
  );

  const getImages = (participation) => {
    return Array.isArray(participation?.generatedImages) ? participation.generatedImages : [];
  };

  const userOneImages = getImages(userOneParticipation);
  const userTwoImages = getImages(userTwoParticipation);

  // Build the presentation in alternating order:
  // User One Image 1, User Two Image 1,
  // User One Image 2, User Two Image 2, etc.
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
    ? imageSlides.length === 6 && imageSlides.every((slide) => Boolean(slide.image))
    : true;

  const currentSlide = imageSlides[currentImageIndex];

  useEffect(() => {
    const loadParticipations = async () => {
      try {
        setIsLoading(true);
        setError('');

        const { data } = await client.query({
          query: GET_MY_GAME_PARTICIPATIONS,
          fetchPolicy: 'network-only',
        });

        const loadedParticipations = data.myGameParticipations || [];

        setParticipations(loadedParticipations);

        if (loadedParticipations.length > 0) {
          setSelectedParticipationId(loadedParticipations[0].id);
        }
      } catch (error) {
        console.error('Failed to load game sessions:', error);
        setError('Unable to load your game sessions.');
      } finally {
        setIsLoading(false);
      }
    };

    loadParticipations();
  }, []);

  const getPartner = (participation) => {
    const session = participation.gameSession;

    return participation.user.id === session.userOne.id ? session.userTwo : session.userOne;
  };

  const handleSelectSession = (participationId) => {
    setSelectedParticipationId(participationId);
    setCurrentImageIndex(0);
    setError('');
  };

  const handleNextImage = () => {
    if (currentImageIndex < imageSlides.length - 1) {
      setCurrentImageIndex((previous) => previous + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((previous) => previous - 1);
    }
  };

  const handleCompleteConversation = async () => {
    if (!selectedParticipation || isCompleting || isCompleted) {
      return;
    }

    if (!hasDiscussionMaterials) {
      setError('Your discussion materials are not ready yet.');
      return;
    }

    if (isAiMediated && currentImageIndex !== 5) {
      setError('Please go through all six images before completing the conversation.');
      return;
    }

    const confirmed = window.confirm("Are you sure you've finished your conversation?");

    if (!confirmed) return;

    try {
      setIsCompleting(true);
      setError('');

      const { data } = await client.mutate({
        mutation: UPDATE_GAME_PARTICIPATION_MUTATION,
        variables: {
          participationId: selectedParticipation.id,
          conversationCompleted: true,
        },
      });

      const result = data.updateGameParticipation;

      if (!result.success) {
        throw new Error(result.message);
      }

      setParticipations((previous) =>
        previous.map((participation) =>
          participation.id === selectedParticipation.id
            ? {
                ...participation,
                conversationCompletedAt: result.participation.conversationCompletedAt,
              }
            : participation
        )
      );
    } catch (error) {
      console.error('Failed to complete conversation:', error);
      setError(error.message || 'Unable to record conversation completion.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        <h2 style={{ color: theme.colors.text }}>Your Conversations</h2>

        <Instructions $color={theme.colors.text}>
          Select a conversation below to view its discussion materials. When you and your partner
          have finished, select "I'm done."
        </Instructions>

        {isLoading && (
          <Instructions $color={theme.colors.text}>Loading your conversations...</Instructions>
        )}

        {!isLoading && participations.length === 0 && (
          <Instructions $color={theme.colors.text}>
            You don't have any assigned conversations yet.
          </Instructions>
        )}

        {/* SESSION LIST */}

        {!isLoading && participations.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            {participations.map((participation) => {
              const partner = getPartner(participation);
              const isSelected = selectedParticipationId === participation.id;

              const completed = Boolean(participation.conversationCompletedAt);

              const condition = participation.gameSession.condition;

              return (
                <button
                  key={participation.id}
                  type="button"
                  onClick={() => handleSelectSession(participation.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginBottom: '12px',
                    padding: '18px',
                    textAlign: 'left',
                    borderRadius: '10px',
                    border: `2px solid ${
                      isSelected ? theme.colors.primaryButton : theme.colors.cardBorder
                    }`,
                    background: theme.colors.background,
                    color: theme.colors.text,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong>
                      {condition === 'ai_mediated' ? 'Image Conversation' : 'Question Conversation'}
                    </strong>

                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: completed ? '#238636' : theme.colors.text,
                      }}
                    >
                      {completed ? '✓ Completed' : 'Not started'}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '14px',
                      opacity: 0.8,
                    }}
                  >
                    Conversation partner: {partner.email}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* SELECTED SESSION */}

        {selectedParticipation && (
          <div
            style={{
              marginTop: '32px',
              paddingTop: '28px',
              borderTop: `1px solid ${theme.colors.cardBorder}`,
            }}
          >
            <h2 style={{ color: theme.colors.text }}>
              {isAiMediated ? 'Discuss Your Images' : 'Discuss These Questions'}
            </h2>

            <Instructions $color={theme.colors.text}>
              Your conversation partner is{' '}
              <strong>{getPartner(selectedParticipation).email}</strong>.
            </Instructions>

            {isCompleted ? (
              <div
                style={{
                  marginTop: '24px',
                  padding: '20px',
                  borderRadius: '10px',
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.cardBorder}`,
                }}
              >
                <h3 style={{ color: '#238636', marginTop: 0 }}>✓ Conversation completed</h3>

                <Instructions $color={theme.colors.text}>
                  You've recorded that this conversation is finished. You can complete your
                  post-game survey separately when you are no longer with your conversation partner.
                </Instructions>
              </div>
            ) : (
              <>
                {isAiMediated ? (
                  <>
                    <Instructions $color={theme.colors.text}>
                      Take turns looking at each image. Try to guess what it represents, then
                      discuss the stories and experiences behind it. Allow time for discussion
                      before moving on.
                    </Instructions>

                    {hasDiscussionMaterials ? (
                      <div style={{ marginTop: '24px' }}>
                        {/* IMAGE PRESENTATION */}

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '12px',
                            gap: '12px',
                          }}
                        >
                          <strong style={{ color: theme.colors.text }}>
                            {currentSlide.user.email}'s Image {currentSlide.imageNumber}
                          </strong>

                          <span
                            style={{
                              color: theme.colors.text,
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            Image {currentImageIndex + 1} of 6
                          </span>
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

                        {/* PROGRESS INDICATOR */}

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

                        {/* NAVIGATION */}

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
                            style={navigationButtonStyle(theme, currentImageIndex === 0, true)}
                          >
                            Previous
                          </button>

                          <button
                            type="button"
                            onClick={handleNextImage}
                            disabled={currentImageIndex === 5}
                            style={navigationButtonStyle(theme, currentImageIndex === 5)}
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
                          Both participants must complete the preparation step before starting this
                          conversation. We need all six images to display the presentation.
                        </Instructions>

                        <Instructions $color={theme.colors.text}>
                          Participant one images: {userOneImages.filter(Boolean).length}/3
                          <br />
                          Participant two images: {userTwoImages.filter(Boolean).length}/3
                        </Instructions>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Instructions $color={theme.colors.text}>
                      Take turns answering these questions. Feel free to discuss your answers and
                      ask each other follow-up questions.
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

                <div style={{ marginTop: '32px' }}>
                  <button
                    type="button"
                    onClick={handleCompleteConversation}
                    disabled={
                      isCompleting ||
                      !hasDiscussionMaterials ||
                      (isAiMediated && currentImageIndex !== 5)
                    }
                    style={buttonStyle(
                      theme,
                      isCompleting ||
                        !hasDiscussionMaterials ||
                        (isAiMediated && currentImageIndex !== 5)
                    )}
                  >
                    {isCompleting ? 'Saving...' : "I'm done"}
                  </button>

                  {isAiMediated && currentImageIndex !== 5 && (
                    <Instructions $color={theme.colors.text}>
                      View all six images before completing the conversation.
                    </Instructions>
                  )}
                </div>
              </>
            )}
          </div>
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

function buttonStyle(theme, disabled = false) {
  return {
    width: '100%',
    padding: '14px 24px',
    border: 'none',
    borderRadius: '8px',
    background: theme.colors.primaryButton,
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };
}

function navigationButtonStyle(theme, disabled = false, secondary = false) {
  return {
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
  };
}

export default Game;
