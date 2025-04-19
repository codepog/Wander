const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// POST endpoint for getting insights
app.post('/get-insights', async (req, res) => {
    try {
        const timeTrackingData = req.body;
        
        // Construct the prompt for LLaMA
        const prompt = `Analyze the following time tracking data and provide productivity insights:
        ${JSON.stringify(timeTrackingData, null, 2)}
        
        Please provide:
        1. Key productivity patterns
        2. Areas for improvement
        3. Specific recommendations
        4. Overall productivity score (1-10)`;

        // Call Ollama LLaMA API
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3',
                prompt: prompt,
                stream: false
            })
        });

        const data = await response.json();
        
        // Send the LLaMA response back to the frontend
        res.json({
            insights: data.response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 