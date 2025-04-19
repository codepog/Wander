import { configureStore } from '@reduxjs/toolkit';
import healthReducer from './healthSlice';
import insightReducer from './insightSlice';

export const store = configureStore({
  reducer: {
    health: healthReducer,
    insight: insightReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 