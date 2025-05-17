const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  StakeProgram,
  Authorized,
  Lockup,
  sendAndConfirmTransaction,
  PublicKey,
  Transaction,
} = require('@solana/web3.js');
const bs58 = require('bs58');
require('dotenv').config();

const connection = new Connection(process.env.RPC_URL, 'confirmed');

// 🔁 Fetch the top validator vote account
async function getTopMainnetValidator() {
  const voteAccounts = await connection.getVoteAccounts();
  const sorted = voteAccounts.current.sort((a, b) => b.activatedStake - a.activatedStake);
  return sorted[0].votePubkey;
}

async function stakeSOL({ privateKey, amount }) {
  try {

    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    const walletPubkey = keypair.publicKey;

    const lamports = amount * LAMPORTS_PER_SOL;

    const stakeAccount = Keypair.generate();

    // STEP 1: Create stake account
    const createStakeAccountIx = StakeProgram.createAccount({
      fromPubkey: walletPubkey,
      stakePubkey: stakeAccount.publicKey,
      authorized: new Authorized(walletPubkey, walletPubkey),
      lamports,
      lockup: new Lockup(0, 0, walletPubkey),
    });

    const createTx = new Transaction().add(createStakeAccountIx);

    const creationSig = await sendAndConfirmTransaction(
      connection,
      createTx,
      [keypair, stakeAccount]
    );


    // STEP 2: Get top validator vote account dynamically
    const topValidatorVote = await getTopMainnetValidator();

    const voteAccountInfo = await connection.getAccountInfo(new PublicKey(topValidatorVote));
    if (!voteAccountInfo) {
      throw new Error("Invalid or non-existent validator vote account.");
    }

    // STEP 3: Delegate stake
    const delegateIx = StakeProgram.delegate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: walletPubkey,
      votePubkey: new PublicKey(topValidatorVote),
    });

    const delegateTx = new Transaction().add(delegateIx);

    // 🔥 SIGN WITH BOTH keypair AND stakeAccount
const delegateSig = await sendAndConfirmTransaction(
  connection,
  delegateTx,
  [keypair, stakeAccount]
);



    return {
      success: true,
      stakeAccount: stakeAccount.publicKey.toBase58(),
      creationTx: creationSig,
      delegationTx: delegateSig
    };

  } catch (err) {
    return {
      success: false,
    };
  }
}

module.exports = { stakeSOL };
