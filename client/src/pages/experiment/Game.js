import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { SurveyContainer, SurveyCard, Instructions, Question } from './PreGameSurvey.styles';

import { useTheme } from '../../context/ThemeContext';
import { testGemini, generateImages } from '../../store/thunks';

function Game() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [geminiQuestions, setGeminiQuestions] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
  });

  const [gameId] = useState(() => crypto.randomUUID());

  const handleTestGemini = async () => {
    const result = await dispatch(testGemini());

    if (testGemini.fulfilled.match(result)) {
      console.log('Gemini response:', result.payload);
      setGeminiQuestions(result.payload);
    } else {
      console.error('Gemini request failed:', result.payload);
    }
  };

  const handleAnswer = (question, value) => {
    setAnswers((previous) => ({
      ...previous,
      [question]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const interactions = [
      {
        question: geminiQuestions[0],
        response: answers.question1,
      },
      {
        question: geminiQuestions[1],
        response: answers.question2,
      },
      {
        question: geminiQuestions[2],
        response: answers.question3,
      },
    ];

    setIsGeneratingImages(true);
    setGeneratedImages([]);

    const result = await dispatch(
      generateImages({
        gameId,
        interactions,
      })
    );

    if (generateImages.fulfilled.match(result)) {
      console.log('Generated images:', result.payload);
      setGeneratedImages(result.payload);
    } else {
      console.error('Image generation failed:', result.payload);
    }

    setIsGeneratingImages(false);
  };

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        <button
          type="button"
          onClick={handleTestGemini}
          style={{
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
          Test Gemini
        </button>

        <form onSubmit={handleSubmit}>
          {geminiQuestions[0] && (
            <>
              <Question $background={theme.colors.primaryButton} $color="white">
                {geminiQuestions[0]}
              </Question>

              <Instructions $color={theme.colors.text}>Share anything you'd like!</Instructions>

              <textarea
                value={answers.question1}
                onChange={(event) => handleAnswer('question1', event.target.value)}
                placeholder="Type your response..."
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.cardBorder}`,
                  background: theme.colors.card,
                  color: theme.colors.text,
                  fontSize: '16px',
                  resize: 'vertical',
                }}
              />

              {generatedImages[0] && (
                <img
                  src={generatedImages[0]}
                  alt="Generated image for question 1"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '20px auto 0',
                    borderRadius: '8px',
                  }}
                />
              )}
            </>
          )}

          {geminiQuestions[1] && (
            <>
              <Question $background={theme.colors.primaryButton} $color="white">
                {geminiQuestions[1]}
              </Question>

              <Instructions $color={theme.colors.text}>Share anything you'd like!</Instructions>

              <textarea
                value={answers.question2}
                onChange={(event) => handleAnswer('question2', event.target.value)}
                placeholder="Type your response..."
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.cardBorder}`,
                  background: theme.colors.card,
                  color: theme.colors.text,
                  fontSize: '16px',
                  resize: 'vertical',
                }}
              />

              {generatedImages[1] && (
                <img
                  src={generatedImages[1]}
                  alt="Generated image for question 2"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '20px auto 0',
                    borderRadius: '8px',
                  }}
                />
              )}
            </>
          )}

          {geminiQuestions[2] && (
            <>
              <Question $background={theme.colors.primaryButton} $color="white">
                {geminiQuestions[2]}
              </Question>

              <Instructions $color={theme.colors.text}>Share anything you'd like!</Instructions>

              <textarea
                value={answers.question3}
                onChange={(event) => handleAnswer('question3', event.target.value)}
                placeholder="Type your response..."
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${theme.colors.cardBorder}`,
                  background: theme.colors.card,
                  color: theme.colors.text,
                  fontSize: '16px',
                  resize: 'vertical',
                }}
              />

              {generatedImages[2] && (
                <img
                  src={generatedImages[2]}
                  alt="Generated image for question 3"
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '20px auto 0',
                    borderRadius: '8px',
                  }}
                />
              )}
            </>
          )}

          {geminiQuestions.length === 3 && (
            <button
              type="submit"
              disabled={isGeneratingImages}
              style={{
                marginTop: '24px',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: theme.colors.primaryButton,
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: isGeneratingImages ? 'default' : 'pointer',
                opacity: isGeneratingImages ? 0.6 : 1,
              }}
            >
              {isGeneratingImages ? 'Generating Images...' : 'Submit'}
            </button>
          )}
        </form>
      </SurveyCard>
    </SurveyContainer>
  );
}

export default Game;
