import { createSlice } from '@reduxjs/toolkit';

interface HealthState {
  appUsage: number;
  stepCount: number;
  sleepTime: number;
  phoneInBedTime: number;
  workoutStatus: string;
}

const initialState: HealthState = {
  appUsage: 3.5,
  stepCount: 8500,
  sleepTime: 7.2,
  phoneInBedTime: 1.5,
  workoutStatus: 'Completed',
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {},
});

export default healthSlice.reducer; 