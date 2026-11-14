import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      isAdmin
      settings
      createdAt
      updatedAt
    }
  }
`;

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        createdAt
        updatedAt
      }
      token
    }
  }
`;

export const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut {
      success
      message
    }
  }
`;

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!, $passwordConfirmation: String!) {
    signUp(email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
      success
      message
      user {
        id
        email
        createdAt
        updatedAt
      }
      token
    }
  }
`;

export const UPDATE_SETTINGS_MUTATION = gql`
  mutation UpdateSettings($settings: JSON!) {
    updateSettings(settings: $settings) {
      success
      message
      user {
        id
        email
        settings
        createdAt
        updatedAt
      }
    }
  }
`;

export const TEST_GEMINI_MUTATION = gql`
  mutation TestGemini($participationId: ID!) {
    testGemini(participationId: $participationId) {
      success
      questions
    }
  }
`;

export const GENERATE_IMAGES_MUTATION = gql`
  mutation GenerateImages($gameId: String!, $partnerUserId: String!, $interactions: [JSON!]!) {
    generateImages(gameId: $gameId, partnerUserId: $partnerUserId, interactions: $interactions) {
      success
      images
    }
  }
`;

export const UPDATE_GAME_PARTICIPATION_MUTATION = gql`
  mutation UpdateGameParticipation(
    $participationId: ID!
    $preparationData: JSON
    $postGameSurvey: JSON
    $conversationCompleted: Boolean
  ) {
    updateGameParticipation(
      participationId: $participationId
      preparationData: $preparationData
      postGameSurvey: $postGameSurvey
      conversationCompleted: $conversationCompleted
    ) {
      success
      message
      participation {
        id
        preparationData
        postGameSurvey
        conversationCompletedAt
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      settings
    }
    currentUser {
      id
    }
  }
`;

export const GET_MY_GAME_PARTICIPATIONS = gql`
  query GetMyGameParticipations {
    myGameParticipations {
      id
      user {
        id
        email
      }
      gameSession {
        id
        condition
        status
        userOne {
          id
          email
        }
        userTwo {
          id
          email
        }
        gameParticipations {
          id
          user {
            id
            email
          }
          generatedImages
          conversationCompletedAt
        }
      }
      preparationData
      generatedImages
      postGameSurvey
      conversationCompletedAt
    }
  }
`;

export const CREATE_GAME_SESSION_MUTATION = gql`
  mutation CreateGameSession(
    $userOneId: ID!
    $userTwoId: ID!
    $condition: String!
    $systemSettings: JSON
  ) {
    createGameSession(
      userOneId: $userOneId
      userTwoId: $userTwoId
      condition: $condition
      systemSettings: $systemSettings
    ) {
      success
      message
      gameSession {
        id
        condition
        status
        systemSettings
        userOne {
          id
          email
        }
        userTwo {
          id
          email
        }
      }
    }
  }
`;

export const GET_ALL_GAME_SESSIONS = gql`
  query GetAllGameSessions {
    allGameSessions {
      id
      condition
      status

      userOne {
        id
        email
      }

      userTwo {
        id
        email
      }

      gameParticipations {
        id
        user {
          id
          email
        }
        generatedImages
        conversationCompletedAt
        postGameSurvey
      }
    }
  }
`;

export const GET_GAME_SESSION_FOR_PRESENTATION = gql`
  query GetGameSessionForPresentation($id: ID!) {
    gameSessionForPresentation(id: $id) {
      id
      condition
      status
      userOne {
        id
        email
      }
      userTwo {
        id
        email
      }
      gameParticipations {
        id
        user {
          id
          email
        }
        generatedImages
        preparationData
        conversationCompletedAt
      }
    }
  }
`;

export const COMPLETE_GAME_SESSION_MUTATION = gql`
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
