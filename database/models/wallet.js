const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    userId: {
      type: String, // Telegram user ID or username
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
  

module.exports = mongoose.model('Wallet', WalletSchema);
