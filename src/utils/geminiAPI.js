// Gemini AI API Utility
// Note: This exposes the API key in client-side code
// For production, use a backend proxy server

const GEMINI_API_KEY = 'AIzaSyAiTizLGy0NX_OOl0opX-FCCVt27KumZP4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

export const generateWithGemini = async (prompt, options = {}) => {
    const {
        temperature = 0.7,
        maxTokens = 1024,
    } = options;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature,
                    maxOutputTokens: maxTokens,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API request failed');
        }

        const data = await response.json();

        // Extract text from response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return { success: true, text };
    } catch (error) {
        console.error('Gemini API Error:', error);
        return { success: false, error: error.message };
    }
};

export default generateWithGemini;
