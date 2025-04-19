import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { generateInsight } from '../store/insightSlice';
import { AppDispatch } from '../store';

const AIChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { insight, loading: insightLoading } = useSelector((state: RootState) => state.insight);
  
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setError(null);

    try {
      dispatch(generateInsight(prompt));
    } catch (err) {
      setError('Failed to get response from AI. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 h-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">AI Health Assistant</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Ask a question about your health data
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., How can I improve my sleep quality?"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={insightLoading || !prompt.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            insightLoading || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {insightLoading ? 'Processing...' : 'Ask AI'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {insight && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">AI Response</h3>
          <div className="mt-2 p-4 bg-gray-50 rounded-md">
            <p className="text-gray-700">{insight}</p>
          </div>
        </div>
      )}
      
      {!insight && !insightLoading && (
        <div className="mt-6 text-center text-gray-500">
          <p>Ask a question to get AI-powered insights about your health data.</p>
          <p className="mt-2 text-sm">Try asking about sleep, steps, workouts, or app usage.</p>
        </div>
      )}
    </div>
  );
};

export default AIChat; 