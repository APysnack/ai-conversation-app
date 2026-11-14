import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import client from '../../utils/apolloClient';

import { testGemini, generateImages } from '../../store/thunks/userThunks';

import {
  GET_MY_GAME_PARTICIPATIONS,
  UPDATE_GAME_PARTICIPATION_MUTATION,
} from '../../utils/graphqlQueries';

import { SurveyContainer, SurveyCard, Instructions, Question } from './PreGameSurvey.styles';

function Preparation() {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const [participations, setParticipations] = useState([]);
  const [selectedParticipationId, setSelectedParticipationId] = useState('');

  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const [error, setError] = useState('');

  const selectedParticipation = participations.find(
    (participation) => participation.id === selectedParticipationId
  );

  const preparationData = selectedParticipation?.preparationData || {};

  const questions = Array.isArray(preparationData.questions) ? preparationData.questions : [];

  const generatedImages = Array.isArray(selectedParticipation?.generatedImages)
    ? selectedParticipation.generatedImages
    : [];

  const hasQuestions = questions.length === 3;

  const hasImages = generatedImages.length === 3 && generatedImages.every(Boolean);

  const getPartner = (participation) => {
    const session = participation.gameSession;

    return participation.user.id === session.userOne.id ? session.userTwo : session.userOne;
  };

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

      const firstAiParticipation = loadedParticipations.find(
        (participation) => participation.gameSession.condition === 'ai_mediated'
      );

      if (firstAiParticipation) {
        setSelectedParticipationId(firstAiParticipation.id);

        const savedInteractions = firstAiParticipation.preparationData?.interactions || [];

        const savedAnswers = {};

        savedInteractions.forEach((interaction, index) => {
          savedAnswers[index] = interaction.response || '';
        });

        setAnswers(savedAnswers);
      }
    } catch (error) {
      console.error('Failed to load preparation sessions:', error);
      setError('Unable to load your preparation sessions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipations();
  }, []);

  const handleSelectSession = (participation) => {
    setSelectedParticipationId(participation.id);
    setError('');

    const savedInteractions = participation.preparationData?.interactions || [];

    const savedAnswers = {};

    savedInteractions.forEach((interaction, index) => {
      savedAnswers[index] = interaction.response || '';
    });

    setAnswers(savedAnswers);
  };

  const handleGenerateQuestions = async () => {
    if (!selectedParticipation || isGeneratingQuestions) {
      return;
    }

    try {
      setIsGeneratingQuestions(true);
      setError('');

      const generatedQuestions = await dispatch(
        testGemini({
          participationId: selectedParticipation.id,
        })
      ).unwrap();

      setParticipations((previous) =>
        previous.map((participation) =>
          participation.id === selectedParticipation.id
            ? {
                ...participation,
                preparationData: {
                  ...(participation.preparationData || {}),
                  questions: generatedQuestions,
                },
              }
            : participation
        )
      );

      setAnswers({});
    } catch (error) {
      console.error('Failed to generate questions:', error);
      setError(typeof error === 'string' ? error : 'Unable to generate discussion questions.');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((previous) => ({
      ...previous,
      [index]: value,
    }));
  };

  const handleGenerateImages = async () => {
    if (!selectedParticipation || isGeneratingImages || hasImages) {
      return;
    }

    if (!hasQuestions) {
      setError('Generate your discussion questions first.');
      return;
    }

    const unansweredQuestions = questions.some((_, index) => !answers[index]?.trim());

    if (unansweredQuestions) {
      setError('Please answer all three questions before generating images.');
      return;
    }

    const interactions = questions.map((question, index) => ({
      question: typeof question === 'string' ? question : question.question,
      response: answers[index].trim(),
    }));

    try {
      setIsGeneratingImages(true);
      setError('');

      // Save the participant's answers before generating images.
      const updatedPreparationData = {
        ...preparationData,
        interactions,
      };

      const { data } = await client.mutate({
        mutation: UPDATE_GAME_PARTICIPATION_MUTATION,
        variables: {
          participationId: selectedParticipation.id,
          preparationData: updatedPreparationData,
        },
      });

      const saveResult = data.updateGameParticipation;

      if (!saveResult.success) {
        throw new Error(saveResult.message);
      }

      // Generate and persist this participant's three images.
      const partner = getPartner(selectedParticipation);

      const images = await dispatch(
        generateImages({
          gameId: selectedParticipation.gameSession.id,
          partnerUserId: partner.id,
          interactions,
        })
      ).unwrap();

      setParticipations((previous) =>
        previous.map((participation) =>
          participation.id === selectedParticipation.id
            ? {
                ...participation,
                preparationData: updatedPreparationData,
                generatedImages: images,
              }
            : participation
        )
      );
    } catch (error) {
      console.error('Failed to generate images:', error);

      setError(typeof error === 'string' ? error : error.message || 'Unable to generate images.');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const aiParticipations = participations.filter(
    (participation) => participation.gameSession.condition === 'ai_mediated'
  );

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        <h2 style={{ color: theme.colors.text }}>Conversation Preparation</h2>

        <Instructions $color={theme.colors.text}>
          Prepare for your AI-mediated conversation by generating personalized questions, answering
          them, and creating your discussion images.
        </Instructions>

        {isLoading && (
          <Instructions $color={theme.colors.text}>
            Loading your preparation sessions...
          </Instructions>
        )}

        {!isLoading && aiParticipations.length === 0 && (
          <Instructions $color={theme.colors.text}>
            You don't have any AI-mediated conversations assigned to you.
          </Instructions>
        )}

        {/* SESSION LIST */}

        {!isLoading && aiParticipations.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            {aiParticipations.map((participation) => {
              const partner = getPartner(participation);
              const isSelected = selectedParticipationId === participation.id;

              const images = Array.isArray(participation.generatedImages)
                ? participation.generatedImages
                : [];

              const prepared = images.length === 3 && images.every(Boolean);

              return (
                <button
                  key={participation.id}
                  type="button"
                  onClick={() => handleSelectSession(participation)}
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
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <strong>Image Conversation</strong>

                    <strong
                      style={{
                        color: prepared ? '#238636' : theme.colors.text,
                        fontSize: '13px',
                      }}
                    >
                      {prepared ? '✓ Prepared' : 'Preparation needed'}
                    </strong>
                  </div>

                  <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
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
            <h2 style={{ color: theme.colors.text }}>Prepare Your Images</h2>

            <Instructions $color={theme.colors.text}>
              Your conversation partner is{' '}
              <strong>{getPartner(selectedParticipation).email}</strong>.
            </Instructions>

            {/* STEP 1: QUESTIONS */}

            <div style={{ marginTop: '28px' }}>
              <h3 style={{ color: theme.colors.text }}>Step 1: Discussion Questions</h3>

              {hasQuestions ? (
                <Instructions $color={theme.colors.text}>
                  Your personalized questions have been generated.
                </Instructions>
              ) : (
                <>
                  <Instructions $color={theme.colors.text}>
                    Generate three personalized questions based on your pre-game surveys.
                  </Instructions>

                  <button
                    type="button"
                    onClick={handleGenerateQuestions}
                    disabled={isGeneratingQuestions}
                    style={buttonStyle(theme, isGeneratingQuestions)}
                  >
                    {isGeneratingQuestions ? 'Generating questions...' : 'Generate Questions'}
                  </button>
                </>
              )}
            </div>

            {/* STEP 2: ANSWERS */}

            {hasQuestions && !hasImages && (
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ color: theme.colors.text }}>Step 2: Answer Your Questions</h3>

                <Instructions $color={theme.colors.text}>
                  Answer each question with enough detail to give the image generator something
                  meaningful to work with.
                </Instructions>

                {questions.map((question, index) => {
                  const questionText = typeof question === 'string' ? question : question.question;

                  return (
                    <div key={index} style={{ marginTop: '24px' }}>
                      <Question $background={theme.colors.primaryButton} $color="white">
                        {questionText}
                      </Question>

                      <textarea
                        value={answers[index] || ''}
                        onChange={(event) => handleAnswerChange(index, event.target.value)}
                        placeholder="Write your answer here..."
                        rows={4}
                        style={{
                          display: 'block',
                          width: '100%',
                          boxSizing: 'border-box',
                          marginTop: '12px',
                          padding: '14px',
                          borderRadius: '8px',
                          border: `1px solid ${theme.colors.cardBorder}`,
                          background: theme.colors.background,
                          color: theme.colors.text,
                          fontSize: '15px',
                          resize: 'vertical',
                        }}
                      />
                    </div>
                  );
                })}

                <div style={{ marginTop: '28px' }}>
                  <h3 style={{ color: theme.colors.text }}>Step 3: Generate Your Images</h3>

                  <Instructions $color={theme.colors.text}>
                    Once you've answered all three questions, generate your three personalized
                    discussion images.
                  </Instructions>

                  <button
                    type="button"
                    onClick={handleGenerateImages}
                    disabled={isGeneratingImages}
                    style={buttonStyle(theme, isGeneratingImages)}
                  >
                    {isGeneratingImages ? 'Generating images...' : 'Generate Images'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: COMPLETED */}

            {hasImages && (
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ color: '#238636' }}>✓ Preparation Complete</h3>

                <Instructions $color={theme.colors.text}>
                  Your three discussion images are ready. You can view them here, and they will also
                  appear on the Game page when you're ready to have your conversation.
                </Instructions>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                    marginTop: '24px',
                  }}
                >
                  {generatedImages.map((image, index) => (
                    <div key={index}>
                      <strong style={{ color: theme.colors.text }}>Image {index + 1}</strong>

                      <img
                        src={image}
                        alt={`Prepared discussion image ${index + 1}`}
                        style={{
                          display: 'block',
                          width: '100%',
                          marginTop: '8px',
                          borderRadius: '10px',
                          border: `1px solid ${theme.colors.cardBorder}`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
    marginTop: '16px',
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

export default Preparation;
