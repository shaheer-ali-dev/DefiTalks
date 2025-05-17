// walletGenerator.js
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');

function generateWallet() {
  const keypair = Keypair.generate();

  const publicKey = keypair.publicKey.toBase58();
  const privateKey = bs58.encode(keypair.secretKey); 

  return {
    publicKey,
    privateKey,
  };
}

module.exports = {
  generateWallet,
};
