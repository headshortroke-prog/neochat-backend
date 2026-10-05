const axios = require('axios');

const ALLOWED_MODELS = [
    'llama-3.3-70b-versatile',
    'openai/gpt-oss-120b',
    'llama-3.2-90b-vision-preview'
];

const processChat = async (req, res) => {
    try {
        const { messages, model, temperature, isTitleGeneration } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: "Messages array is required." });
        }

        const finalModel = ALLOWED_MODELS.includes(model) ? model : 'llama-3.3-70b-versatile';

        let finalMessages = [];
        
        if (isTitleGeneration) {
            finalMessages = [
                { role: "system", content: "Generate a short, catchy, 3 to 5 word title for the following message. Respond ONLY with the title. Do not use quotes, special characters, or extra words." },
                ...messages
            ];
        } else {
            finalMessages = [
                { role: 'system', content: 'You are NeoChat AI, a highly intelligent conversational assistant. Be helpful, professional, and concise.' },
                ...messages 
            ];
        }

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: finalModel,
                messages: finalMessages,
                temperature: temperature || 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json(response.data);

    } catch (error) {
        console.error("Groq API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: "Failed to process chat with AI.",
            details: error.response ? error.response.data : error.message
        });
    }
};

module.exports = { processChat };