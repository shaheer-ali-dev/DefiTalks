// Some fixed Human responses to minimie the use of AI (We can totally use AI for this but it is not cost efficient!)

const humanResponses = {
    swap: [
      "🔄 Sure, I'll swap it right away!",
      "Alright, I'm swapping {amount} {from_token} to {to_token} for you!",
      "Got it, handling your token swap now.",
      "No worries! Let me quickly swap {amount} {from_token} to {to_token}.",
      "Swapping {amount} {from_token} into {to_token} as requested!",
      "✨ Your swap is being processed.",
      "Hold on, moving {amount} {from_token} to {to_token} for you!",
      "I'm taking care of your swap right now.",
      "👌 Working on swapping your {from_token} to {to_token}.",
      "Swap underway! Just a moment..."
    ],
  
    liquidity: [
      "💧 Handling your liquidity request now!",
      "Got it, {action} liquidity for {token_pair}.",
      "No worries, {action} liquidity real quick!",
      "Alright, working on {action} liquidity to the pool!",
      "Adding/removing liquidity for {token_pair} as you asked!",
      "✨ Your liquidity {action} is being processed.",
      "Taking care of your liquidity request.",
      "📈 {action} liquidity into {token_pair} right now!",
      "Your liquidity move is on it!",
      "Almost done with your liquidity {action}!"
    ],
  
    portfolio: [
      "📊 Checking your portfolio now!",
      "One second, fetching your portfolio details.",
      "Alright, looking into your wallet {wallet_address} portfolio!",
      "🔎 Gathering your asset information.",
      "✨ Checking portfolio holdings for you!",
      "Let me get your portfolio balance.",
      "Working on your portfolio details...",
      "Fetching real-time portfolio snapshot!",
      "Almost done checking your assets!",
      "Analyzing your wallet portfolio now."
    ],
  
    token_price: [
      "💲 Let me fetch the latest price for {token}.",
      "Hold on, checking {token}'s current value!",
      "🔎 Getting the real-time price for {token}.",
      "One sec, pulling up {token}'s price for you.",
      "✨ Fetching {token}'s latest rate.",
      "No worries! Grabbing {token}'s market value.",
      "Almost there, checking {token} pricing!",
      "Looking into {token} price as we speak!",
      "On it! {token} price coming up.",
      "Checking {token} market stats."
    ],
  
    staking: [
      "🪙 Working on staking {amount} {token}!",
      "Alright, processing your {token} staking.",
      "Staking {amount} {token} for you now.",
      "✨ Setting up your {token} stake.",
      "Got it, preparing {amount} {token} to stake!",
      "🔒 Locking in your {token} for staking.",
      "Processing your {token} staking request.",
      "Hold tight, setting your {token} in staking!",
      "Your staking request is being handled.",
      "Almost there with your {amount} {token} stake!"
    ],
    unstaking: [
      "🔓 Unstaking your {amount} {token} now!",
      "Alright, processing your {token} unstake request.",
      "Releasing your staked {token} — hang tight!",
      "✨ Initiating unstake for your {amount} {token}.",
      "Got it, working on unstaking {token} for you.",
      "Unstaking in progress — freeing up your {amount} {token}.",
      "No worries, unstaking your tokens right away!",
      "🧩 Handling your {token} unstake transaction.",
      "Just a sec, moving your {amount} {token} out of stake.",
      "📤 Getting your {token} unstaked and ready to use!"
    ],
    
    defi_news: [
      "📰 Let me fetch the latest DeFi news!",
      "Getting you today's top DeFi headlines.",
      "✨ Finding the freshest DeFi updates!",
      "One sec, checking DeFi world for you.",
      "Gathering latest DeFi buzz!",
      "Looking into what's happening in DeFi today.",
      "🔍 Fetching hot DeFi news stories.",
      "News coming up! Hold tight.",
      "Bringing you the latest DeFi insights!",
      "🧠 Updating you with the DeFi world news."
    ],
  
    stablecoin_tools: [
      "💵 Handling your stablecoin {action} request!",
      "Sure, {action} {amount} {stablecoin} now!",
      "Working on your stablecoin {action}.",
      "Alright, managing your {action} of {stablecoin}.",
      "✨ Taking care of your stablecoin move.",
      "No problem! {action} {amount} {stablecoin} as asked.",
      "Almost done {action} {stablecoin}!",
      "Executing {action} operation for {stablecoin}.",
      "📥 Handling your stablecoin transaction.",
      "On it! Managing your {action} with {stablecoin}."
    ],
  
    generate_wallet: [
      "🆕 Generating a fresh wallet for you!",
      "Hold tight, creating your new wallet address.",
      "✨ Spinning up a new wallet real quick!",
      "No worries, building your secure wallet!",
      "Creating a fresh wallet right now.",
      "🛡️ Setting up your brand new wallet.",
      "Getting your wallet ready to roll!",
      "One moment, wallet generation in progress!",
      "Almost done creating your wallet.",
      "🔐 Your new wallet is being generated!"
    ]
  };



  function getRandomHumanResponse(category, data = {}) {
    const responses = humanResponses[category.toLowerCase()];
    if (!responses) return "⚡ Working on your request!";
    
    let randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Replace placeholders like {amount}, {from_token}, etc.
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      randomResponse = randomResponse.replace(regex, data[key]);
    });
  
    return randomResponse;
  }
  
  module.exports = {
    getRandomHumanResponse,
  };  