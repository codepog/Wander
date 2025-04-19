import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for the past month
const generateMonthlyData = () => {
  const days = 30;
  const data = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      appUsage: Math.floor(Math.random() * 3) + 2, // Random value between 2-4 hours
      stepCount: Math.floor(Math.random() * 5000) + 5000, // Random value between 5000-10000 steps
      sleepTime: (Math.random() * 2 + 6).toFixed(1), // Random value between 6-8 hours
      phoneInBedTime: (Math.random() * 1.5).toFixed(1), // Random value between 0-1.5 hours
    });
  }
  
  return data;
};

const monthlyData = generateMonthlyData();

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const MonthlyUsageChart: React.FC = () => {
  // Prepare data for charts
  const labels = monthlyData.map(day => day.date);
  
  // App Usage and Phone in Bed Time Chart
  const screenTimeData = {
    labels,
    datasets: [
      {
        label: 'App Usage (hrs)',
        data: monthlyData.map(day => day.appUsage),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Phone in Bed (hrs)',
        data: monthlyData.map(day => parseFloat(day.phoneInBedTime)),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  // Step Count Chart
  const stepData = {
    labels,
    datasets: [
      {
        label: 'Steps',
        data: monthlyData.map(day => day.stepCount),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
    ],
  };
  
  // Sleep Time Chart
  const sleepData = {
    labels,
    datasets: [
      {
        label: 'Sleep (hrs)',
        data: monthlyData.map(day => parseFloat(day.sleepTime)),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  // Calculate averages
  const avgAppUsage = (monthlyData.reduce((sum, day) => sum + day.appUsage, 0) / monthlyData.length).toFixed(1);
  const avgSteps = Math.round(monthlyData.reduce((sum, day) => sum + day.stepCount, 0) / monthlyData.length);
  const avgSleep = (monthlyData.reduce((sum, day) => sum + parseFloat(day.sleepTime), 0) / monthlyData.length).toFixed(1);
  const avgPhoneInBed = (monthlyData.reduce((sum, day) => sum + parseFloat(day.phoneInBedTime), 0) / monthlyData.length).toFixed(1);

  return (
    <div className="bg-white shadow rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Usage Overview</h2>
      
      <div className="grid grid-cols-1 gap-8 h-[calc(100%-3rem)]">
        {/* Screen Time Chart */}
        <div className="bg-gray-50 p-4 rounded-lg h-[300px]">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Screen Time</h3>
          <div className="h-[calc(100%-2rem)]">
            <Line options={chartOptions} data={screenTimeData} />
          </div>
        </div>
        
        {/* Step Count Chart */}
        <div className="bg-gray-50 p-4 rounded-lg h-[300px]">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Step Count</h3>
          <div className="h-[calc(100%-2rem)]">
            <Bar options={chartOptions} data={stepData} />
          </div>
        </div>
        
        {/* Sleep Time Chart */}
        <div className="bg-gray-50 p-4 rounded-lg h-[300px]">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sleep Time</h3>
          <div className="h-[calc(100%-2rem)]">
            <Line options={chartOptions} data={sleepData} />
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Monthly Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Average App Usage</p>
            <p className="text-xl font-semibold text-indigo-600">
              {avgAppUsage} hrs/day
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Average Steps</p>
            <p className="text-xl font-semibold text-green-600">
              {avgSteps} steps/day
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Average Sleep</p>
            <p className="text-xl font-semibold text-blue-600">
              {avgSleep} hrs/day
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Average Phone in Bed</p>
            <p className="text-xl font-semibold text-purple-600">
              {avgPhoneInBed} hrs/day
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyUsageChart; 