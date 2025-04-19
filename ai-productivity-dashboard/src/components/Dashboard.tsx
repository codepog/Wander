import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import MonthlyUsageChart from './MonthlyUsageChart';
import AIChat from './AIChat';

const Dashboard: React.FC = () => {
  const healthData = useSelector((state: RootState) => state.health);

  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Health & Productivity Dashboard</h1>
      
      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sleep</h3>
          <p className="text-3xl font-bold text-blue-600">{healthData.sleepTime} hrs</p>
          <p className="text-sm text-gray-500">Average daily sleep</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Steps</h3>
          <p className="text-3xl font-bold text-green-600">{healthData.stepCount}</p>
          <p className="text-sm text-gray-500">Daily average steps</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Workouts</h3>
          <p className="text-3xl font-bold text-purple-600">{healthData.workoutStatus}</p>
          <p className="text-sm text-gray-500">Weekly workouts</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">App Usage</h3>
          <p className="text-3xl font-bold text-orange-600">{healthData.appUsage} hrs</p>
          <p className="text-sm text-gray-500">Daily average</p>
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="mb-8">
        <AIChat />
      </div>
      
      {/* Monthly Usage Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Usage Trends</h2>
        <MonthlyUsageChart />
      </div>
    </div>
  );
};

export default Dashboard; 