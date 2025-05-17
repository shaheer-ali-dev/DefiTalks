const axios = require("axios");
const birdeyedotso = require('@api/birdeyedotso');
const { BIRD_AUTH_TOKEN } = require('../config/env');

birdeyedotso.auth(BIRD_AUTH_TOKEN);

async function fetchTokenPrice(tokenMintAddress) {
    let price = null;

    // 1st Attempt: DEX Screener
    console.log("🔍 Trying DEX Screener...");
    try {
        const dexScreenerURL = `https://api.dexscreener.com/latest/dex/tokens/${tokenMintAddress}`;
        const dexResponse = await axios.get(dexScreenerURL);

        if (dexResponse.data && dexResponse.data.pairs?.length > 0) {
            price = parseFloat(dexResponse.data.pairs[0].priceUsd);
            if (price !== undefined) {
                console.log(`✅ DEX Screener Price: $${price}`);
                return price;
            } else {
                console.log("⚠️ DEX Screener returned undefined price. Falling back...");
            }
        } else {
            console.log("⚠️ DEX Screener response structure unexpected or empty pairs. Falling back...");
        }
    } catch (error) {
        console.log("❌ Error in DEX Screener:", error.message);
    }

    // 2nd Attempt: CoinGecko
    console.log("🔍 Trying CoinGecko...");
    try {
        const coingeckoURL = `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${tokenMintAddress}&vs_currencies=usd`;
        const coingeckoResponse = await axios.get(coingeckoURL);
        const tokenData = coingeckoResponse.data[tokenMintAddress.toLowerCase()];

        if (tokenData && tokenData.usd !== undefined) {
            price = parseFloat(tokenData.usd);
            console.log(`✅ CoinGecko Price: $${price}`);
            return price;
        } else {
            console.log("⚠️ CoinGecko returned undefined price. Falling back...");
        }
    } catch (error) {
        console.log("❌ Error in CoinGecko:", error.message);
    }

    // 3rd Attempt: BirdEye API
    console.log("🔍 Trying BirdEye API...");
    try {
        const response = await birdeyedotso.getDefiPrice({
            address: tokenMintAddress,
            'x-chain': 'solana'
        });

        const priceUSD = response?.data?.data?.value;
        if (priceUSD !== undefined) {
            price = parseFloat(priceUSD);
            console.log(`✅ BirdEye Price: $${price}`);
            return price;
        } else {
            console.log("⚠️ BirdEye returned undefined price.");
        }
    } catch (error) {
        console.log("❌ Error in BirdEye:", error.response?.data || error.message);
    }

    console.log("❗ All sources failed. Returning null.");
    return null;
}

module.exports = { fetchTokenPrice };
