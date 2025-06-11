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
    "Generate a string of 70 random integers, where each integer is between 1 and {max_number}. The output should be a single line of numbers with no other text or characters."
);

const outputParser = new StringOutputParser();

const sequenceChain = sequencePrompt.pipe(model).pipe(outputParser);

app.get('/generate-sequence', async (req, res) => {
    try {
        const gridSize = parseInt(req.query.gridSize) || 3;
        const maxNumber = gridSize * gridSize;

        const response = await sequenceChain.invoke({ max_number: maxNumber });
        
        // Sanitize and validate the response from the AI
        const sanitizedSequence = response
            .replace(/\D/g, '') // Remove non-digits
            .split('')         // Convert to array of chars
            .map(Number)       // Convert to array of numbers
            .map(n => {
                // Convert 0 to a valid number and ensure numbers are in range
                if (n === 0 || n > maxNumber) {
                    return (Math.floor(Math.random() * maxNumber) + 1);
                }
                return n;
            }); // Replace invalid numbers with valid ones

        console.log('Grid Size:', gridSize);
        console.log('Max Number:', maxNumber);
        console.log('Raw Sequence:', sanitizedSequence);

        if (sanitizedSequence.length < 50) {
            // If we don't have enough numbers, generate more
            while (sanitizedSequence.length < 50) {
                sanitizedSequence.push(Math.floor(Math.random() * maxNumber) + 1);
            }
        }

        // Take the first 50 valid numbers and convert back to a string.
        const finalSequence = sanitizedSequence
            .slice(0, 50)
            .map(num => num.toString().padStart(2, '0'))
            .join('');
        console.log('Final Sequence:', finalSequence);

        res.json({ sequence: finalSequence });
    } catch (error) {
        console.error("Error generating sequence:", error);
        res.status(500).json({ error: 'Failed to generate sequence' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log('Access the game at http://localhost:3000/index.html');
}); 