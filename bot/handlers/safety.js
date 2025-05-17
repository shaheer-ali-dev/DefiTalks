module.exports = (bot, msg) => {
  const chatId = msg.chat.id;
  let safetyMessage = '🛡️ <b>DeFiTalk Security & Privacy Overview</b>\n\n';

  safetyMessage += 'Your safety is our top priority. Here\'s how we protect your data, and what you should always keep in mind while using DeFiTalk:\n\n';
  safetyMessage += '---\n\n';

  safetyMessage += '🔐 <b>Private Key Handling</b>\n\n';
  safetyMessage += '✔️ Your private key is <b>never stored in plain text</b>.  \n';
  safetyMessage += '✔️ It is encrypted using <b>AES-256</b>, a military-grade standard.  \n';
  safetyMessage += '✔️ Decryption happens <b>only when required</b> to perform an action — and only during that session.  \n';
  safetyMessage += '❌ No one (including developers) can access your raw private key.\n\n';

  safetyMessage += '🧾 <b>We NEVER:</b>\n\n';
  safetyMessage += '❌ Store your seed phrase  \n';
  safetyMessage += '❌ Share your wallet data with third parties  \n';
  safetyMessage += '❌ Send spam or unnecessary data requests  \n';
  safetyMessage += '❌ Track your activity beyond what’s required for your DeFi operations\n\n';

  safetyMessage += '📋 <b>User Responsibility</b>\n\n';
  safetyMessage += '✅ Only interact with the bot from trusted devices  \n';
  safetyMessage += '✅ Never share your private key in chat (outside the encrypted interface)  \n';
  safetyMessage += '✅ Always double-check transaction details  \n';
  safetyMessage += '✅ If you\'re unsure, ask the bot or check official sources\n\n';

  safetyMessage += '🚨 <b>In Case of Suspicious Activity</b>\n\n';
  safetyMessage += 'If you suspect:\n';
  safetyMessage += '• Any unauthorized action  \n';
  safetyMessage += '• A leaked private key  \n';
  safetyMessage += '• Fake DeFiTalk bots pretending to be official\n\n';
  safetyMessage += '→ Immediately:  \n';
  safetyMessage += '1. Revoke all permissions from your wallet  \n';
  safetyMessage += '2. Transfer funds to a fresh wallet  \n';
  safetyMessage += '3. Contact the dev(@DefiTalks_dev - telegram) if needed\n\n';

  safetyMessage += '⚠️ <b>Reminder:</b>  \n';
  safetyMessage += 'DeFi is powerful, but it also comes with risks.  \n';
  safetyMessage += 'DeFiTalk simplifies your journey — but <b>you</b> are the final decision maker.\n\n';

  safetyMessage += 'Stay alert, stay secure 🛡️';

  bot.sendMessage(chatId, safetyMessage, { parse_mode: 'HTML' });
};
