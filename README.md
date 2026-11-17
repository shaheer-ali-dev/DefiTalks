# DeFiTalks

**A Telegram-based experiment exploring AI-assisted interaction with decentralized finance.**

DeFiTalks is a personal project built to explore how natural-language processing could be used to interpret user messages and translate them into structured DeFi-related actions.

The idea was simple: instead of navigating multiple interfaces, users could interact with a Telegram bot using conversational commands.

The project combines a Telegram bot, an AI-powered message parser and integrations with the Solana ecosystem.

## How It Works

The application follows a relatively straightforward flow:

```text
Telegram Message
       |
       v
   Telegram Bot
       |
       v
   AI Parser
       |
       v
 Structured Response
       |
       v
  Action Handler
       |
       v
 Response to User
```

The AI component interprets incoming messages and attempts to classify them into predefined categories. The bot then processes the resulting response through its handlers.

## Features Explored

The implementation explores several DeFi-related operations:

- Natural-language message classification.
- Telegram bot commands and message handling.
- Structured JSON responses from an AI service.
- Solana and SPL Token integrations.
- Wallet-related operations.
- Token information and price-related integrations.
- Database connectivity through MongoDB.
- Separate handlers for different bot commands.

These represent areas explored in the codebase, not a guarantee that every operation works end-to-end.

## Tech Stack

| Component | Technology |
|---|---|
| Runtime | Node.js |
| Language | JavaScript |
| Bot Framework | node-telegram-bot-api |
| AI Integration | OpenAI-compatible API |
| Blockchain | Solana |
| Token Integration | SPL Token |
| Database | MongoDB |
| ODM | Mongoose |
| HTTP Requests | Axios |

## Project Structure

```text
DefiTalks/
│
├── Artificial_Intelligence/
│   └── AI message parser
│
├── bot/
│   ├── handlers/
│   ├── utils/
│   └── main.js
│
├── config/
│   └── env.js
│
├── database/
│   └── Database connection
│
├── defi/
│   └── DeFi-related modules
│
├── package.json
├── package-lock.json
└── README.md
```

## Development Status

DeFiTalks was developed as an experimental project to explore the intersection of conversational AI, Telegram bots and blockchain applications.

Development is currently inactive. Although the repository contains implementations and integrations for several components, the overall application has not been established as a fully tested or production-ready service.

Some functionality remains incomplete or requires further validation.

**This project should be treated as an experimental codebase, not a live financial application. Do not use it to manage real funds or sensitive wallet credentials.**

## What I Learned

Working on DeFiTalks gave me an opportunity to explore:

- Integrating external AI APIs into backend applications.
- Processing natural-language input into structured data.
- Building Telegram bots with command handlers.
- Working with blockchain-related libraries.
- Connecting backend services to MongoDB.
- Organising a modular Node.js application.

The project was an interesting exercise in bringing multiple technologies together into one application.

---

**Author:** [Shaheer Ali](https://github.com/shaheer-ali-dev)

**Language:** JavaScript  
**Runtime:** Node.js  
**Project Type:** Telegram Bot / AI / Blockchain  
**Status:** Experimental / Inactive
