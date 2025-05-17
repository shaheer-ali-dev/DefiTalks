
// Function to simulate typing before sending a message
async function sendHumanizedMessage(bot, chatId, text) {
    // Calculate typing time based on message length
    const baseDelay = 800; // 0.8 sec minimum
    const extraPerChar = 10; // 30 ms per character
    
    let typingTime = baseDelay + (text.length * extraPerChar);

    // Clamp typing time to a max limit (optional)
    typingTime = Math.min(typingTime, 3000); // Max 3 sec typing

    // Tell Telegram the bot is typing
    await bot.sendChatAction(chatId, 'typing');

    // Wait before sending actual message
    await new Promise(resolve => setTimeout(resolve, typingTime));

    // Send the message
    await bot.sendMessage(chatId, text ,{ parse_mode: 'Markdown' });
}


module.exports = {
    sendHumanizedMessage
};
