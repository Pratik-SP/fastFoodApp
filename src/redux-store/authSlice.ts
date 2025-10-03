import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../type';
import { getCurrentUser } from '../app/lib/appwrite';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

export const fetchAuthenticatedUser = createAsyncThunk<User | null>(
  'auth/fetchAuthenticatedUser',
  async (_, { rejectWithValue }) => {
    try {
      const userDoc = await getCurrentUser();
      if (!userDoc) return null;

      const user = userDoc as unknown as User;
      return user || null;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: state => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAuthenticatedUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        fetchAuthenticatedUser.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.isAuthenticated = !!action.payload;
          state.user = action.payload;
          state.isLoading = false;
        },
      )
      .addCase(fetchAuthenticatedUser.rejected, state => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
