import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
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
