import express from 'express';
import cors from 'cors';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Llama model
let session;

async function initializeLlama() {
  try {
    const model = new LlamaModel({
      modelPath: process.env.MODEL_PATH || './models/llama-2-7b-chat.gguf',
      contextSize: 2048,
      batchSize: 512,
    });
    const context = new LlamaContext({ model });
    session = new LlamaChatSession({ context });
    console.log('Llama model initialized successfully');
  } catch (error) {
    console.error('Error initializing Llama:', error);
  }
}

// Initialize Llama on startup
initializeLlama();

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!session) {
      return res.status(500).json({ error: 'Llama model not initialized' });
    }

    const response = await session.prompt(prompt);
    res.json({ response });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', llamaInitialized: !!session });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 