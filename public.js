const ccxt = require('ccxt');

async function getTicker(exchange, symbol) {
  try {
    const ticker = await exchange.fetchTicker(symbol);
    return ticker;

  } catch (error) {
    console.error('Error retrieving ticker:', error);
    throw error;
  }
}

async function getRSI(exchange, symbol, period) {
  try {
    const candles = await exchange.fetchOHLCV(symbol, '1d', undefined, period + 1);
    const closePrices = candles.map((candle) => candle[4]);
    const rsi = calculateRSI(closePrices, period);
    return rsi;

  } catch (error) {
    console.error('Error retrieving RSI:', error);
    throw error;
  }
}

function calculateRSI(prices, period) {
  if (prices.length < period + 1) {
    throw new Error('Insufficient data to calculate RSI');
  }

  const gainValues = [];
  const lossValues = [];

  for (let i = 1; i < prices.length; i++) {
    const priceDiff = prices[i] - prices[i - 1];
    if (priceDiff > 0) {
      gainValues.push(priceDiff);
      lossValues.push(0);
    } else if (priceDiff < 0) {
      gainValues.push(0);
      lossValues.push(Math.abs(priceDiff));
    } else {
      gainValues.push(0);
      lossValues.push(0);
    }
  }

  const avgGain = average(gainValues.slice(0, period));
  const avgLoss = average(lossValues.slice(0, period));

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  return rsi;
}

function average(arr) {
  const sum = arr.reduce((acc, value) => acc + value, 0);
  return sum / arr.length;
}

module.exports = {
  getTicker,
  getRSI,
};
