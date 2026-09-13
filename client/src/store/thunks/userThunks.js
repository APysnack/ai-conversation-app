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
} from '../../utils/graphqlQueries';
import client from '../../utils/apolloClient';

// Async thunk for signing in
export const signInUser = createAsyncThunk(
  'user/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: SIGN_IN_MUTATION,
        variables: { email, password },
      });

      if (data.signIn.success) {
        await client.query({ query: GET_CURRENT_USER });
        return data.signIn.user;
      } else {
        return rejectWithValue(data.signIn.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for signing up
export const signUpUser = createAsyncThunk(
  'user/signUp',
  async ({ email, password, passwordConfirmation }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: SIGN_UP_MUTATION,
        variables: { email, password, passwordConfirmation },
      });

      if (data.signUp.success) {
        await client.query({ query: GET_CURRENT_USER });
        return data.signUp.user;
      } else {
        return rejectWithValue(data.signUp.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for signing out
export const signOutUser = createAsyncThunk('user/signOut', async (_, { rejectWithValue }) => {
  try {
    const { data } = await client.mutate({
      mutation: SIGN_OUT_MUTATION,
    });

    if (data.signOut.success) {
      return null;
    } else {
      return rejectWithValue(data.signOut.message);
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for fetching the current user
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_CURRENT_USER,
      });

      return data.currentUser;
    } catch (error) {
      return null;
    }
  }
);

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk('user/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await client.query({
      query: GET_USERS,
    });

    return {
      users: data.users,
      currentUserId: data.currentUser?.id,
    };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_SETTINGS_MUTATION,
        variables: { settings },
      });

      if (data.updateSettings.success) {
        await client.query({ query: GET_CURRENT_USER });
        return data.updateSettings.user;
      } else {
        return rejectWithValue(data.updateSettings.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const testGemini = createAsyncThunk(
  'user/testGemini',
  async ({ partnerUserId, systemSettings }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: TEST_GEMINI_MUTATION,
        variables: {
          partnerUserId,
          systemSettings,
        },
      });

      if (data.testGemini.success) {
        return data.testGemini.questions;
      } else {
        return rejectWithValue('Gemini request failed');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateImages = createAsyncThunk(
  'user/generateImages',
  async ({ gameId, partnerUserId, interactions, systemSettings }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: GENERATE_IMAGES_MUTATION,
        variables: {
          gameId,
          partnerUserId,
          interactions,
          systemSettings,
        },
      });

      if (data.generateImages.success) {
        return data.generateImages.images;
      } else {
        return rejectWithValue('Image generation failed');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
