const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { BOT_TOKEN } = require('../config/env');
const { sendHumanizedMessage } = require('./utils/humanizer');
const connectDB = require('../database/db');
// Import command handlers
connectDB();
const startCommand = require('./handlers/start');
const helpCommand = require('./handlers/help')
const safetyCommand = require('./handlers/safety')
const faqCommand = require('./handlers/faq')
const { handleAIResponse } = require('./handlers/aiResponseHandler');
const {sendPromptToAI} = require("../Artificial_Intelligence/ArtificalIntelligence_Parser")

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// /start command
bot.onText(/\/start/, (msg) => startCommand(bot, msg));
bot.onText(/\/help/, (msg) => helpCommand(bot, msg));
bot.onText(/\/safety/, (msg) => safetyCommand(bot, msg));
bot.onText(/\/faq/, (msg) => faqCommand(bot, msg));

// Handle any message
bot.on('message',async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const userId = msg.from.id;
  // Ignore /commands (we already handle /start separately)
  if (text.startsWith('/')) return;

  const aiResponse = await sendPromptToAI(text);


// inside your bot.on('message') handler
if (aiResponse) {
    await handleAIResponse(bot , userId , chatId, aiResponse);
} else {
    await sendHumanizedMessage(bot, chatId, `⚠️ Sorry, I couldn't process your request right now.`);
}

});

module.exports = bot;
