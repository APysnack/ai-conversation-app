import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  GET_CURRENT_USER,
  SIGN_IN_MUTATION,
  SIGN_UP_MUTATION,
  SIGN_OUT_MUTATION,
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
        // Refetch current user to update Apollo cache
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
        // Refetch current user to update Apollo cache
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

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_CURRENT_USER,
      });

      return data.currentUser;
    } catch (error) {
      // User is not authenticated, return null instead of rejecting
      return null;
    }
  }
);
