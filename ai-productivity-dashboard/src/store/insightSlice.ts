import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface InsightState {
  insight: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: InsightState = {
  insight: null,
  loading: false,
  error: null,
};

export const generateInsight = createAsyncThunk(
  'insight/generate',
  async (question: string) => {
    // Simulate API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple mock responses based on keywords
    const q = question.toLowerCase();
    if (q.includes('sleep')) {
      return `Based on your data, you're getting 7.2 hours of sleep but using your phone for 1.5 hours in bed. Try to reduce phone usage before bed to improve sleep quality.`;
    } 
    if (q.includes('step')) {
      return `You've taken 8500 steps today. The recommended daily step count is 10,000. You're 1500 steps away from your goal.`;
    } 
    if (q.includes('workout')) {
      return `Great job completing your workout today! Keep up the good work!`;
    } 
    if (q.includes('habit')) {
      return `You've spent 3.5 hours on your phone today. Consider setting app usage limits to maintain a healthy balance.`;
    } 
    
    return `I can help you analyze your health data. Try asking about your sleep, steps, workouts, or app usage.`;
  }
);

const insightSlice = createSlice({
  name: 'insight',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateInsight.fulfilled, (state, action) => {
        state.loading = false;
        state.insight = action.payload;
      })
      .addCase(generateInsight.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to generate insight';
      });
  },
});

export default insightSlice.reducer; 