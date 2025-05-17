const { Connection, PublicKey } = require('@solana/web3.js');
require('dotenv').config();
const { RPC_URL } = require('../config/env');

async function getWalletBalance(publicKey) {
  const connection = new Connection(RPC_URL);
  const walletPublicKey = new PublicKey(publicKey);

  try {
    const balance = await connection.getBalance(walletPublicKey);
    return balance / 1e9;
  } catch (error) {
    console.error("Error fetching wallet balance:", error.message);
    throw new Error("Failed to fetch wallet balance.");
  }
}

module.exports = { getWalletBalance };
