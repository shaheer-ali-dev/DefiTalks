// helpCommand.js

module.exports = (bot, msg) => {
  const chatId = msg.chat.id;
  let helpMessage = '🛠️ *Welcome to DeFiTalk – Your Smart DeFi Assistant*\n\n';

  helpMessage += 'DeFiTalk is your AI-powered buddy that makes DeFi feel *natural* 💬\n';
  helpMessage += 'Unlike other bots, *you don’t have to remember strict command formats*.\n';
  helpMessage += 'Just type like you’re chatting — and I’ll do the rest 😉\n\n';

  helpMessage += 'Here’s what I can help you with:\n\n';

  helpMessage += '💼 *Automatic Wallet Management*\n';
  helpMessage += '→ Add or remove wallets instantly\n';
  helpMessage += '→ Supports multiple wallets per user\n';
  helpMessage += '→ Example: _“Add wallet XYZ...”_, _“Remove my second wallet...”_\n\n';

  helpMessage += '🔄 *Swap History Tracker*\n';
  helpMessage += '→ Can swap transactions\n';
  helpMessage += '→ Example: _“Swap 1 SOL to Radium”_\n\n';


  helpMessage += '📥 *Staking Dashboard*\n';
  helpMessage += '→ Can perform staking of Solana\n';
  helpMessage += 'Unstaking is temporarily disabled duo to epoch timing logic. Coming Soon'
  helpMessage += '→ Example: _“Stake 1 SOL”_\n\n';

  helpMessage += '💵 *Stablecoin Actions*\n';
  helpMessage += '→ deposits/withdrawals of stablecoins like USDC, USDT, DAI and SOL\n';
  helpMessage += '→ Example: _“Deposit 1 SOL to XYZ wallet”_\n\n';

  helpMessage += '📈 *Token Price Checker*\n';
  helpMessage += '→ Get live token prices from top Solana DEXs\n';
  helpMessage += '→ Example: _“Price of SOL”_, _“Check ORCA price”_\n\n';

  helpMessage += '📰 *Crypto News Fetcher*\n';
  helpMessage += '→ Stay updated with top headlines from the crypto world\n';
  helpMessage += '→ Example: _“Show crypto news”_ or _“Any BTC updates?”_\n\n';

  helpMessage += '🤖 *AI-Powered Conversations*\n';
  helpMessage += '→ No strict command order needed\n';
  helpMessage += '→ You can ask: _“How is my portfolio?”_ or _“Which tokens did I swap last week?”_\n\n';

  helpMessage += '---\n\n';

  helpMessage += '🧩 *Explore more:*\n';
  helpMessage += '- `/faq` — Most asked questions\n';
  helpMessage += '- `/safety` — Security & privacy info\n\n';

  helpMessage += 'Let’s get started!\n';
  helpMessage += 'Just message me like you\'re chatting with a DeFi friend 😄';

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
};
