const express = require('express');
const path = require('path');
require('dotenv').config();
const { ChatOpenAI } = require("@langchain/openai");
// Use langchain to handle api calls
const { PromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

const model = new ChatOpenAI({
    modelName: "deepseek-chat",
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
        baseURL: "https://api.deepseek.com/v1",
    }
});

const sequencePrompt = PromptTemplate.fromTemplate(
    "Generate a string of 50 random integers, where each integer is between 1 and {max_number}. Do not include any other text, characters, or spaces. Just the numbers."
);

const outputParser = new StringOutputParser();

const sequenceChain = sequencePrompt.pipe(model).pipe(outputParser);

app.get('/generate-sequence', async (req, res) => {
    try {
        const gridSize = parseInt(req.query.gridSize) || 3;
        const maxNumber = gridSize * gridSize;

        const response = await sequenceChain.invoke({ max_number: maxNumber });
        
        const sequence = response.replace(/\D/g, '');
        if (sequence.length < 50) { // Ensure length is 50
            throw new Error("Generated sequence was too short.");
        }

        res.json({ sequence: sequence.substring(0, 50) });
    } catch (error) {
        console.error("Error generating sequence:", error);
        res.status(500).json({ error: 'Failed to generate sequence' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log('Access the game at http://localhost:3000/index.html');
}); 