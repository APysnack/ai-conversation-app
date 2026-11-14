import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { fetchUsers, createGameSession } from '../store/thunks';
import { GET_ALL_GAME_SESSIONS } from '../utils/graphqlQueries';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_SYSTEM_SETTINGS = {
  humor: 'high',
  ambiguity: 'high',
  personalness: 'high',
  visualStyle: 'cartoon',
};

const Page = styled.main`
  width: 100%;
  min-height: calc(100vh - 64px);
  box-sizing: border-box;
  margin: 0 auto;
  padding: 32px 24px;
  background: #36393f;

  & > * {
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Heading = styled.div`
  h1 {
    margin: 0 0 8px;
    font-size: 26px;
    color: ${(p) => p.$text};
  }

  p {
    margin: 0;
    color: ${(p) => p.$secondary};
    font-size: 14px;
  }
`;

const RefreshButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  background: ${(p) => p.$background};
  color: ${(p) => p.$color};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: ${(p) => p.$background};
  border: 1px solid ${(p) => p.$border};
`;

const StatLabel = styled.div`
  color: ${(p) => p.$color};
  font-size: 13px;
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  color: ${(p) => p.$color};
  font-size: 28px;
  font-weight: 700;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  margin-bottom: 16px;

  h2 {
    margin: 0 0 5px;
    font-size: 18px;
    color: ${(p) => p.$text};
  }

  p {
    margin: 0;
    font-size: 13px;
    color: ${(p) => p.$secondary};
    line-height: 1.5;
  }
`;

const Card = styled.div`
  background: ${(p) => p.$background};
  border: 1px solid ${(p) => p.$border};
  border-radius: 12px;
  overflow: hidden;
`;

const CardHeading = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid ${(p) => p.$border};

  h3 {
    margin: 0 0 5px;
    font-size: 15px;
    color: ${(p) => p.$text};
  }

  p {
    margin: 0;
    font-size: 13px;
    color: ${(p) => p.$secondary};
    line-height: 1.5;
  }
`;

const ParticipantList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ParticipantRow = styled.div`
  padding: 18px 20px;
  border-top: 1px solid ${(p) => p.$border};

  &:first-child {
    border-top: none;
  }
`;

const ParticipantTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 650px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const ParticipantInfo = styled.div`
  min-width: 0;

  strong {
    display: block;
    color: ${(p) => p.$text};
    font-size: 14px;
    overflow-wrap: anywhere;
  }

  span {
    display: block;
    margin-top: 5px;
    color: ${(p) => p.$secondary};
    font-size: 12px;
  }
`;

const SessionHistory = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
`;

const Status = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${(p) => (p.$complete ? '#dcfce7' : '#f1f5f9')};
  color: ${(p) => (p.$complete ? '#166534' : '#475569')};
`;

const ConditionBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${(p) => (p.$ai ? '#e0e7ff' : '#dbeafe')};
  color: ${(p) => (p.$ai ? '#3730a3' : '#1e40af')};
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 9px 13px;
  background: ${(p) => p.$background};
  color: ${(p) => p.$color};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AssignmentPanel = styled.div`
  margin-top: 16px;
  padding: 18px;
  border-radius: 8px;
  background: ${(p) => p.$background};
  border: 1px solid ${(p) => p.$border};
`;

const AssignmentTitle = styled.div`
  margin-bottom: 16px;

  strong {
    display: block;
    color: ${(p) => p.$text};
    font-size: 14px;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    color: ${(p) => p.$secondary};
    font-size: 13px;
    line-height: 1.5;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${(p) => p.$color};
  font-size: 13px;
  font-weight: 600;
`;

const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 1px solid ${(p) => p.$border};
  border-radius: 8px;
  background: ${(p) => p.$background};
  color: ${(p) => p.$color};
  font-size: 14px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SettingsSection = styled.div`
  margin-bottom: 18px;
  padding: 16px;
  border: 1px solid ${(p) => p.$border};
  border-radius: 8px;
  background: ${(p) => p.$background};
`;

const SettingsHeading = styled.div`
  margin-bottom: 14px;

  strong {
    display: block;
    color: ${(p) => p.$text};
    font-size: 14px;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    color: ${(p) => p.$secondary};
    font-size: 12px;
    line-height: 1.5;
  }
`;

const FormActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const CreateButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 11px 18px;
  background: ${(p) => p.$background};
  color: ${(p) => p.$color};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  border: 1px solid ${(p) => p.$border};
  border-radius: 8px;
  padding: 10px 15px;
  background: transparent;
  color: ${(p) => p.$color};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const CompletedToggle = styled.button`
  display: block;
  margin: 12px 20px;
  padding: 8px 12px;
  border: 1px solid ${(p) => p.$border};
  border-radius: 8px;
  background: transparent;
  color: ${(p) => p.$color};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${(p) => p.$hover};
  }
`;

const Feedback = styled.div`
  margin-top: 14px;
  color: ${(p) => (p.$success ? '#86efac' : '#fca5a5')};
  font-size: 13px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
    padding: 13px 20px;
    font-size: 12px;
    font-weight: 600;
    color: ${(p) => p.$secondary};
    background: ${(p) => p.$headerBackground};
    white-space: nowrap;
  }

  td {
    padding: 15px 20px;
    font-size: 14px;
    color: ${(p) => p.$text};
    border-top: 1px solid ${(p) => p.$border};
  }

  tbody tr {
    cursor: pointer;
    transition: background 0.15s ease;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.07);
  }

  tbody tr:focus-visible {
    outline: 2px solid ${(p) => p.$secondary};
    outline-offset: -2px;
  }
`;

const ProgressTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  text-align: left;

  th {
    padding: 13px 14px;
    font-size: 12px;
    font-weight: 600;
    color: ${(p) => p.$secondary};
    background: ${(p) => p.$headerBackground};
    white-space: nowrap;
  }

  td {
    padding: 14px;
    font-size: 13px;
    color: ${(p) => p.$text};
    border-top: 1px solid ${(p) => p.$border};
    white-space: nowrap;
  }

  td:first-child {
    min-width: 190px;
    white-space: normal;
    overflow-wrap: anywhere;
  }
`;

const MilestoneStatus = styled.span`
  display: inline-block;
  padding: 5px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${(p) => {
    if (p.$state === 'complete') return '#dcfce7';
    if (p.$state === 'unavailable') return '#e5e7eb';
    return '#fef3c7';
  }};
  color: ${(p) => {
    if (p.$state === 'complete') return '#166534';
    if (p.$state === 'unavailable') return '#4b5563';
    return '#92400e';
  }};
`;

const Message = styled.div`
  padding: 22px 20px;
  color: ${(p) => p.$color};
  font-size: 14px;
  line-height: 1.5;
`;

function hasSubmittedPreGameSurvey(user) {
  const survey = user.settings?.preGameSurvey;

  return (
    survey !== null &&
    typeof survey === 'object' &&
    !Array.isArray(survey) &&
    Object.keys(survey).length > 0
  );
}

function hasGeneratedImages(participation) {
  const images = participation?.generatedImages;

  return Array.isArray(images) && images.length === 3 && images.every((image) => Boolean(image));
}

function formatCondition(condition) {
  return condition === 'ai_mediated' ? 'AI-mediated' : 'Control';
}

function formatStatus(status) {
  if (!status) return 'Unknown';

  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getParticipationForCondition(sessions, participantId, condition) {
  const session = sessions.find((item) => item.condition === condition);

  if (!session) return null;

  return (
    session.gameParticipations?.find(
      (participation) => String(participation.user?.id) === String(participantId)
    ) || null
  );
}

function getParticipantProgress(participant, sessions) {
  const participantSessions = sessions.filter(
    (session) =>
      String(session.userOne?.id) === String(participant.id) ||
      String(session.userTwo?.id) === String(participant.id)
  );

  const controlParticipation = getParticipationForCondition(
    participantSessions,
    participant.id,
    'control'
  );

  const aiParticipation = getParticipationForCondition(
    participantSessions,
    participant.id,
    'ai_mediated'
  );

  const preSurveyComplete = hasSubmittedPreGameSurvey(participant);
  const aiPreparationComplete = hasGeneratedImages(aiParticipation);
  const controlConversationComplete = Boolean(controlParticipation?.conversationCompletedAt);
  const aiConversationComplete = Boolean(aiParticipation?.conversationCompletedAt);

  const coreComplete =
    preSurveyComplete &&
    aiPreparationComplete &&
    controlConversationComplete &&
    aiConversationComplete;

  return {
    preSurveyComplete,
    aiPreparationComplete,
    controlConversationComplete,
    aiConversationComplete,
    coreComplete,
  };
}

function ProgressCell({ complete, unavailable = false }) {
  if (unavailable) {
    return <MilestoneStatus $state="unavailable">Not connected</MilestoneStatus>;
  }

  return (
    <MilestoneStatus $state={complete ? 'complete' : 'incomplete'}>
      {complete ? 'Complete' : 'Pending'}
    </MilestoneStatus>
  );
}

function AdminPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const colors = theme?.colors || {};

  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedParticipantId, setExpandedParticipantId] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [firstSessionCondition, setFirstSessionCondition] = useState('control');
  const [creatingSession, setCreatingSession] = useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = useState(null);
  const [showFullyAssigned, setShowFullyAssigned] = useState(false);

  const [systemSettings, setSystemSettings] = useState(DEFAULT_SYSTEM_SETTINGS);

  const {
    data: sessionsData,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useQuery(GET_ALL_GAME_SESSIONS);

  const sessions = sessionsData?.allGameSessions || [];

  const loadParticipants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(fetchUsers()).unwrap();
      setUsers(result.users || []);
      setCurrentUserId(result.currentUserId);
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Unable to load participants.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const participants = useMemo(
    () => users.filter((user) => String(user.id) !== String(currentUserId)),
    [users, currentUserId]
  );

  const sessionsByUser = useMemo(() => {
    const result = {};

    sessions.forEach((session) => {
      if (!session.userOne?.id || !session.userTwo?.id) return;

      const userOneId = String(session.userOne.id);
      const userTwoId = String(session.userTwo.id);

      result[userOneId] = [...(result[userOneId] || []), session];
      result[userTwoId] = [...(result[userTwoId] || []), session];
    });

    return result;
  }, [sessions]);

  const getParticipantSessions = (participantId) => sessionsByUser[String(participantId)] || [];

  const getAssignmentInfo = (participantId) => {
    const participantSessions = getParticipantSessions(participantId);
    const assignedConditions = new Set(participantSessions.map((session) => session.condition));

    const hasControl = assignedConditions.has('control');
    const hasAiMediated = assignedConditions.has('ai_mediated');

    const complete = hasControl && hasAiMediated;
    const sessionCount = participantSessions.length;
    const needsReview = !complete && sessionCount >= 2;

    let missingCondition = null;

    if (!hasControl) {
      missingCondition = 'control';
    } else if (!hasAiMediated) {
      missingCondition = 'ai_mediated';
    }

    return {
      sessions: participantSessions,
      sessionCount,
      hasControl,
      hasAiMediated,
      missingCondition,
      complete,
      needsReview,
      canAssign: !complete && !needsReview,
    };
  };

  const progressByParticipant = useMemo(() => {
    const result = {};

    participants.forEach((participant) => {
      result[String(participant.id)] = getParticipantProgress(participant, sessions);
    });

    return result;
  }, [participants, sessions]);

  const getProgress = (participantId) => progressByParticipant[String(participantId)];

  const completeCount = participants.filter(
    (participant) => getAssignmentInfo(participant.id).complete
  ).length;

  const coreCompleteCount = participants.filter(
    (participant) => getProgress(participant.id)?.coreComplete
  ).length;

  const readyParticipants = participants.filter(
    (participant) =>
      hasSubmittedPreGameSurvey(participant) && getAssignmentInfo(participant.id).canAssign
  );

  const participantsNeedingAssignment = participants.filter(
    (participant) => !getAssignmentInfo(participant.id).complete
  );

  const fullyAssignedParticipants = participants.filter(
    (participant) => getAssignmentInfo(participant.id).complete
  );

  const getAvailablePartners = (participantId, condition) => {
    const participantSessions = getParticipantSessions(participantId);

    const previousPartnerIds = new Set(
      participantSessions.map((session) => {
        const isUserOne = String(session.userOne.id) === String(participantId);
        return String(isUserOne ? session.userTwo.id : session.userOne.id);
      })
    );

    return readyParticipants.filter((candidate) => {
      if (String(candidate.id) === String(participantId)) {
        return false;
      }

      if (previousPartnerIds.has(String(candidate.id))) {
        return false;
      }

      const candidateInfo = getAssignmentInfo(candidate.id);

      if (candidateInfo.sessionCount === 0) {
        return true;
      }

      return candidateInfo.missingCondition === condition;
    });
  };

  const openAssignment = (participant) => {
    const info = getAssignmentInfo(participant.id);

    setExpandedParticipantId(String(participant.id));
    setSelectedPartnerId('');
    setFirstSessionCondition(info.missingCondition || 'control');
    setSystemSettings({ ...DEFAULT_SYSTEM_SETTINGS });
    setAssignmentFeedback(null);
  };

  const closeAssignment = () => {
    setExpandedParticipantId(null);
    setSelectedPartnerId('');
    setAssignmentFeedback(null);
  };

  const handleCreateSession = async (event, participant) => {
    event.preventDefault();
    setAssignmentFeedback(null);

    const participantInfo = getAssignmentInfo(participant.id);

    const condition =
      participantInfo.sessionCount === 0 ? firstSessionCondition : participantInfo.missingCondition;

    if (!selectedPartnerId) {
      setAssignmentFeedback({
        success: false,
        message: 'Please select a partner.',
      });
      return;
    }

    const availablePartners = getAvailablePartners(participant.id, condition);

    const partnerIsAvailable = availablePartners.some(
      (candidate) => String(candidate.id) === selectedPartnerId
    );

    if (!partnerIsAvailable) {
      setAssignmentFeedback({
        success: false,
        message: 'That participant is no longer eligible for this pairing. Please refresh.',
      });
      return;
    }

    setCreatingSession(true);

    try {
      await dispatch(
        createGameSession({
          userOneId: String(participant.id),
          userTwoId: selectedPartnerId,
          condition,
          systemSettings: condition === 'ai_mediated' ? systemSettings : undefined,
        })
      ).unwrap();

      await refetchSessions();

      setExpandedParticipantId(null);
      setSelectedPartnerId('');
      setAssignmentFeedback(null);
    } catch (err) {
      setAssignmentFeedback({
        success: false,
        message: typeof err === 'string' ? err : err?.message || 'Unable to create session.',
      });
    } finally {
      setCreatingSession(false);
    }
  };

  const handleOpenSession = (sessionId) => {
    navigate(`/admin/game-sessions/${sessionId}`);
  };

  const handleSessionRowKeyDown = (event, sessionId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenSession(sessionId);
    }
  };

  const isRefreshing = loading || sessionsLoading;

  return (
    <Page>
      <PageHeader>
        <Heading $text={colors.text || '#ffffff'} $secondary={colors.textSecondary || '#b9bbbe'}>
          <h1>Study Administration</h1>
          <p>Manage participants, assign interactions, and monitor study progress.</p>
        </Heading>

        <RefreshButton
          type="button"
          onClick={() => {
            loadParticipants();
            refetchSessions();
          }}
          disabled={isRefreshing}
          $background={colors.primaryButton || '#2563eb'}
          $color={colors.textOnPrimary || '#ffffff'}
        >
          {isRefreshing ? 'Loading...' : 'Refresh data'}
        </RefreshButton>
      </PageHeader>

      <StatsGrid>
        <StatCard $background={colors.card || '#2f3136'} $border={colors.cardBorder || '#202225'}>
          <StatLabel $color={colors.textSecondary || '#b9bbbe'}>Total Participants</StatLabel>
          <StatValue $color={colors.text || '#ffffff'}>{participants.length}</StatValue>
        </StatCard>

        <StatCard $background={colors.card || '#2f3136'} $border={colors.cardBorder || '#202225'}>
          <StatLabel $color={colors.textSecondary || '#b9bbbe'}>Core Milestones Complete</StatLabel>
          <StatValue $color={colors.text || '#ffffff'}>{coreCompleteCount}</StatValue>
        </StatCard>

        <StatCard $background={colors.card || '#2f3136'} $border={colors.cardBorder || '#202225'}>
          <StatLabel $color={colors.textSecondary || '#b9bbbe'}>
            Participants Fully Assigned
          </StatLabel>
          <StatValue $color={colors.text || '#ffffff'}>{completeCount}</StatValue>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader
          $text={colors.text || '#ffffff'}
          $secondary={colors.textSecondary || '#b9bbbe'}
        >
          <h2>Participant Assignments</h2>
          <p>
            Assign each participant one Control interaction and one AI-mediated interaction with
            different partners.
          </p>
        </SectionHeader>

        <Card $background={colors.card || '#2f3136'} $border={colors.cardBorder || '#202225'}>
          <CardHeading
            $border={colors.divider || '#4f545c'}
            $text={colors.text || '#ffffff'}
            $secondary={colors.textSecondary || '#b9bbbe'}
          >
            <h3>{participantsNeedingAssignment.length} participants need assignments</h3>
            <p>Open a participant's assignment form to create their next interaction.</p>
          </CardHeading>

          {error ? (
            <Message $color="#fca5a5">{error}</Message>
          ) : sessionsError ? (
            <Message $color="#fca5a5">
              Unable to load game sessions: {sessionsError.message}
            </Message>
          ) : isRefreshing ? (
            <Message $color={colors.textSecondary || '#b9bbbe'}>
              Loading participant assignments...
            </Message>
          ) : participants.length === 0 ? (
            <Message $color={colors.textSecondary || '#b9bbbe'}>
              No participants have registered yet.
            </Message>
          ) : participantsNeedingAssignment.length === 0 ? (
            <Message $color={colors.textSecondary || '#b9bbbe'}>
              Everyone has been assigned both sessions. You can reveal the completed participants
              below.
            </Message>
          ) : (
            <ParticipantList>
              {participantsNeedingAssignment.map((participant) => {
                const submitted = hasSubmittedPreGameSurvey(participant);
                const info = getAssignmentInfo(participant.id);
                const isExpanded = expandedParticipantId === String(participant.id);

                const nextCondition =
                  info.sessionCount === 0 ? firstSessionCondition : info.missingCondition;

                const availablePartners = info.canAssign
                  ? getAvailablePartners(participant.id, nextCondition)
                  : [];

                return (
                  <ParticipantRow key={participant.id} $border={colors.divider || '#4f545c'}>
                    <ParticipantTop>
                      <ParticipantInfo
                        $text={colors.text || '#ffffff'}
                        $secondary={colors.textSecondary || '#b9bbbe'}
                      >
                        <strong>{participant.email}</strong>
                        <span>
                          Participant #{participant.id} · {info.sessionCount} of 2 sessions assigned
                        </span>
                      </ParticipantInfo>

                      {!submitted ? (
                        <Status $complete={false}>Pre-game survey needed</Status>
                      ) : info.needsReview ? (
                        <Status $complete={false}>Needs review</Status>
                      ) : (
                        <ActionButton
                          type="button"
                          onClick={() => {
                            if (isExpanded) {
                              closeAssignment();
                            } else {
                              openAssignment(participant);
                            }
                          }}
                          disabled={creatingSession}
                          $background={colors.primaryButton || '#5865f2'}
                          $color={colors.textOnPrimary || '#ffffff'}
                        >
                          {isExpanded ? 'Close' : 'Assign next session'}
                        </ActionButton>
                      )}
                    </ParticipantTop>

                    <SessionHistory>
                      {info.hasControl ? (
                        <ConditionBadge $ai={false}>Control assigned</ConditionBadge>
                      ) : (
                        <Status $complete={false}>Control needed</Status>
                      )}

                      {info.hasAiMediated ? (
                        <ConditionBadge $ai>AI-mediated assigned</ConditionBadge>
                      ) : (
                        <Status $complete={false}>AI-mediated needed</Status>
                      )}
                    </SessionHistory>

                    {info.needsReview && (
                      <Message $color="#fca5a5">
                        This participant has {info.sessionCount} sessions, but is missing one of the
                        two required conditions. Please review their existing assignments before
                        creating another session.
                      </Message>
                    )}

                    {isExpanded && info.canAssign && submitted && (
                      <AssignmentPanel
                        $background={colors.background || '#202225'}
                        $border={colors.divider || '#4f545c'}
                      >
                        <AssignmentTitle
                          $text={colors.text || '#ffffff'}
                          $secondary={colors.textSecondary || '#b9bbbe'}
                        >
                          <strong>Assign {formatCondition(nextCondition)} session</strong>
                          <p>
                            {info.sessionCount === 0
                              ? 'Choose the condition for this participant’s first interaction, then select a partner.'
                              : `This participant already has a ${formatCondition(
                                  info.hasControl ? 'control' : 'ai_mediated'
                                )} session. Their next session must be ${formatCondition(
                                  nextCondition
                                )}.`}
                          </p>
                        </AssignmentTitle>

                        <form onSubmit={(event) => handleCreateSession(event, participant)}>
                          <FormGrid>
                            {info.sessionCount === 0 && (
                              <Field $color={colors.text || '#ffffff'}>
                                Interaction condition
                                <Select
                                  value={firstSessionCondition}
                                  onChange={(event) => {
                                    setFirstSessionCondition(event.target.value);
                                    setSelectedPartnerId('');
                                  }}
                                  $background={colors.card || '#2f3136'}
                                  $color={colors.text || '#ffffff'}
                                  $border={colors.divider || '#4f545c'}
                                  disabled={creatingSession}
                                >
                                  <option value="control">Control</option>
                                  <option value="ai_mediated">AI-mediated</option>
                                </Select>
                              </Field>
                            )}

                            {info.sessionCount === 1 && (
                              <Field $color={colors.text || '#ffffff'}>
                                Required condition
                                <Select
                                  value={nextCondition}
                                  disabled
                                  $background={colors.card || '#2f3136'}
                                  $color={colors.text || '#ffffff'}
                                  $border={colors.divider || '#4f545c'}
                                >
                                  <option value={nextCondition}>
                                    {formatCondition(nextCondition)}
                                  </option>
                                </Select>
                              </Field>
                            )}

                            <Field $color={colors.text || '#ffffff'}>
                              Select partner
                              <Select
                                value={selectedPartnerId}
                                onChange={(event) => setSelectedPartnerId(event.target.value)}
                                $background={colors.card || '#2f3136'}
                                $color={colors.text || '#ffffff'}
                                $border={colors.divider || '#4f545c'}
                                disabled={creatingSession}
                              >
                                <option value="">Choose a participant</option>
                                {availablePartners.map((candidate) => (
                                  <option key={candidate.id} value={candidate.id}>
                                    {candidate.email}
                                  </option>
                                ))}
                              </Select>
                            </Field>
                          </FormGrid>

                          {nextCondition === 'ai_mediated' && (
                            <SettingsSection
                              $background={colors.background || '#202225'}
                              $border={colors.divider || '#4f545c'}
                            >
                              <SettingsHeading
                                $text={colors.text || '#ffffff'}
                                $secondary={colors.textSecondary || '#b9bbbe'}
                              >
                                <strong>AI Generation Settings</strong>
                                <p>
                                  These settings control how the AI generates conversation questions
                                  and images for this session. Both participants will use the same
                                  configuration.
                                </p>
                              </SettingsHeading>

                              <FormGrid>
                                <Field $color={colors.text || '#ffffff'}>
                                  Humor
                                  <Select
                                    value={systemSettings.humor}
                                    onChange={(event) =>
                                      setSystemSettings((current) => ({
                                        ...current,
                                        humor: event.target.value,
                                      }))
                                    }
                                    $background={colors.card || '#2f3136'}
                                    $color={colors.text || '#ffffff'}
                                    $border={colors.divider || '#4f545c'}
                                    disabled={creatingSession}
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </Select>
                                </Field>

                                <Field $color={colors.text || '#ffffff'}>
                                  Ambiguity
                                  <Select
                                    value={systemSettings.ambiguity}
                                    onChange={(event) =>
                                      setSystemSettings((current) => ({
                                        ...current,
                                        ambiguity: event.target.value,
                                      }))
                                    }
                                    $background={colors.card || '#2f3136'}
                                    $color={colors.text || '#ffffff'}
                                    $border={colors.divider || '#4f545c'}
                                    disabled={creatingSession}
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </Select>
                                </Field>

                                <Field $color={colors.text || '#ffffff'}>
                                  Personalness
                                  <Select
                                    value={systemSettings.personalness}
                                    onChange={(event) =>
                                      setSystemSettings((current) => ({
                                        ...current,
                                        personalness: event.target.value,
                                      }))
                                    }
                                    $background={colors.card || '#2f3136'}
                                    $color={colors.text || '#ffffff'}
                                    $border={colors.divider || '#4f545c'}
                                    disabled={creatingSession}
                                  >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </Select>
                                </Field>

                                <Field $color={colors.text || '#ffffff'}>
                                  Visual style
                                  <Select
                                    value={systemSettings.visualStyle}
                                    onChange={(event) =>
                                      setSystemSettings((current) => ({
                                        ...current,
                                        visualStyle: event.target.value,
                                      }))
                                    }
                                    $background={colors.card || '#2f3136'}
                                    $color={colors.text || '#ffffff'}
                                    $border={colors.divider || '#4f545c'}
                                    disabled={creatingSession}
                                  >
                                    <option value="cartoon">Cartoon</option>
                                    <option value="realistic">Realistic</option>
                                  </Select>
                                </Field>
                              </FormGrid>
                            </SettingsSection>
                          )}

                          {availablePartners.length === 0 && (
                            <Message $color={colors.textSecondary || '#b9bbbe'}>
                              No eligible partners are currently available for this condition.
                              Another participant may need to complete their survey or receive their
                              first session assignment.
                            </Message>
                          )}

                          <FormActions>
                            <CreateButton
                              type="submit"
                              disabled={
                                creatingSession ||
                                !selectedPartnerId ||
                                availablePartners.length === 0
                              }
                              $background={colors.primaryButton || '#5865f2'}
                              $color={colors.textOnPrimary || '#ffffff'}
                            >
                              {creatingSession
                                ? 'Creating session...'
                                : `Create ${formatCondition(nextCondition)} session`}
                            </CreateButton>

                            <CancelButton
                              type="button"
                              onClick={closeAssignment}
                              disabled={creatingSession}
                              $border={colors.divider || '#4f545c'}
                              $color={colors.text || '#ffffff'}
                            >
                              Cancel
                            </CancelButton>
                          </FormActions>

                          {assignmentFeedback && (
                            <Feedback $success={assignmentFeedback.success}>
                              {assignmentFeedback.message}
                            </Feedback>
                          )}
                        </form>
                      </AssignmentPanel>
                    )}
                  </ParticipantRow>
                );
              })}
            </ParticipantList>
          )}

          {fullyAssignedParticipants.length > 0 && !isRefreshing && (
            <>
              <CompletedToggle
                type="button"
                onClick={() => setShowFullyAssigned((current) => !current)}
                $border={colors.divider || '#4f545c'}
                $color={colors.textSecondary || '#b9bbbe'}
                $hover={colors.background || '#202225'}
              >
                {showFullyAssigned ? 'Hide' : 'Show'} fully assigned participants (
                {fullyAssignedParticipants.length})
              </CompletedToggle>

              {showFullyAssigned && (
                <ParticipantList>
                  {fullyAssignedParticipants.map((participant) => (
                    <ParticipantRow key={participant.id} $border={colors.divider || '#4f545c'}>
                      <ParticipantTop>
                        <ParticipantInfo
                          $text={colors.text || '#ffffff'}
                          $secondary={colors.textSecondary || '#b9bbbe'}
                        >
                          <strong>{participant.email}</strong>
                          <span>Participant #{participant.id}</span>
                        </ParticipantInfo>

                        <Status $complete>All sessions assigned</Status>
                      </ParticipantTop>

                      <SessionHistory>
                        <ConditionBadge $ai={false}>Control assigned</ConditionBadge>
                        <ConditionBadge $ai>AI-mediated assigned</ConditionBadge>
                      </SessionHistory>
                    </ParticipantRow>
                  ))}
                </ParticipantList>
              )}
            </>
          )}
        </Card>
      </Section>

      <Section>
        <SectionHeader
          $text={colors.text || '#ffffff'}
          $secondary={colors.textSecondary || '#b9bbbe'}
        >
          <h2>All Game Sessions</h2>
          <p>
            A complete record of pairings, assigned conditions, and session status. Select any
            session to open its presentation.
          </p>
        </SectionHeader>

        <Card $background={colors.card || '#2f3136'} $border={colors.cardBorder || '#202225'}>
          {sessionsError ? (
            <Message $color="#fca5a5">
              Unable to load game sessions: {sessionsError.message}
            </Message>
          ) : sessionsLoading && sessions.length === 0 ? (
            <Message $color={colors.textSecondary || '#b9bbbe'}>Loading game sessions...</Message>
          ) : sessions.length === 0 ? (
            <Message $color={colors.textSecondary || '#b9bbbe'}>
              No game sessions have been created yet.
            </Message>
          ) : (
            <TableWrapper>
              <Table
                $text={colors.text || '#ffffff'}
                $secondary={colors.textSecondary || '#b9bbbe'}
                $border={colors.divider || '#4f545c'}
                $headerBackground={colors.background || '#202225'}
              >
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Participant 1</th>
                    <th>Participant 2</th>
                    <th>Condition</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      role="link"
                      tabIndex={0}
                      aria-label={`Open session ${session.id}: ${
                        session.userOne?.email || 'Unknown'
                      } and ${session.userTwo?.email || 'Unknown'}`}
                      onClick={() => handleOpenSession(session.id)}
                      onKeyDown={(event) => handleSessionRowKeyDown(event, session.id)}
                    >
                      <td>#{session.id}</td>
                      <td>{session.userOne?.email || 'Unknown'}</td>
                      <td>{session.userTwo?.email || 'Unknown'}</td>
                      <td>
                        <ConditionBadge $ai={session.condition === 'ai_mediated'}>
                          {formatCondition(session.condition)}
                        </ConditionBadge>
                      </td>
                      <td>
                        <Status $complete={session.status === 'completed'}>
                          {formatStatus(session.status)}
                        </Status>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </Card>
      </Section>

      <Section>
        <SectionHeader
          $text={colors.text || '#ffffff'}
          $secondary={colors.textSecondary || '#b9bbbe'}
        >
          <h2>Participant Progress</h2>
          <p>
            Track each participant's progress through the study. Post-game survey tracking has not
            yet been connected to the new session-based system.
          </p>
        </SectionHeader>

        <Card $background={colors.card || '#2f3136'} $border={colors.cardBorder || '#202225'}>
          {error ? (
            <Message $color="#fca5a5">{error}</Message>
          ) : sessionsError ? (
            <Message $color="#fca5a5">
              Unable to load game sessions: {sessionsError.message}
            </Message>
          ) : isRefreshing ? (
            <Message $color={colors.textSecondary || '#b9bbbe'}>
              Loading participant progress...
            </Message>
          ) : participants.length === 0 ? (
            <Message $color={colors.textSecondary || '#b9bbbe'}>
              No participants have registered yet.
            </Message>
          ) : (
            <TableWrapper>
              <ProgressTable
                $text={colors.text || '#ffffff'}
                $secondary={colors.textSecondary || '#b9bbbe'}
                $border={colors.divider || '#4f545c'}
                $headerBackground={colors.background || '#202225'}
              >
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>Pre-game Survey</th>
                    <th>AI Preparation</th>
                    <th>Control Conversation</th>
                    <th>Control Post-survey</th>
                    <th>AI Conversation</th>
                    <th>AI Post-survey</th>
                  </tr>
                </thead>

                <tbody>
                  {participants.map((participant) => {
                    const progress = getProgress(participant.id);

                    return (
                      <tr key={participant.id}>
                        <td>
                          <strong>{participant.email}</strong>
                        </td>

                        <td>
                          <ProgressCell complete={progress.preSurveyComplete} />
                        </td>

                        <td>
                          <ProgressCell complete={progress.aiPreparationComplete} />
                        </td>

                        <td>
                          <ProgressCell complete={progress.controlConversationComplete} />
                        </td>

                        <td>
                          <ProgressCell unavailable />
                        </td>

                        <td>
                          <ProgressCell complete={progress.aiConversationComplete} />
                        </td>

                        <td>
                          <ProgressCell unavailable />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </ProgressTable>
            </TableWrapper>
          )}
        </Card>
      </Section>
    </Page>
  );
}

export default AdminPage;
