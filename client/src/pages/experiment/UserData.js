import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { SurveyContainer, SurveyCard, Question, Instructions } from './PreGameSurvey.styles';

import { useTheme } from '../../context/ThemeContext';

function UserData() {
  const { theme } = useTheme();

  const currentUser = useSelector((state) => state.user.user);

  const settings = currentUser?.settings || {};

  const preGameSurvey = settings.preGameSurvey || {};
  const gameData = settings.gameData || [];

  const demographics = preGameSurvey.demographics || {};

  return (
    <SurveyContainer $background={theme.colors.background}>
      <SurveyCard $background={theme.colors.card}>
        <h1
          style={{
            textAlign: 'center',
            color: theme.colors.text,
            marginBottom: '35px',
          }}
        >
          My Data
        </h1>

        {/* ==================== PRE-GAME SURVEY ==================== */}

        <SectionTitle title="Pre-game Survey" theme={theme} />

        <SubsectionTitle title="About Me" theme={theme} />

        <DataCard theme={theme}>
          <DataRow label="Interests" value={formatArray(preGameSurvey.interests)} theme={theme} />

          <DataRow label="Pets" value={formatArray(preGameSurvey.pets)} theme={theme} />

          <DataRow
            label="Collections"
            value={formatArray(preGameSurvey.collections)}
            theme={theme}
          />

          <DataRow
            label="Something people wouldn't guess"
            value={preGameSurvey.hiddenFact}
            theme={theme}
            multiline
          />
        </DataCard>

        <SubsectionTitle title="Comfort & Preferences" theme={theme} />

        <DataCard theme={theme}>
          <DataRow label="Comfort meeting new people" value={preGameSurvey.comfort} theme={theme} />

          <DataRow
            label="Comfort sharing personal information"
            value={preGameSurvey.personalInformation}
            theme={theme}
          />
        </DataCard>

        <SubsectionTitle title="Demographics" theme={theme} />

        <DataCard theme={theme}>
          <DataRow label="Age" value={demographics.age} theme={theme} />

          <DataRow label="Gender" value={demographics.gender} theme={theme} />

          <DataRow label="Race/ethnicity" value={demographics.raceEthnicity} theme={theme} />
        </DataCard>

        {/* ==================== GAME DATA ==================== */}

        <SectionTitle title="Game Data" theme={theme} />

        {gameData.length === 0 ? (
          <Instructions $color={theme.colors.text}>No game data yet.</Instructions>
        ) : (
          gameData.map((game, gameIndex) => (
            <GameDataSection
              key={game.gameId || gameIndex}
              game={game}
              gameIndex={gameIndex}
              participantSurvey={preGameSurvey}
              participantEmail={currentUser?.email}
              theme={theme}
            />
          ))
        )}
      </SurveyCard>
    </SurveyContainer>
  );
}

/* ============================================================
   GAME DATA
   ============================================================ */

function GameDataSection({ game, gameIndex, participantSurvey, participantEmail, theme }) {
  const [showParticipantInfo, setShowParticipantInfo] = useState(false);

  const [showPartnerInfo, setShowPartnerInfo] = useState(false);

  const [showSystemSettings, setShowSystemSettings] = useState(false);

  const partnerSurvey = game.partnerPreGameSurvey || {};

  const systemSettings = game.systemSettings || {};

  const hasPostGameSurvey = !!game.postGameSurvey;

  return (
    <div
      style={{
        marginBottom: '35px',
      }}
    >
      <h2
        style={{
          color: theme.colors.text,
          fontSize: '20px',
          margin: '0 0 15px 0',
        }}
      >
        Game {gameIndex + 1}
      </h2>

      {/* ==================== SYSTEM SETTINGS ==================== */}

      {game.systemSettings ? (
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setShowSystemSettings((previous) => !previous)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${theme.colors.cardBorder}`,
              borderRadius: '8px',
              background: theme.colors.background,
              color: theme.colors.text,
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {showSystemSettings ? 'Hide System Settings ▲' : 'Show System Settings ▼'}
          </button>

          {showSystemSettings && (
            <div style={{ marginTop: '10px' }}>
              <DataCard theme={theme}>
                <DataRow label="Humor" value={systemSettings.humor} theme={theme} />

                <DataRow label="Ambiguity" value={systemSettings.ambiguity} theme={theme} />

                <DataRow label="Personalness" value={systemSettings.personalness} theme={theme} />

                <DataRow label="Visual style" value={systemSettings.visualStyle} theme={theme} />
              </DataCard>
            </div>
          )}
        </div>
      ) : (
        <Instructions
          $color={theme.colors.text}
          style={{
            fontSize: '13px',
            marginBottom: '20px',
            opacity: 0.7,
          }}
        >
          System settings were not saved for this game.
        </Instructions>
      )}

      {/* ==================== PARTICIPANT INFORMATION ==================== */}

      {participantSurvey ? (
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setShowParticipantInfo((previous) => !previous)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${theme.colors.cardBorder}`,
              borderRadius: '8px',
              background: theme.colors.background,
              color: theme.colors.text,
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {showParticipantInfo
              ? 'Hide Participant Information ▲'
              : 'Show Participant Information ▼'}
          </button>

          {showParticipantInfo && (
            <ParticipantInformation
              email={participantEmail}
              survey={participantSurvey}
              theme={theme}
            />
          )}
        </div>
      ) : (
        <Instructions
          $color={theme.colors.text}
          style={{
            fontSize: '13px',
            marginBottom: '20px',
            opacity: 0.7,
          }}
        >
          Participant information was not saved for this game.
        </Instructions>
      )}

      {/* ==================== PARTNER INFORMATION ==================== */}

      {game.partnerPreGameSurvey ? (
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setShowPartnerInfo((previous) => !previous)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${theme.colors.cardBorder}`,
              borderRadius: '8px',
              background: theme.colors.background,
              color: theme.colors.text,
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {showPartnerInfo ? 'Hide Partner Information ▲' : 'Show Partner Information ▼'}
          </button>

          {showPartnerInfo && (
            <PartnerInformation email={game.partnerEmail} survey={partnerSurvey} theme={theme} />
          )}
        </div>
      ) : (
        <Instructions
          $color={theme.colors.text}
          style={{
            fontSize: '13px',
            marginBottom: '20px',
            opacity: 0.7,
          }}
        >
          Partner information was not saved for this game.
        </Instructions>
      )}

      {/* ==================== INTERACTIONS ==================== */}

      <SubsectionTitle title="Interactions" theme={theme} />

      {!game.interactions || game.interactions.length === 0 ? (
        <Instructions $color={theme.colors.text}>No interactions recorded.</Instructions>
      ) : (
        game.interactions.map((interaction, interactionIndex) => (
          <InteractionCard key={interactionIndex} theme={theme}>
            <div
              style={{
                color: theme.colors.text,
                fontWeight: '700',
                fontSize: '14px',
                marginBottom: '15px',
                opacity: 0.7,
              }}
            >
              Interaction {interactionIndex + 1}
            </div>

            <InteractionLabel theme={theme}>Question</InteractionLabel>

            <div
              style={{
                color: theme.colors.text,
                lineHeight: '1.5',
                marginBottom: '18px',
              }}
            >
              {formatValue(interaction.question)}
            </div>

            <InteractionLabel theme={theme}>Response</InteractionLabel>

            <div
              style={{
                color: theme.colors.text,
                lineHeight: '1.5',
              }}
            >
              {formatValue(interaction.response)}
            </div>

            {interaction.imageUrl && (
              <img
                src={interaction.imageUrl}
                alt={`Generated image for interaction ${interactionIndex + 1}`}
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: '300px',
                  margin: '20px auto 0',
                  borderRadius: '8px',
                }}
              />
            )}
          </InteractionCard>
        ))
      )}

      {/* ==================== POST-GAME SURVEY ==================== */}

      <div
        style={{
          marginTop: '25px',
        }}
      >
        {hasPostGameSurvey ? (
          <DataCard theme={theme}>
            <DataRow
              label="Likelihood of interacting with this person again"
              value={formatInteractionAgain(game.postGameSurvey.interactionAgain)}
              theme={theme}
            />
          </DataCard>
        ) : (
          <Link
            to={`/postgame/${game.gameId}`}
            style={{
              textDecoration: 'none',
            }}
          >
            <button
              type="button"
              style={{
                width: '100%',
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
              Fill Out Post-Game Survey
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PARTICIPANT INFORMATION
   ============================================================ */

function ParticipantInformation({ email, survey, theme }) {
  return (
    <div
      style={{
        marginTop: '10px',
        padding: '5px 18px',
        background: theme.colors.background,
        border: `1px solid ${theme.colors.cardBorder}`,
        borderRadius: '8px',
      }}
    >
      <DataRow label="Email" value={email} theme={theme} />

      <DataRow label="Interests" value={formatArray(survey.interests)} theme={theme} />

      <DataRow label="Pets" value={formatArray(survey.pets)} theme={theme} />

      <DataRow label="Collections" value={formatArray(survey.collections)} theme={theme} />

      <DataRow
        label="Something people wouldn't guess"
        value={survey.hiddenFact}
        theme={theme}
        multiline
      />
    </div>
  );
}

/* ============================================================
   PARTNER INFORMATION
   ============================================================ */

function PartnerInformation({ email, survey, theme }) {
  return (
    <div
      style={{
        marginTop: '10px',
        padding: '5px 18px',
        background: theme.colors.background,
        border: `1px solid ${theme.colors.cardBorder}`,
        borderRadius: '8px',
      }}
    >
      <DataRow label="Email" value={email} theme={theme} />

      <DataRow label="Interests" value={formatArray(survey.interests)} theme={theme} />

      <DataRow label="Pets" value={formatArray(survey.pets)} theme={theme} />

      <DataRow label="Collections" value={formatArray(survey.collections)} theme={theme} />

      <DataRow
        label="Something people wouldn't guess"
        value={survey.hiddenFact}
        theme={theme}
        multiline
      />
    </div>
  );
}

/* ============================================================
   SECTION COMPONENTS
   ============================================================ */

function SectionTitle({ title, theme }) {
  return (
    <Question
      $background={theme.colors.primaryButton}
      $color="white"
      style={{
        margin: '25px 0 25px 0',
        fontSize: '18px',
        fontWeight: '700',
      }}
    >
      {title}
    </Question>
  );
}

function SubsectionTitle({ title, theme }) {
  return (
    <h3
      style={{
        color: theme.colors.text,
        fontSize: '16px',
        margin: '25px 5px 10px 5px',
      }}
    >
      {title}
    </h3>
  );
}

/* ============================================================
   DATA COMPONENTS
   ============================================================ */

function DataCard({ children, theme }) {
  return (
    <div
      style={{
        background: theme.colors.background,
        border: `1px solid ${theme.colors.cardBorder}`,
        borderRadius: '8px',
        padding: '5px 18px',
        marginBottom: '20px',
      }}
    >
      {children}
    </div>
  );
}

function DataRow({ label, value, theme, multiline = false }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 220px) 1fr',
        gap: '20px',
        padding: '13px 0',
        borderBottom: `1px solid ${theme.colors.cardBorder}`,
        color: theme.colors.text,
        alignItems: 'start',
      }}
    >
      <div
        style={{
          fontWeight: '600',
          fontSize: '14px',
        }}
      >
        {label}
      </div>

      <div
        style={{
          lineHeight: '1.5',
          whiteSpace: multiline ? 'pre-wrap' : 'normal',
          overflowWrap: 'anywhere',
        }}
      >
        {formatValue(value)}
      </div>
    </div>
  );
}

function InteractionCard({ children, theme }) {
  return (
    <div
      style={{
        background: theme.colors.background,
        border: `1px solid ${theme.colors.cardBorder}`,
        borderRadius: '10px',
        padding: '18px',
        marginBottom: '15px',
      }}
    >
      {children}
    </div>
  );
}

function InteractionLabel({ children, theme }) {
  return (
    <div
      style={{
        color: theme.colors.text,
        fontSize: '12px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '5px',
        opacity: 0.65,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   FORMATTING HELPERS
   ============================================================ */

function formatArray(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return '—';
  }

  return value.join(', ');
}

function formatValue(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return value;
}

function formatInteractionAgain(value) {
  if (!value) {
    return '—';
  }

  const labels = {
    1: 'Very unlikely',
    2: 'Unlikely',
    3: 'Somewhat unlikely',
    4: 'Neutral',
    5: 'Somewhat likely',
    6: 'Likely',
    7: 'Very likely',
  };

  return `${value} — ${labels[value] || ''}`;
}

export default UserData;
