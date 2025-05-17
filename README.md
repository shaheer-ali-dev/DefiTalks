# 🤖 DeFiTalk – Your AI-Powered DeFi Assistant on Telegram

Welcome to DeFiTalk – a fully conversational, AI-native DeFi bot that brings powerful on-chain functionality directly into Telegram.  
Swap tokens, stake SOL, analyze portfolios, get market insights – all through natural language.  
No clunky UIs. No steep learning curve. Just chat and DeFi.

---

## 🚀 Built for the Solana Hackathon – Solo Project

- 💻 Developer: Shaheer (solo)
- ⏱️ Timeline: Built in 14 days
- 💬 Powered by OpenAI NLP + real Solana transactions
- 🧠 Designed to simplify DeFi for the next billion users

---

## 🎯 Features

| Category            | Description |
|---------------------|-------------|
| 🔄 Swap          | Instantly swap SPL tokens via conversational command |
| 🧠 AI-Powered UX | Built-in NLP understands human language like “Swap 2 SOL to USDC” |
| 🪙 Staking       | Stake SOL to top validators with smart delegation |
| 🧾 Portfolio View| View P&L for all wallets and tokens, including staked SOL |
| 💼 Wallet Manager| Auto-generates secure wallets; manage multiple accounts |
| 📈 Token Prices  | Real-time price fetch from DEX Screener, CoinGecko, Raydium |
| 🔥 Trending Tokens| Get top hot tokens from BirdEye API |
| 📰 DeFi News     | AI summarizes live DeFi news for you |
| 💵 Stablecoin Actions| Track stablecoin deposits/withdrawals |
| 🔐 Encrypted Private Key Storage | Your private key is encrypted securely and never shared |

---

## 🔐 Security & Encryption

DeFiTalk prioritizes user safety with:

- 🔐 AES-256 encryption of private keys
- 🧠 Encrypted secrets stored securely in MongoDB
- ✅ Wallet access only during active operations
- ❌ No seed phrases are ever stored or exposed
- 🔐 IP-restricted MongoDB Atlas deployment

> Users control their wallets. DeFiTalk ensures secure automation without compromising privacy.

---

## 🧠 NLP & AI Engine

DeFiTalk uses AI to understand casual language and route it to DeFi actions:

User: "Can you stake 3 SOL for me?" Bot: [stakes SOL via smart contract]

- 🤖 NLP Model: gpt-4-0-mini via [AIMLAPI.com](https://aimlapi.com)  
- ⏳ Free version with 10 requests/hour  
- 🧠 Prompts are structured to return clean JSON for DeFi parsing

---

## 🔧 Powered By

| Service | Purpose |
|--------|---------|
| 🔗 Helius RPC | Fast, scalable RPC provider for Solana |
| 🤖 AIMLAPI.com (ChatGPT API) | NLP intelligence (free tier: 10/hr) |
| 📊 BirdEye API | Price of tokens |
| 💡 DEX Screener, CoinGecko, Raydium APIs | Live price feeds |

---

## 🛑 What’s Not Yet Implemented (Intentionally Skipped)

| Feature | Status | Reason |
|--------|--------|--------|
| 💧 Liquidity Add/Remove | ❌ Skipped | Requires user LP token mgmt and risk of poor UX without visuals |
| 🔓 Unstaking | ❌ Deferred | Requires epoch logic + validator cooldown handling |
| 🪙 RAY/ORCA Staking | ❌ Planned | Requires program-specific contract integration |

> These features are fully scoped and will be implemented post-hackathon to maintain code quality.

---

## 🛠️ How It Works (Architecture Summary)

1. Telegram user sends message like: swap 2 SOL to USDC
2. Message is passed to NLP layer (AIMLAPI → GPT-4 mini)
3. AI responds with structured JSON(EXAMPLE):
   ```json
   {
     "category": "Swap",
     "amount": 2,
     "from_token": "SOL",
     "to_token": "USDC"
   }
   ```
4. DeFiTalk interprets the command and executes via Helius RPC and on-chain SDKs
5. Humanized response returned to the user (with emoji, markdown, and realism)

---

## 📡 Future Roadmap

- 🌉 Cross-chain support (EVM, Cosmos, etc)
- 📱 Mobile Web UI (React + WalletKit)
- 🧠 GPT-4-Vision integration for chart/graph analysis
- 🪙 Protocol-specific staking (RAY, ORCA, JITO, etc.)
- 🔄 Unstaking & Validator Management UI
- 📊 Admin Dashboard & Usage Analytics

---

## 📽️ Demo Pitch

- Youtube Video:  

---

## 🙌 Special Thanks

- Solana Foundation for the hackathon opportunity 🙏  
- OpenAI (via AIMLAPI) for the conversational layer  
- BirdEye, CoinGecko, Raydium, DEX Screener for amazing APIs  
- Helius for providing a reliable, production-grade Solana RPC  

---

## 🧠 Want to Test?

Start talking to your new DeFi assistant:  
👉 [t.me/@DefiTalks_bot](https://t.me/@DefiTalks_bot)

Try saying:
 “Swap 1 SOL to USDC”
 “Stake 2 SOL”
 “Show my portfolio”
 “What’s trending?”

---

## 🛠️ How to Run DeFiTalk Locally
git clone https://github.com/shaheer-ali-dev/DefiTalks
cd DefiTalks
Set up environment variables(use your own keys)like below :
BOT_TOKEN=
AI_API_KEY=
AI_API_URL=
RPC_URL=
BIRD_AUTH_TOKEN=
MONGODB_URI=
ENCRYPTION_KEY=
npm run start(for production) OR npm run dev(for development)

## 💬 Contact

- 🔧 Developer: @DefiTalks_dev  
- 📬 Telegram Support: DeFiTalk Chat  
- 🛠 GitHub: (https://github.com/shaheer-ali-dev/DefiTalks)  

---

DeFiTalk — Talk. Trade. Thrive.
