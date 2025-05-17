const Wallet = require('../../database/models/wallet');
const Stake = require('../../database/models/stake');
const Swap = require('../../database/models/swap')
const { encrypt, decrypt } = require('./crypto')
// ==== WALLET FUNCTIONS ====


const addWalletForUser = async (userId, publicKey, privateKey) => {
  const wallet = new Wallet({
    userId,
    publicKey: encrypt(publicKey),
    privateKey: encrypt(privateKey)
  });

  return await wallet.save();
};

const getWalletsByUserId = async (userId) => {
  const wallets = await Wallet.find({ userId });
  if(!wallets)  return null;
  return wallets.map(wallet => ({
    ...wallet.toObject(),
    publicKey: decrypt(wallet.publicKey),
    privateKey: decrypt(wallet.privateKey),
  }));
};


// ==== STAKE FUNCTIONS ====

const addStakeForUser = async (userId, publicKey, privateKey, stakingPubKey,symbol,amount) => {
  const stake = new Stake({
    userId,
    publicKey: encrypt(publicKey),
    privateKey: encrypt(privateKey),
    stakingPubKey: encrypt(stakingPubKey),
    symbol:encrypt(symbol),
    amount:encrypt(amount)
  });
  return await stake.save();
};

const getStakeByUserId = async (userId) => {
  const stakes = await Stake.find({ userId });
  if (!stakes) return null;
  return stakes.map(stake => ({

    ...stake.toObject(),
    publicKey: decrypt(stake.publicKey),
    privateKey: decrypt(stake.privateKey),
    stakingPubKey: decrypt(stake.stakingPubKey),
    symbol:decrypt(symbol),
    amount:decrypt(amount)
  }));
};


const deleteStakeByUserId = async (userId,publicKey) => {
const encryptedPublicKey = encrypt(publicKey);
  const result = await Wallet.deleteOne({ userId, stakingPubKey: encryptedPublicKey });
  return result.deletedCount > 0; // true if deleted, false if not found
  };

// ==== SWAP FUNCTIONS ====


const addSwapForUser = async (userId, publicKey, tokenMintAddress, symbol, price) => {
  await Swap.deleteMany({});
  const swap = new Swap({
    userId,
    publicKey: encrypt(publicKey),
    tokenMintAddress: encrypt(tokenMintAddress),
    symbol: encrypt(symbol),
    price
  });

  return await swap.save();
};

const getSwapByUserId = async (userId) => {
  const swaps = await Swap.find({ userId });
  if (!swaps) return [];
  return swaps.map(swap => ({
    ...swap.toObject(),
    publicKey: decrypt(swap.publicKey),
    tokenMintAddress: decrypt(swap.tokenMintAddress),
    symbol: decrypt(swap.symbol),
    price: swap.price
  }));
};


const deleteSwapByUserId = async (userId, tokenMintAddress) => {
  const encryptedTokenMintAddress = encrypt(tokenMintAddress);
  const result = await Swap.deleteOne({ userId, tokenMintAddress: encryptedTokenMintAddress });
  return result.deletedCount > 0;
};


module.exports = {
  addWalletForUser,
  getWalletsByUserId,
  addStakeForUser,
  getStakeByUserId,
  deleteStakeByUserId,
  addSwapForUser,
  getSwapByUserId,
  deleteSwapByUserId
};
