import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  GET_CURRENT_USER,
  GET_USERS,
  SIGN_IN_MUTATION,
  SIGN_UP_MUTATION,
  SIGN_OUT_MUTATION,
  UPDATE_SETTINGS_MUTATION,
  TEST_GEMINI_MUTATION,
  GENERATE_IMAGES_MUTATION,
  CREATE_GAME_SESSION_MUTATION,
} from '../../utils/graphqlQueries';

import client from '../../utils/apolloClient';

// Fetch the complete current user, including isAdmin.
const getCurrentUser = async () => {
  const { data } = await client.query({
    query: GET_CURRENT_USER,
    fetchPolicy: 'network-only',
  });

  return data.currentUser;
};

// Sign in
export const signInUser = createAsyncThunk(
  'user/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { email, password },
      });

      if (!data.signIn.success) {
        return rejectWithValue(data.signIn.message);
      }

      return await getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sign up
export const signUpUser = createAsyncThunk(
  'user/signUp',
  async ({ email, password, passwordConfirmation }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: SIGN_UP_MUTATION,
        variables: { email, password, passwordConfirmation },
      });

      if (!data.signUp.success) {
        return rejectWithValue(data.signUp.message);
      }

      return await getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Sign out
export const signOutUser = createAsyncThunk('user/signOut', async (_, { rejectWithValue }) => {
  try {
    const { data } = await client.mutate({
      mutation: SIGN_OUT_MUTATION,
    });

    if (data.signOut.success) {
      return null;
    }

    return rejectWithValue(data.signOut.message);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Fetch current user
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUser();
    } catch (error) {
      return null;
    }
  }
);

// Fetch all users
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await client.query({
      query: GET_USERS,
      fetchPolicy: 'network-only',
    });

    return {
      users: data.users,
      currentUserId: data.currentUser?.id,
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Create a game session between two participants (admin only).
export const createGameSession = createAsyncThunk(
  'user/createGameSession',
  async ({ userOneId, userTwoId, condition, systemSettings }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: CREATE_GAME_SESSION_MUTATION,
        variables: {
          userOneId,
          userTwoId,
          condition,
          systemSettings,
        },
      });

      if (!data.createGameSession.success) {
        return rejectWithValue(data.createGameSession.message);
      }

      return data.createGameSession.gameSession;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user settings
export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_SETTINGS_MUTATION,
        variables: { settings },
      });

      if (!data.updateSettings.success) {
        return rejectWithValue(data.updateSettings.message);
      }

      return await getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Generate Gemini questions
export const testGemini = createAsyncThunk(
  'user/testGemini',
  async ({ participationId }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: TEST_GEMINI_MUTATION,
        variables: {
          participationId,
        },
      });

      if (data.testGemini.success) {
        return data.testGemini.questions;
      }

      return rejectWithValue('Gemini question generation failed');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Generate images
export const generateImages = createAsyncThunk(
  'user/generateImages',
  async ({ gameId, partnerUserId, interactions }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: GENERATE_IMAGES_MUTATION,
        variables: {
          gameId,
          partnerUserId,
          interactions,
        },
      });

      if (data.generateImages.success) {
        return data.generateImages.images;
      }

      return rejectWithValue('Image generation failed');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
