
module.exports = (bot, msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `👋 Hey! Welcome to DeFiTalk — your personal DeFi assistant.
  I'm here to guide you through swaps, track your assets, and share market insights.
  Just type *anything* — I'm listening! 🔥`;
  
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
  };
  