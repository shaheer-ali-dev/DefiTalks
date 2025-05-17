// /defi/jupiterSwap.js
const axios = require('axios');
const { Connection, Keypair, PublicKey, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
require('dotenv').config();
const { RPC_URL } = require('../config/env');
const connection = new Connection(RPC_URL);

async function getSwapQuote(fromMint, toMint, amount , decimals) {
    let amountInSmallUnit;
    if(fromMint == 'So11111111111111111111111111111111111111112'){
   amountInSmallUnit = Math.floor(amount * 1e9);
    }else{
  amountInSmallUnit =  Math.round(amount * Math.pow(10, decimals));

    }
    console.log("doing the swap pray")
    const response = await axios.get('https://quote-api.jup.ag/v6/quote', {
        params: {
            inputMint: fromMint,
            outputMint: toMint,
            amount: amountInSmallUnit,
            slippageBps: 100,
        }
    });

    return response.data || null;
}

async function swapTokens({ fromMint, toMint, amount, walletPrivateKeyBase58, decimal }) {
    const keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(walletPrivateKeyBase58)));
    const userPublicKey = keypair.publicKey.toBase58();

    const quote = await getSwapQuote(fromMint, toMint, amount , decimal);
    if (!quote) throw new Error('No quote received.');

    // Clean values
    for (let key of ['inAmount', 'outAmount', 'otherAmountThreshold', 'priceImpactPct', 'swapUsdValue']) {
        if (quote[key]) quote[key] = quote[key].toString();
    }
    if (!quote.platformFee) delete quote.platformFee;

    const swapResponse = await axios.post('https://quote-api.jup.ag/v6/swap', {
        quoteResponse: quote,
        userPublicKey,
        wrapUnwrapSOL: true,
    });

    const swapTransactionBase64 = swapResponse.data?.swapTransaction;
    if (!swapTransactionBase64) throw new Error('Failed to build swap transaction');

    const transactionBuffer = Buffer.from(swapTransactionBase64, 'base64');
    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    transaction.sign([keypair]);

    const txid = await connection.sendRawTransaction(transaction.serialize());
    await connection.confirmTransaction(txid, 'confirmed');
    console.log(txid)
    return { success: true, txid,};
}

module.exports = { swapTokens };
