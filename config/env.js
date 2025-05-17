// Env File setup

require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  AI_API_KEY: process.env.AI_API_KEY,
  AI_API_URL: process.env.AI_API_URL,
  RPC_URL:process.env.RPC_URL,
  BIRD_AUTH_TOKEN:process.env.BIRD_AUTH_TOKEN,
  MONGODB_URI:process.env.MONGODB_URI,
  ENCRYPTION_KEY:process.env.ENCRYPTION_KEY
};
