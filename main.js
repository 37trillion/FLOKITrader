const ccxt = require('ccxt');
const executeTrade = require('./execute_trade');
const privateAPI = require('./private');
const publicAPI = require('./public');
const logger = require('./logger_component');

// Set the trading parameters
const symbol = 'FLOKI/USD';
const tradeAmount = 100;

// Set the interval in milliseconds (e.g., 1 minute)
const interval = 60000;

(async () => {
  try {
    // Initialize the exchange
    const exchange = new ccxt.cryptocom({
      apiKey: privateAPI.API_KEY,
      secret: privateAPI.SECRET,
    });

    while (true) {
      // Load markets and account info
      await exchange.loadMarkets();
      const accountInfo = await exchange.fetchBalance();

      // Print account balance
      console.log('Account balance:', accountInfo.total);

      // Execute a trade
      const tradeResult = await executeTrade(exchange, symbol, 'buy', tradeAmount);
      console.log('Trade result:', tradeResult);

      // Get ticker information
      const ticker = await publicAPI.getTicker(exchange, symbol);
      console.log(`${symbol} ticker:`, ticker);

      // Log an event
      logger.log('Trade executed successfully.');

      // Delay before the next trade
      await sleep(interval);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();

// Helper function to delay execution
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
