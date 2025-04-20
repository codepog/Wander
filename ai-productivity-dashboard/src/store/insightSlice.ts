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
  async (question: string, { dispatch }) => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama2",
          prompt: question,
          stream: true  // Enable streaming
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let responseText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the stream chunk and split by newlines
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        // Process each line
        for (const line of lines) {
          if (line.trim()) {
            try {
              const jsonResponse = JSON.parse(line);
              if (jsonResponse.response) {
                responseText += jsonResponse.response;
                // Dispatch an action to update the UI with the partial response
                dispatch(appendResponse(jsonResponse.response));
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }

      return responseText;
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
    },
    appendResponse: (state, action) => {
      state.insight += action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInsight.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.insight = '';
      })
      .addCase(generateInsight.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(generateInsight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate insight';
        console.error('Rejected with error:', action.error);
      });
  },
});

export const { clearInsight, appendResponse } = insightSlice.actions;
export default insightSlice.reducer; 