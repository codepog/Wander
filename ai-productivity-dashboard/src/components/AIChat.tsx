import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { generateInsight } from '../store/insightSlice';
import { AppDispatch } from '../store';
import { chatService } from '../services/api';

const AIChat: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { insight, loading: insightLoading } = useSelector((state: RootState) => state.insight);
  
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'general' | 'health'>('general');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      if (mode === 'health') {
        // Use Redux for health insights
        dispatch(generateInsight(prompt));
      } else {
        // Use direct API call for general chat
        const result = await chatService.sendPrompt(prompt);
        setResponse(result);
      }
    } catch (err) {
      setError('Failed to get response from AI. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine if we're currently loading
  const isLoadingState = isLoading || (mode === 'health' && insightLoading);

  return (
    <div className="bg-white shadow rounded-lg p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setMode('general')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              mode === 'general'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            General Chat
          </button>
          <button
            onClick={() => setMode('health')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              mode === 'health'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Health Insights
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            {mode === 'health' 
              ? 'Ask a question about your health data' 
              : 'Ask the AI assistant anything'}
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={mode === 'health' 
              ? "e.g., How can I improve my sleep quality?" 
              : "Type your question here..."}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoadingState || !prompt.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoadingState || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoadingState ? 'Processing...' : 'Ask AI'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {mode === 'health' ? (
        <>
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
        </>
      ) : (
        response && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Response:</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              {response}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AIChat; 