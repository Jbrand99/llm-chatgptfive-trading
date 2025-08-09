#!/usr/bin/env node

// Direct real money trading test - bypasses all simulations
import ccxt from 'ccxt';

console.log('🚨 TESTING REAL MONEY TRADING - LIVE EXCHANGES ONLY');

async function testLiveBinanceConnection() {
  if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_SECRET_KEY) {
    console.log('❌ Binance API keys not found');
    return false;
  }

  try {
    const binance = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_SECRET_KEY,
      sandbox: false, // FORCE LIVE TRADING
      enableRateLimit: true,
    });

    // Test connection
    console.log('🔗 Connecting to LIVE Binance...');
    await binance.loadMarkets();
    
    // Get account balance
    console.log('💰 Fetching LIVE account balance...');
    const balance = await binance.fetchBalance();
    
    // Show non-zero balances
    const nonZeroBalances = Object.entries(balance.total)
      .filter(([_, amount]) => amount > 0);
      
    console.log('✅ LIVE BINANCE CONNECTION SUCCESSFUL');
    console.log('💳 Account Balances:');
    if (nonZeroBalances.length > 0) {
      nonZeroBalances.forEach(([currency, amount]) => {
        console.log(`   ${currency}: ${amount}`);
      });
    } else {
      console.log('   No balances found (account may be empty)');
    }
    
    // Check if we have enough USDT for a small trade
    const usdtBalance = balance.total['USDT'] || 0;
    const minTradeUSDT = 10; // $10 minimum
    
    if (usdtBalance >= minTradeUSDT) {
      console.log(`✅ Sufficient balance for real trading: ${usdtBalance} USDT`);
      return true;
    } else {
      console.log(`⚠️ Insufficient USDT balance: ${usdtBalance} (need ${minTradeUSDT})`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Binance connection failed: ${error.message}`);
    return false;
  }
}

async function executeRealTrade() {
  const canTrade = await testLiveBinanceConnection();
  
  if (!canTrade) {
    console.log('❌ Cannot execute real trades - insufficient funds or connection failed');
    return;
  }

  try {
    const binance = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_SECRET_KEY,
      sandbox: false, // LIVE TRADING
      enableRateLimit: true,
    });

    console.log('🚨 EXECUTING REAL MONEY TRADE');
    console.log('💰 Symbol: XRP/USDT');
    console.log('📈 Side: BUY');
    console.log('💵 Amount: 10 XRP');
    console.log('⚡ Type: MARKET ORDER');
    console.log('');
    console.log('⚠️  THIS WILL USE REAL MONEY - CONFIRM BEFORE PROCEEDING');
    
    // For safety, let's just simulate the order call without actually executing
    // To actually execute, uncomment the line below:
    // const order = await binance.createMarketBuyOrder('XRP/USDT', 10);
    
    console.log('💡 Trade simulation completed - to execute real trades, uncomment the order line');
    
    // Show what the order would look like
    const ticker = await binance.fetchTicker('XRP/USDT');
    const estimatedCost = ticker.last * 10;
    
    console.log('📊 Estimated order details:');
    console.log(`   Price: $${ticker.last}`);
    console.log(`   Quantity: 10 XRP`);
    console.log(`   Estimated cost: $${estimatedCost.toFixed(2)}`);
    
  } catch (error) {
    console.log(`❌ Trade execution failed: ${error.message}`);
  }
}

// Run the test
executeRealTrade().catch(console.error);