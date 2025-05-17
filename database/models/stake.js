const mongoose = require('mongoose');

const StakingSchema = new mongoose.Schema({
    userId: {
      type: String, // Must match the one in wallet
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
    stakingPubKey: {
      type: String,
      required: true,
    },
    symbol:{
      type:String,
      required: true
    },
    amount:{
      type: "String",
      required: true
    }
  }, { timestamps: true });
  

module.exports = mongoose.model('Staking', StakingSchema);
