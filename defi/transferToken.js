const {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    sendAndConfirmTransaction,
    Transaction
} = require('@solana/web3.js');
const bs58 = require('bs58');
const {
    getAssociatedTokenAddress,
    createTransferInstruction,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
require('dotenv').config();
const { RPC_URL } = require('../config/env');
const connection = new Connection(RPC_URL);

async function transferToken({ fromPrivateKeyBase58, toWalletAddress, symbol,mintAddress , decimals, amount }) {
    const sender = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(fromPrivateKeyBase58)));
    const toPublicKey = new PublicKey(toWalletAddress);
    const isNativeSOL = symbol.toUpperCase() === 'SOL';

    const tx = new Transaction();

    if (isNativeSOL) {
        // Transfer native SOL
        const lamports = Math.floor(amount * 1e9);
        tx.add(SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: toPublicKey,
            lamports
        }));
    } else {
        // SPL token transfer

        const mint = new PublicKey(mintAddress);
        const senderATA = await getAssociatedTokenAddress(mint, sender.publicKey);
        const receiverATA = await getAssociatedTokenAddress(mint, toPublicKey);

        const amountInUnits = Math.floor(amount * 10 ** decimals);

        tx.add(createTransferInstruction(
            senderATA,
            receiverATA,
            sender.publicKey,
            amountInUnits,
            [],
            TOKEN_PROGRAM_ID
        ));
    }

    const txid = await sendAndConfirmTransaction(connection, tx, [sender]);
    return { success: true, txid };
}

module.exports = { transferToken };
