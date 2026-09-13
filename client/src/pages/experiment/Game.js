import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SurveyContainer, SurveyCard, Instructions, Question } from './PreGameSurvey.styles';

import { useTheme } from '../../context/ThemeContext';
import { testGemini, generateImages, fetchUsers } from '../../store/thunks';

function Game() {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const [geminiQuestions, setGeminiQuestions] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
  });

  const [systemSettings, setSystemSettings] = useState({
    humor: 'high',
    ambiguity: 'high',
    personalness: 'high',
    visualStyle: 'cartoon',
  });

  const [gameId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    const loadUsers = async () => {
      const result = await dispatch(fetchUsers());

      if (fetchUsers.fulfilled.match(result)) {
        setUsers(result.payload);
      } else {
        console.error('Failed to load users:', result.payload);
        setUsersError(true);
      }

      setUsersLoading(false);
    };

    loadUsers();
  }, [dispatch]);

  const handleTestGemini = async () => {
    if (!selectedPartnerId) {
      console.error('Please select a conversation partner first.');
      return;
    }

    const result = await dispatch(
      testGemini({
        partnerUserId: selectedPartnerId,
        systemSettings,
      })
    );

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
        partnerUserId: selectedPartnerId,
        interactions,
        systemSettings,
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
        {/* ==================== PARTNER ==================== */}

        <div style={{ marginBottom: '24px' }}>
          <Instructions $color={theme.colors.text}>Select your conversation partner</Instructions>

          <select
            value={selectedPartnerId}
            onChange={(event) => setSelectedPartnerId(event.target.value)}
            disabled={usersLoading}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${theme.colors.cardBorder}`,
              background: theme.colors.card,
              color: theme.colors.text,
              fontSize: '16px',
            }}
          >
            <option value="">{usersLoading ? 'Loading users...' : 'Select a user...'}</option>

            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>

          {usersError && (
            <Instructions $color={theme.colors.text}>Unable to load users.</Instructions>
          )}

          {selectedPartnerId && (
            <Instructions $color={theme.colors.text}>Partner selected.</Instructions>
          )}
        </div>

        {/* ==================== SYSTEM SETTINGS ==================== */}

        <div style={{ marginBottom: '24px' }}>
          <Instructions $color={theme.colors.text}>System Settings</Instructions>

          <SettingSelect
            label="Humor"
            value={systemSettings.humor}
            onChange={(value) =>
              setSystemSettings((previous) => ({
                ...previous,
                humor: value,
              }))
            }
            options={['low', 'medium', 'high']}
            theme={theme}
          />

          <SettingSelect
            label="Ambiguity"
            value={systemSettings.ambiguity}
            onChange={(value) =>
              setSystemSettings((previous) => ({
                ...previous,
                ambiguity: value,
              }))
            }
            options={['low', 'medium', 'high']}
            theme={theme}
          />

          <SettingSelect
            label="Personalness"
            value={systemSettings.personalness}
            onChange={(value) =>
              setSystemSettings((previous) => ({
                ...previous,
                personalness: value,
              }))
            }
            options={['low', 'medium', 'high']}
            theme={theme}
          />

          <SettingSelect
            label="Visual Style"
            value={systemSettings.visualStyle}
            onChange={(value) =>
              setSystemSettings((previous) => ({
                ...previous,
                visualStyle: value,
              }))
            }
            options={['cartoon', 'photorealistic', 'sketch', 'abstract']}
            theme={theme}
          />
        </div>

        {/* ==================== GENERATE QUESTIONS ==================== */}

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
          Generate Questions
        </button>

        {/* ==================== QUESTIONS ==================== */}

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

/* ============================================================
   SETTING SELECT
   ============================================================ */

function SettingSelect({ label, value, onChange, options, theme }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <label
        style={{
          display: 'block',
          marginBottom: '6px',
          color: theme.colors.text,
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px',
          borderRadius: '8px',
          border: `1px solid ${theme.colors.cardBorder}`,
          background: theme.colors.card,
          color: theme.colors.text,
          fontSize: '15px',
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Game;
