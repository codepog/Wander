const API_BASE_URL = 'http://localhost:3000/api';

export const chatService = {
  async sendPrompt(prompt: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to send prompt');
    }

    const data = await response.json();
    return data.response;
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.status === 'ok' && data.llamaInitialized;
    } catch {
      return false;
    }
  },
}; 