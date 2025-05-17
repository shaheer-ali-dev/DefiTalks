const axios = require('axios');

const { AI_API_KEY, AI_API_URL } = require('../config/env'); 
// Function to send a prompt
async function summarizeNews(articles) {
    try {
const promptText =`
You are DeFiTalk, a professional DeFi journalist and assistant. 

Summarize the following crypto/DeFi news into a clean, readable digest in under 300 words. Keep it clear, insightful, and engaging. Structure it like a news bulletin with 📰 and 🔥 emojis where needed.

Only include the top 3–5 most important headlines. Keep formatting Markdown-friendly for Telegram.

Articles:
${articles.map((a, i) => `(${i + 1}) "${a.title}" by ${a.creator} — ${a.link}`).join('\n')}
`;
const response = await axios.post(AI_API_URL, {
    model: "gpt-4o-mini",
    messages: [
        {
            role: "user",
            content: promptText
        }
    ],
    stream: false,
    temperature: 0.7,
    max_tokens: 1500
}, {
    headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
});

const summary = response.data.choices[0].message.content;

return summary;

} catch (error) {
return
}
}

module.exports = { summarizeNews };