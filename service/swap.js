
const axios = require('axios');


const swap = async (req, res) => {
    const {tokenIn, tokenOut, amountIn} = req.body

    try {
        const estimatedTokenBValue = await estimateSwap(tokenIn, tokenOut, amountIn)
        res.json({tokenIn, tokenOut, amountIn, estimatedTokenBValue, executed:true})
    } catch (error) {
        
        res.status(500).json({error: 'Error estimating swap',executed:false})
    }
    
}

async function estimateSwap(tokenAname, tokenBname, tokenAvalue) {
    const apiKey = '178cca09-b68f-42e5-9486-a57967342bce'; // Replace with your CoinMarketCap API key
  
    try {
      // Fetch price of token A in USD
      const tokenAPriceUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${tokenAname}`;
      const tokenAPriceResponse = await axios.get(tokenAPriceUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
          'Accept': 'application/json',
        },
      });
  
      if (tokenAPriceResponse.data.status.error_code !== 0) {
        throw new Error(`Error fetching price for ${tokenAname}`);
      }
  
      const tokenAPriceUsd = tokenAPriceResponse.data.data[tokenAname].quote.USD.price;
  
      // Fetch price of token B in USD
      const tokenBPriceUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${tokenBname}`;
      const tokenBPriceResponse = await axios.get(tokenBPriceUrl, {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
          'Accept': 'application/json',
        },
      });
  
      if (tokenBPriceResponse.data.status.error_code !== 0) {
        throw new Error(`Error fetching price for ${tokenBname}`);
      }
  
      const tokenBPriceUsd = tokenBPriceResponse.data.data[tokenBname].quote.USD.price;
  
      // Calculate USD value of token A
      const tokenAValueUsd = tokenAvalue * tokenAPriceUsd;
  
      // Estimate token B amount (ignoring exchange fees and slippage)
      const estimatedTokenBValue = tokenAValueUsd / tokenBPriceUsd;
  
      return estimatedTokenBValue;
    } catch (error) {
      console.error('Error estimating swap:', error);
      throw error; // Re-throw for handling in the main function
    }
  }
  

module.exports = {
    swap
}