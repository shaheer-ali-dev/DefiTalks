// mintResolver.js
const fs = require('fs');
const path = require('path');

const tokenListPath = path.join(__dirname, 'data/solana.tokenlist.json');
let tokenList = [];

// Load once when the module is required
async function loadTokenList() {
  try {
    const content =await fs.readFileSync(tokenListPath, 'utf-8');
    const parsed =await JSON.parse(content);
    tokenList = parsed.tokens;
  } catch (err) {
return
  }
}

async function getMintAddress(symbol,name) {
  if (!tokenList.length) {await loadTokenList();}
  const token =await tokenList.find(
    t => t.symbol.toUpperCase() == symbol.toUpperCase()||t.name.toUpperCase() == name.toUpperCase()
  );
  // console.log(token)
  let mintAddress = null
  let decimal = null
  if(token){
    mintAddress = token.address;
    decimal = token.decimals;
    // console.log(mintAddress , decimal)
      return {mintAddress,decimal}
  }
  return {mintAddress,decimal}
}

module.exports = {
  getMintAddress
};
