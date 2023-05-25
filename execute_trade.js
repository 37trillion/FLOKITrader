const ccxt = require('ccxt');

// Constants for RSI strategy
const RSI_PERIOD = 14;
const RSI_OVERBOUGHT_THRESHOLD = 70;
const RSI_OVERSOLD_THRESHOLD = 30;
const STOP_LOSS_PERCENTAGE = 0.02; // 2%
const TAKE_PROFIT_PERCENTAGE = 0.05; // 5%
const TRAILING_PROFIT_PERCENTAGE = 0.01; // 1%
const REBUY_THRESHOLD = 0.02; // 2%

async function executeTrade(exchange, symbol, balance, price, rsi) {
  try {
    const market = exchange.market(symbol);
    const symbolPrice = market['precision']['price'];

    // Calculate trade parameters
    const tradeAmount = balance / price;
    const stopLossPrice = price * (1 - STOP_LOSS_PERCENTAGE);
    const takeProfitPrice = price * (1 + TAKE_PROFIT_PERCENTAGE);
    const trailingProfitPrice = price * (1 + TRAILING_PROFIT_PERCENTAGE);

    // Execute trade based on RSI and strategy
    if (rsi > RSI_OVERBOUGHT_THRESHOLD) {
      // Sell if RSI is overbought
      console.log('RSI overbought. Selling...');
      const order = await exchange.createOrder(
        symbol,
        'limit',
        'sell',
        tradeAmount,
        stopLossPrice,
        { 'trailingStop': true, 'trailingStopValue': trailingProfitPrice }
      );
      console.log('Sell order placed:', order);
    } else if (rsi < RSI_OVERSOLD_THRESHOLD) {
      // Buy if RSI is oversold
      console.log('RSI oversold. Buying...');
      const order = await exchange.createOrder(symbol, 'limit', 'buy', tradeAmount, price);
      console.log('Buy order placed:', order);
    } else {
      // No action if RSI is within thresholds
      console.log('RSI within thresholds. No action taken.');
    }

  } catch (error) {
    console.error('Trade execution error:', error);
    throw error;
  }
}

module.exports = executeTrade;
