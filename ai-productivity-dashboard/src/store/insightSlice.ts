import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface InsightState {
  insight: string;
  loading: boolean;
  error: string | null;
}

const initialState: InsightState = {
  insight: '',
  loading: false,
  error: null,
};

export const generateInsight = createAsyncThunk(
  'insight/generate',
  async (question: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: question
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error in generateInsight:', error);
      throw error;
    }
  }
);

const insightSlice = createSlice({
  name: 'insight',
  initialState,
  reducers: {
    clearInsight: (state) => {
      state.insight = '';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.insight = '';
      })
      .addCase(generateInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.insight = action.payload;
      })
      .addCase(generateInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate insight';
        console.error('Rejected with error:', action.error);
      });
  },
});

export const { clearInsight } = insightSlice.actions;
export default insightSlice.reducer; 