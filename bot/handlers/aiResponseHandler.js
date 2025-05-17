
const { sendHumanizedMessage } = require('../utils/humanizer');
const { getRandomHumanResponse } = require('../utils/humanResponses');
const { getWalletBalance } = require('../../defi/checkbalance');
const { swapTokens } = require('../../defi/jupiterSwap');
const { getMintAddress } = require('../utils/mintResolver');
const { fetchTokenPrice } = require('../../defi/fetchTokenPrice');
const { generateWallet } = require('../../defi/walletGenerator')
const { summarizeNews } = require('../../Artificial_Intelligence/summarizeNews')
const { fetchDefiNews } = require('../../defi/defiNewsFetcher')
const { stakeSOL } = require('../../defi/solStaking');
const { addWalletForUser, getWalletsByUserId, addStakeForUser, getStakeByUserId, deleteStakeByUserId, addSwapForUser, getSwapByUserId, deleteSwapByUserId } = require('../utils/utilDBFunctions')
const { transferToken } = require('../../defi/transferToken')
const { getTokenBalance } = require('../../defi/getBalancewithMint')
// Main function to process AI reply
async function handleAIResponse(bot, userId, chatId, aiRawResponse) {
    try {
        // Attempt to parse JSON
        let parsed;
        try {
            aiRawResponse = aiRawResponse.trim();
            parsed = JSON.parse(aiRawResponse);
        } catch (err) {
            await sendHumanizedMessage(bot, chatId, "🤔 Sorry, I couldn't understand You. Can you please elaborate?");
            return;
        }

        const { casual_reply, defi_action } = parsed;

        if (!defi_action) {
            // Only casual talk, no DeFi action
            if (casual_reply) {
                await sendHumanizedMessage(bot, chatId, casual_reply);
            } else {
                await sendHumanizedMessage(bot, chatId, "🤔 I received your message but have nothing specific to say right now.");
            }
        } else {
            // defi_action is NOT null
            if (casual_reply) {
                // Send casual talk first
                await sendHumanizedMessage(bot, chatId, casual_reply);
            }

            // Now process defi_action category
            const category = defi_action.category.toLowerCase();

            const wallets = await getWalletsByUserId(userId);
            let decimal
            let Executed = false;
            let lastKnownBalance = [];
            switch (category) {
                case 'swap': {
                    let resultBoth;
                    resultBoth = await getMintAddress(defi_action.from_token, defi_action.from_name);
                    const from_token = resultBoth.mintAddress
                    const decimal = resultBoth.decimal
                    resultBoth = await getMintAddress(defi_action.to_token, defi_action.to_name);
                    const to_token = resultBoth.mintAddress

                    try {
                        const swapMessage = getRandomHumanResponse('swap', {
                            amount: defi_action.amount,
                            from_token: defi_action.from_token,
                            to_token: defi_action.to_token,
                        });
                        await sendHumanizedMessage(bot, chatId, swapMessage);
                    } catch (err) {
                        console.error('❌ Error generating or sending swap message:', err);
                        // Not fatal, continue execution
                    }

                    if (!wallets || wallets.length === 0) {
                        try {
                            const wallet = generateWallet();
                            await addWalletForUser(userId, wallet.publicKey, wallet.privateKey);
                            const message = `
⚠️ You don’t have a wallet yet — I’ve just generated one for you 🔐
✅ *New Wallet Created!* ✅

🔹 *Public Key:* \`${wallet.publicKey}\`

🔹 *Private Key:* \`${wallet.privateKey}\`

📥 Send SOL to your wallet using Phantom, Binance, or any Solana wallet.\n\n`;
                            await sendHumanizedMessage(bot, chatId, message);
                        } catch (err) {
                            console.error('❌ Error creating wallet:', err);
                            await sendHumanizedMessage(bot, chatId, `⚠️ Failed to generate or save your wallet. Please try again later.`);
                        }
                        return;
                    }

                    let Executed = false;
                    const lastKnownBalance = [];
                    const swapData = await getSwapByUserId(userId).catch(err => {
                        console.error('❌ Error fetching swap data:', err);
                        return [];
                    });

                    const failedWallets = []; // Keep track of wallets that failed

                    for (const wallet of wallets) {
                        try {
                            const balance = await getTokenBalance(wallet.publicKey, from_token);
                            const normalizedBalance = balance / (10 ** decimal); // Convert smallest unit to normal unit
                            lastKnownBalance.push({ publicKey: wallet.publicKey, normalizedBalance });

                            if (balance < defi_action.amount) {
                                // Skip this wallet if balance is insufficient
                                failedWallets.push({ publicKey: wallet.publicKey, balance });
                                continue;
                            }
                            const isSelling = ['sol', 'solana', 'SOL', 'SOLANA'].includes(defi_action.to_token);
                            let success = false, txid = null, usedWallet = null;

                            if (isSelling) {

                                for (const swap of swapData) {
                                    const match = (swap.tokenMintAddress === from_token ||
                                        swap.symbol.toLowerCase() === defi_action.from_token.toLowerCase());

                                    if (match) {

                                        ({ success, txid } = await swapTokens({
                                            fromMint: from_token,
                                            toMint: to_token,
                                            amount: defi_action.amount,
                                            walletPrivateKeyBase58: wallet.privateKey,
                                            decimal: decimal
                                        }));

                                    }
                                    else {
                                        await sendHumanizedMessage(bot, chatId, `You dont have the token present in the wallet`)
                                    }
                                }
                            } else {
                                if (balance >= defi_action.amount) {
                                    ({ success, txid } = await swapTokens({
                                        fromMint: from_token,
                                        toMint: to_token,
                                        amount: defi_action.amount,
                                        walletPrivateKeyBase58: wallet.privateKey,
                                        decimal: decimal
                                    }));
                                }
                            }

                            if (success) {
                                await sendHumanizedMessage(bot, chatId,
                                    `✅ Successfully swapped *${defi_action.amount} ${defi_action.from_token} ➔ ${defi_action.to_token}* in wallet \`${usedWallet}\`.\n🧾 *Transaction ID:* \`${txid}\``);

                                if (isSelling) {
                                    const balance_ = await getTokenBalance(wallet.publicKey, from_token);
                                    if (balance_ <= 0.001) {
                                        const wasDeleted = await deleteSwapByUserId(userId, defi_action.from_token);
                                        const res = wasDeleted ? '✔️ Swap record deleted.' : 'ℹ️ No matching swap record found to delete.'
                                    }

                                } else {
                                    try {
                                        const price = await fetchTokenPrice(to_token);
                                        const success = await addSwapForUser(userId, wallet.publicKey, to_token, defi_action.to_token, String(price));
                                    } catch (err) {
                                        console.error('❌ Error saving swap info:', err);
                                        await sendHumanizedMessage(bot, chatId, `ℹ️ Swap was successful, but we couldn’t save your swap data. Please note it manually.`);
                                    }
                                }

                                Executed = true;
                                break;
                            } else {
                                failedWallets.push({ publicKey: wallet.publicKey, balance });
                            }

                        } catch (err) {
                            console.error(`❌ Error during swap for wallet ${wallet.publicKey}:`, err);
                            failedWallets.push({ publicKey: wallet.publicKey, balance: 0 }); // Log as failed wallet
                            await sendHumanizedMessage(bot, chatId, `⚠️ Swap failed for wallet \`${wallet.publicKey}\`.\nReason: ${err.error}`);
                        }
                    }

                    if (!Executed) {
                        const balanceReport = lastKnownBalance.map(({ publicKey, balance }) =>
                            `• \`${publicKey}\`: *${balance.toFixed(4)} SOL*`
                        ).join('\n');



                        await sendHumanizedMessage(bot, chatId,
                            `🚫 *Swap could not be executed.*\nNone of your wallets have enough balance or the required tokens.\n\n` +
                            `📊 *Wallet Balances:*\n${balanceReport}\n\n` +
                            `💡 Please deposit the required amount and try again.`);
                    }

                    break;
                }


                case 'portfolio':
                    let portfolio_message_2 = `📊 *Your Portfolio Summary* 📊\n\n`;
                    const portfolioMessage = getRandomHumanResponse('portfolio', {
                        wallet_address: defi_action.wallet_address,
                    });
                    await sendHumanizedMessage(bot, chatId, portfolioMessage);
                    let stakes
                    const swapsData = await getSwapByUserId(userId);
                    try {

                        stakes = await getStakeByUserId(userId);
                    } catch (e) {
                        console.log(e)
                    }
                    if (defi_action.wallet_address === 'all') {
                        for (const wallet of wallets) {
                            portfolio_message_2 += `👜 *Wallet:* \`${wallet.publicKey}\`\n`;
                            const solStake = stakes.find(s => s.publicKey === wallet.publicKey);
                            if (solStake) {
                                portfolio_message_2 += `   🪙 *Staked Token:* SOL -> \n*Amount Stacked* ${solStake.amount}SOL  \n`;
                            }
                            const walletSwaps = swapsData.filter(swap => swap.publicKey === wallet.publicKey);

                            if (walletSwaps.length === 0) {
                                portfolio_message_2 += `   ⚠️ No tokens found in this wallet.\n\n`;
                                continue;
                            }

                            for (const swap of walletSwaps) {
                                const currentPrice = await fetchTokenPrice(swap.tokenMintAddress);
                                const boughtPrice = swap.price;

                                const profitLoss = currentPrice - boughtPrice;
                                const profitLossPercent = ((profitLoss / boughtPrice) * 100).toFixed(2);
                                const direction = profitLoss >= 0 ? '📈' : '📉';
                                const formattedPL = profitLoss.toFixed(3);
                                const amount = getTokenBalance(swap.publicKey, swap.tokenMintAddress)
                                portfolio_message_2 +=
                                    `   🔹 *${swap.symbol}*\n` +
                                    `   🔹 *Amount:* \`${amount}\`\n` +
                                    `   🔸 *Mint:* \`${swap.tokenMintAddress}\`\n` +
                                    `   💸 Bought at: $${boughtPrice}\n` +
                                    `   🟢 Current: $${currentPrice}\n` +
                                    `   ${direction} P&L: *${formattedPL}* USD (*${profitLossPercent}%*)\n\n`;
                            }
                        }
                    }
                    else if (Array.isArray(defi_action.wallet_address)) {
                        for (const address of defi_action.wallet_address) {
                            portfolio_message_2 += `👜 *Wallet:* \`${address}\`\n`;
                            const solStake = stakes.find(s => s.publicKey === address);
                            if (solStake) {
                                portfolio_message_2 += `   🪙 *Staked Token:* ${solStake.symbol} (${Number(solStake.amount).toFixed(2)} SOL)\n`;
                            }
                            const walletSwaps = swapsData.filter(swap => swap.publicKey === address);

                            if (walletSwaps.length === 0) {
                                portfolio_message_2 += `   ⚠️ No tokens found in this wallet.\n\n`;
                                continue;
                            }

                            for (const swap of walletSwaps) {
                                const currentPrice = await fetchTokenPrice(swap.tokenMintAddress);
                                const boughtPrice = swap.price;

                                const profitLoss = currentPrice - boughtPrice;
                                const profitLossPercent = ((profitLoss / boughtPrice) * 100).toFixed(2);
                                const direction = profitLoss >= 0 ? '📈' : '📉';
                                const formattedPL = profitLoss.toFixed(3);
                                const amount = getTokenBalance(swap.publicKey, swap.tokenMintAddress)

                                portfolio_message_2 +=
                                    `   🔹 *${swap.symbol}*\n` +
                                    `   🔹 *Amount:* \`${amount}\`\n` +
                                    `   🔸 *Mint:* \`${swap.tokenMintAddress}\`\n` +
                                    `   💸 Bought at: $${boughtPrice}\n` +
                                    `   🟢 Current: $${currentPrice}\n` +
                                    `   ${direction} P&L: *${formattedPL}* USD (*${profitLossPercent}%*)\n\n`;
                            }
                        }
                    }
                    await sendHumanizedMessage(bot, chatId, portfolio_message_2)
                    break;


                case 'token price':
                    const { mint, decimals } = getMintAddress(defi_action.token, defi_action.token_name);
                    const tokenPriceMessage = getRandomHumanResponse('token_price', {
                        token: defi_action.token,
                    });
                    await sendHumanizedMessage(bot, chatId, tokenPriceMessage);
                    const price = await fetchTokenPrice(mint);
                    if (price !== null && price !== undefined) {

                        await sendHumanizedMessage(bot, chatId, `🔍 Price found: ${price}`)
                    } else {

                        await sendHumanizedMessage(bot, chatId, "🚫 Price not found.")
                    }
                    break;


                case 'staking':
                    if (wallets == null || wallets.length === 0) {
                        const wallet = generateWallet();
                        const message = `
        ⚠️ You don’t have a wallet yet — I’ve just generated one for you 🔐`+
                            `✅ *New Wallet Created!* ✅\n\n` +
                            `🔹 *Public Key:* \`${wallet.publicKey}\`\n\n` +
                            `🔹 *Private Key:* \`${wallet.privateKey}\`\n\n` +
                            `📥 Send SOL to your wallet using Phantom, Binance, or any Solana wallet.\n\n`;
                        const result = await addWalletForUser(userId, wallet.publicKey, wallet.privateKey);

                        await sendHumanizedMessage(bot, chatId, message);
                        return;
                    }

                    const symbol = defi_action.symbol;
                    let Executed = false;
                    let lastKnownBalance = [];

                    if (['sol', 'SOL', 'solana', 'SOLANA'].includes(symbol)) {
                        for (const wallet of wallets) {
                            try {
                                const balance = await getWalletBalance(wallet.publicKey);
                                lastKnownBalance.push({ publicKey: wallet.publicKey, balance });

                                if (balance >= defi_action.amount) {
                                    const result = await stakeSOL({
                                        privateKey: wallet.privateKey,
                                        amount: defi_action.amount
                                    });

                                    if (result.success) {
                                        await sendHumanizedMessage(bot, chatId,
                                            `✅ Staking of *${defi_action.amount} SOL* was successful in wallet \`${result.stakeAccount}\``);
                                        try {
                                            const res = await addStakeForUser(userId, wallet.publicKey, wallet.privateKey, result.stakeAccount, 'SOL', String(defi_action.amount));
                                        } catch (err) {
                                            console.error('❌ Error while saving stake to DB:', err);
                                        }

                                        Executed = true;
                                        return;
                                    } else if (!result.success) {
                                        await sendHumanizedMessage(bot, chatId,
                                            `❌ Staking failed for wallet \`${wallet.publicKey}\`.`);
                                    }
                                }
                            } catch (err) {
                                //skip
                            }
                        }

                        if (!Executed) {
                            let balanceReport = lastKnownBalance.map(({ publicKey, balance }) =>
                                `• \`${publicKey}\`: *${balance.toFixed(4)} SOL*`
                            ).join('\n');

                            await sendHumanizedMessage(bot, chatId,
                                `⚠️ *Staking couldn't be done.* None of your connected wallets have enough SOL for this operation (*${defi_action.amount} SOL* needed).\n\n` +
                                `📊 *Wallet Balances:*\n${balanceReport}\n\n` +
                                `💡 Please deposit at least *${defi_action.amount} SOL* into any of the above wallets and try again.`);
                        }
                    }
                    break;

                case 'defi news':
                    const newsMessage = getRandomHumanResponse('defi_news', {});
                    await sendHumanizedMessage(bot, chatId, newsMessage);
                    const newsData = await fetchDefiNews(5);
                    const summarizedNews = await summarizeNews(newsData);
                    await sendHumanizedMessage(bot, chatId, summarizedNews)
                    break;
                case 'deposit wallet':
                    {
                        const { tokenMintAddress, decimal } = getMintAddress(defi_action.symbol, defi_action.name);

                        if (!wallets || wallets.length === 0) {
                            try {
                                const wallet = generateWallet();
                                await addWalletForUser(userId, wallet.publicKey, wallet.privateKey);
                                const message = `
⚠️ You don’t have a wallet yet — I’ve just generated one for you 🔐
✅ *New Wallet Created!* ✅

🔹 *Public Key:* \`${wallet.publicKey}\`
🔹 *Private Key:* \`${wallet.privateKey}\`

📥 Send SOL to your wallet using Phantom, Binance, or any Solana wallet.
`;
                                await sendHumanizedMessage(bot, chatId, message);
                            } catch (err) {
                                console.error('❌ Error creating wallet:', err);
                                await sendHumanizedMessage(bot, chatId, `⚠️ Failed to generate or save your wallet. Please try again later.`);
                            }
                            return;
                        }

                        let executed = false;
                        const lastKnownBalance = [];
                        const failedWallets = [];

                        let swapData = [];
                        try {
                            swapData = await getSwapByUserId(userId);
                        } catch (err) {
                            console.error('❌ Error fetching swap data:', err);
                        }

                        for (const wallet of wallets) {
                            try {
                                const balance = await getTokenBalance(wallet.publicKey , tokenMintAddress);
                                lastKnownBalance.push({ publicKey: wallet.publicKey, balance });

                                if (balance < defi_action.amount) {
                                    failedWallets.push({ publicKey: wallet.publicKey, balance });
                                    continue;
                                }

                                const isSolTransfer = ['sol', 'solana', 'SOL', 'SOLANA'].includes(defi_action.symbol);
                                let success = false;
                                let txid = null;

                                if (isSolTransfer) {
                                    ({ success, txid } = await transferToken({ fromPrivateKeyBase58: wallet.privateKey, toWalletAddress: defi_action.wallet, symbol: 'SOL', mintAddress: tokenMintAddress, decimals: decimal, amount: defi_action.amount }

                                    ));
                                } else {
                                    const matchingSwap = swapData.find(
                                        swap =>
                                            swap.tokenMintAddress === tokenMintAddress ||
                                            swap.symbol.toLowerCase() === defi_action.symbol.toLowerCase()
                                    );

                                    if (!matchingSwap) {
                                        await sendHumanizedMessage(bot, chatId, `❌ You don't have the required token in your wallets.`);
                                        continue;
                                    }

                                    ({ success, txid } = await transferToken({ fromPrivateKeyBase58: wallet.privateKey, toWalletAddress: defi_action.wallet, symbol: defi_action.symbol, mintAddress: tokenMintAddress, decimals: decimal, amount: defi_action.amount }))
                                }
                            
                                if (success) {
                                    executed = true;
                                    await sendHumanizedMessage(bot, chatId,
                                        `✅ Successfully Transferred from \`${wallet.publicKey}\` ➔ \`${defi_action.wallet}\`.\n🆔 Transaction ID: \`${txid}\``);
                                    break; // Stop after successful swap
                                }

                            } catch (err) {
                                console.error(`❌ Error during swap for wallet ${wallet.publicKey}:`, err);
                                failedWallets.push({ publicKey: wallet.publicKey, balance: 0 });

                            }
                        }

                        if (!executed) {
                            const balanceReport = lastKnownBalance.map(({ publicKey, balance }) =>
                                `• \`${publicKey}\`: *${balance.toFixed(4)} SOL*`
                            ).join('\n');

                            await sendHumanizedMessage(bot, chatId,
                                `🚫 *Transfer of tokens could not be executed.*\nNone of your wallets have enough balance or the required tokens.\n\n` +
                                `📊 *Wallet Balances:*\n${balanceReport}\n\n` +
                                `💡 Please deposit the required amount and try again.`);
                        }

                        break;
                    }

                case 'balance check':
                    let finalMessage = "";
                    if (wallets == null) {
                        const wallet = generateWallet();
                        const message = `
                        ⚠️ You don’t have a wallet yet — I’ve just generated one for you 🔐`+
                            `✅ *New Wallet Created!* ✅\n\n` +
                            `🔹 *Public Key:* \`${wallet.publicKey}\`\n\n` +
                            `🔹 *Private Key:* \`${wallet.privateKey}\`\n\n` +
                            `📥 Send SOL to your wallet using Phantom, Binance, or any Solana wallet.\n\n`
                            ;
                        const result = await addWalletForUser(userId, wallet.publicKey, wallet.privateKey);
                        await sendHumanizedMessage(bot, chatId, message)
                        return;

                    }
                    if (defi_action.wallet == "all") {
                        for (const walletAddress of wallets) {
                            try {
                                const balance = await getWalletBalance(walletAddress.publicKey);
                                finalMessage += `💰 Wallet \`${walletAddress.publicKey}\` balance is approximately *${balance.toFixed(4)} SOL*\n\n`;
                            } catch (error) {

                                finalMessage += `⚠️ Failed to fetch balance for wallet: \`${walletAddress}\`\n\n`;
                            }
                        }
                    } else {
                        // Normalize to array
                        const wallets_ = Array.isArray(defi_action.wallet) ? defi_action.wallet : [defi_action.wallet];


                        for (const walletAddress of wallets_) {
                            try {
                                const balance = await getWalletBalance(walletAddress);
                                finalMessage += `💰 Wallet \`${walletAddress}\` balance is approximately *${balance.toFixed(4)} SOL*\n\n`;
                            } catch (error) {

                                finalMessage += `⚠️ Failed to fetch balance for wallet: \`${walletAddress}\`\n\n`;
                            }
                        }


                    }
                    await sendHumanizedMessage(bot, chatId, finalMessage.trim());
                    break;

                case 'generate wallet':
                    const walletMessage = getRandomHumanResponse('generate_wallet', {});
                    await sendHumanizedMessage(bot, chatId, walletMessage);
                    const wallet = generateWallet();

                    const message = `
🪪 Solana Wallet Generated Successfully

🔐 Private Key (Keep this safe and NEVER share it):
${wallet.privateKey}

📬 Public Key (Your Wallet Address):
${wallet.publicKey}

📌 IMPORTANT:
- Your PRIVATE KEY allows full access to your funds. Store it securely.
- Never share your private key with anyone.
- Consider using a secure vault or password manager for storage.
`;
                    const result = await addWalletForUser(userId, wallet.publicKey, wallet.privateKey);
                    await sendHumanizedMessage(bot, chatId, message)
                    break;

                default:

                    await sendHumanizedMessage(bot, chatId, `⚠️ Sorry, I'm not trained yet for this category: ${category}`);
            }
        }

    } catch (error) {

        await sendHumanizedMessage(bot, chatId, "❌ Something went wrong while processing your request.");
    }
}

module.exports = {
    handleAIResponse
};
