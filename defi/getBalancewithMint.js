const { Connection, PublicKey } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');
require('dotenv').config();
const { RPC_URL } = require('../config/env');
const connection = new Connection(RPC_URL);

async function getTokenBalance(walletPublicKey, mintAddress) {
  try {
    const mintPubkey = new PublicKey(mintAddress);
    const userPubkey = new PublicKey(walletPublicKey);
    const ata = await getAssociatedTokenAddress(mintPubkey, userPubkey);
    const accountInfo = await getAccount(connection, ata);
    return Number(accountInfo.amount); // token amount in smallest units
  } catch (err) {
    // If token account doesn't exist, balance is 0
    return 0;
  }
}

module.exports = { getTokenBalance }