import React, { useState } from 'react';
import { chatService } from '../services/api';

export const Chat: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await chatService.sendPrompt(prompt);
      setResponse(result);
    } catch (err) {
      setError('Failed to get response from AI. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AI Chat</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your question here..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading || !prompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Processing...' : 'Ask AI'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Response:</h3>
          <div className="p-3 bg-gray-50 rounded-md">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}; 