const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
    userId: {
       type: String,
       required: true,
     },
  publicKey: {
    type: String,
    required: true,
  },
  tokenMintAddress: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Swap', SwapSchema);
