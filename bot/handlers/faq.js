module.exports = (bot, msg) => {
  const chatId = msg.chat.id;
  let faqMessage = '🤖 *DeFiTalk – FAQ Section*\n\n';

  faqMessage += 'Here are the most common questions and answers about how DeFiTalk works:\n\n';
  faqMessage += '---\n\n';

  faqMessage += '🔐 *Do you store my private key?*  \n';
  faqMessage += '→ Yes — but securely.  \n';
  faqMessage += 'Your private key is **encrypted using military-grade AES encryption** and stored securely in our system.  \n';
  faqMessage += 'No one can view or decrypt it without your explicit session-based permission.\n\n';

  faqMessage += '💸 *Can I lose money using this bot?*  \n';
  faqMessage += '→ Yes, just like any DeFi platform.  \n';
  faqMessage += 'This bot executes real transactions like swapping, staking etc. \n';
  faqMessage += '*Always double-check the token and price data before confirming any action.*\n\n';

  faqMessage += '💼 *How does wallet management work?*  \n';
  faqMessage += '→ You can add, view, and fetch balance of wallets at any time.  \n';
  faqMessage += 'The bot handles multiple wallets and keeps your portfolio organized.  \n';
  faqMessage += 'You don\'t need to manually enter wallet addresses every time.\n\n';

  faqMessage += '📌 *How do I perform a token swap?*\n';
  faqMessage += 'To swap tokens using DeFiTalk:\n';
  faqMessage += '1. Simply say something like:  \n';
  faqMessage += '   ➤ `Swap 2 SOL to USDC`  \n';
  faqMessage += '2. The bot will guide you with real-time prices and confirmation prompts.  \n';
  faqMessage += '✔️ No need for complex commands — just type naturally!\n';



  faqMessage += '📌 *How do I stake my tokens?*\n';
  faqMessage += 'To stake on Solana:\n';
  faqMessage += '1. Just say:  \n';
  faqMessage += '   ➤ `Stake 3 SOL`  \n';
  faqMessage += 'Staking is fully operational and tested — unstaking will be patched post-hackathon based on validator timing.  \n';
  faqMessage += '✔️ You can also check your staking status using the "portfolio" feature.\n';


  faqMessage += '📊 *What does the Portfolio feature show?*  \n';
  faqMessage += '→ It provides a full breakdown of each wallet:  \n';
  faqMessage += '• Token holdings  \n';
  faqMessage += '• Swap history with P&L  \n';
  faqMessage += '• Active stakes  \n';

  faqMessage += '💵 *Which stablecoins are supported?*  \n';
  faqMessage += '→ Solana can be deposit for now.\n';
  faqMessage += '→ deposits/withdrawals of other stable coins will be added soon!\n';
  faqMessage += 'You can deposits/withdrawals Solana to other wallets.\n\n';

  faqMessage += '📈 *How accurate is token pricing?*  \n';
  faqMessage += '→ Token prices are pulled live from Solana DEXs like Orca, Raydium, and BirdEye API.  \n';
  faqMessage += 'Prices may vary slightly based on slippage and market volatility.\n\n';

  faqMessage += '🔥 *What are “Hot Tokens”?*  \n';
  faqMessage += '→ Trending tokens based on real-time trade volume and user interest.  \n';
  faqMessage += 'Helps you find opportunities.\n\n';

  faqMessage += '📰 *Where does the Crypto News come from?*  \n';
  faqMessage += '→ We fetch news from top crypto sources and APIs.  \n';
  faqMessage += 'Get headlines, summaries, and direct links to verified updates.\n\n';

  faqMessage += '🧠 *Do I need to use strict commands like other bots?*  \n';
  faqMessage += '→ Nope 😎  \n';
  faqMessage += 'This bot is powered by AI. You can just type _“What’s my portfolio look like?”_ or _“Stake 1 SOL”_, and it’ll understand.\n\n';

  faqMessage += '📵 *Can I use the bot without sharing a private key?*  \n';
  faqMessage += '→ Yes, but only for passive features like news, price checks, or public wallet viewing.  \n';
  faqMessage += 'Features like swap, staking **require your encrypted key**.\n\n';

  faqMessage += 'Need more help? Just type `/help` or ask the bot anything.';

  bot.sendMessage(chatId, faqMessage, { parse_mode: 'Markdown' });
};
