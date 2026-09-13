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

    const answerList = [answers.question1, answers.question2, answers.question3];

    setIsGeneratingImages(true);
    setGeneratedImages([]);

    const result = await dispatch(generateImages(answerList));

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

        {generatedImages.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <Instructions $color={theme.colors.text}>Generated Images</Instructions>

            {generatedImages.map((image, index) => (
              <div
                key={index}
                style={{
                  marginTop: '20px',
                }}
              >
                <img
                  src={image}
                  alt={`Generated image ${index + 1}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    maxWidth: '500px',
                    margin: '0 auto',
                    borderRadius: '8px',
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </SurveyCard>
    </SurveyContainer>
  );
}

export default Game;
