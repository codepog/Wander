import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { generateInsight } from '../store/insightSlice';
import { AppDispatch } from '../store';

const InsightGenerator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { insight, loading } = useSelector((state: RootState) => state.insight);
  const [question, setQuestion] = useState('');

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      dispatch(generateInsight(question));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 h-full">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Health Insights</h2>
      
      <form onSubmit={handleQuestionSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Ask a question about your health data
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="question"
              id="question"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., How can I improve my sleep quality?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Thinking...' : 'Ask'}
            </button>
          </div>
        </div>
      </form>

      {insight && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">AI Response</h3>
          <div className="mt-2 p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700">{insight}</p>
          </div>
        </div>
      )}
      
      {!insight && !loading && (
        <div className="mt-6 text-center text-gray-500">
          <p>Ask a question to get AI-powered insights about your health data.</p>
          <p className="mt-2 text-sm">Try asking about sleep, steps, workouts, or app usage.</p>
        </div>
      )}
    </div>
  );
};

export default InsightGenerator; 