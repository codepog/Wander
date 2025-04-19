import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import InsightGenerator from './InsightGenerator';
import MonthlyUsageChart from './MonthlyUsageChart';

// Define the HealthState interface
interface HealthState {
  appUsage: number;
  stepCount: number;
  sleepTime: number;
  phoneInBedTime: number;
  workoutStatus: string;
}

const Dashboard: React.FC = () => {
  const healthData = useSelector((state: RootState) => state.health) as HealthState;
  const { appUsage, stepCount, sleepTime, phoneInBedTime, workoutStatus } = healthData;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full py-6 px-4">
        <div className="py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Health Dashboard</h1>
          
          {/* Today's Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* App Usage Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">App Usage</h3>
                <p className="mt-1 text-3xl font-semibold text-indigo-600">{appUsage} hours</p>
              </div>
            </div>

            {/* Step Count Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Step Count</h3>
                <p className="mt-1 text-3xl font-semibold text-green-600">{stepCount} steps</p>
              </div>
            </div>

            {/* Sleep Time Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Sleep Time</h3>
                <p className="mt-1 text-3xl font-semibold text-blue-600">{sleepTime} hours</p>
              </div>
            </div>

            {/* Phone in Bed Time Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Phone in Bed Time</h3>
                <p className="mt-1 text-3xl font-semibold text-purple-600">{phoneInBedTime} hours</p>
              </div>
            </div>

            {/* Workout Status Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Workout Status</h3>
                <p className="mt-1 text-3xl font-semibold text-red-600">{workoutStatus}</p>
              </div>
            </div>
          </div>

          {/* Main Content Area - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Monthly Usage Chart */}
            <div className="lg:col-span-3">
              <MonthlyUsageChart />
            </div>
            
            {/* Right Column - Question Input and AI Response */}
            <div className="lg:col-span-1">
              <InsightGenerator />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 