import ccxt from 'ccxt';

/**
 * Real Trading Executor - Forces actual trades on live exchanges
 * Bypasses all simulation layers and executes real market orders
 */
export class RealTradingExecutor {
  private exchanges = new Map<string, ccxt.Exchange>();

  constructor() {
    this.initializeLiveExchanges();
  }

  private async initializeLiveExchanges() {
    console.log('🚀 INITIALIZING REAL TRADING EXECUTOR - LIVE MONEY ONLY');

    // Initialize Binance with LIVE credentials
    if (process.env.BINANCE_API_KEY && process.env.BINANCE_SECRET_KEY) {
      try {
        const binance = new ccxt.binance({
          apiKey: process.env.BINANCE_API_KEY,
          secret: process.env.BINANCE_SECRET_KEY,
          sandbox: false, // FORCE LIVE TRADING
          enableRateLimit: true,
        });

        // Test connection and verify LIVE mode
        await binance.loadMarkets();
        const balance = await binance.fetchBalance();
        
        this.exchanges.set('binance', binance);
        console.log('💰 BINANCE LIVE TRADING ENABLED');
        console.log('💳 Account Balance:', Object.keys(balance.total).filter(k => balance.total[k] > 0));
      } catch (error) {
        console.log(`❌ Binance live connection failed: ${error.message}`);
      }
    }

    // Initialize Bybit with LIVE credentials
    if (process.env.BYBIT_API_KEY && process.env.BYBIT_SECRET_KEY) {
      try {
        const bybit = new ccxt.bybit({
          apiKey: process.env.BYBIT_API_KEY,
          secret: process.env.BYBIT_SECRET_KEY,
          sandbox: false, // FORCE LIVE TRADING
          enableRateLimit: true,
        });

        await bybit.loadMarkets();
        const balance = await bybit.fetchBalance();
        
        this.exchanges.set('bybit', bybit);
        console.log('💰 BYBIT LIVE TRADING ENABLED');
        console.log('💳 Account Balance:', Object.keys(balance.total).filter(k => balance.total[k] > 0));
      } catch (error) {
        console.log(`❌ Bybit live connection failed: ${error.message}`);
      }
    }

    console.log(`🔥 ${this.exchanges.size} LIVE EXCHANGES READY FOR REAL MONEY TRADING`);
  }

  async executeRealTrade(params: {
    exchange: string;
    symbol: string;
    side: 'buy' | 'sell';
    amount: number;
    orderType?: 'market' | 'limit';
    price?: number;
  }) {
    const exchange = this.exchanges.get(params.exchange);
    if (!exchange) {
      throw new Error(`Exchange ${params.exchange} not connected`);
    }

    console.log('🚨 EXECUTING REAL MONEY TRADE');
    console.log(`💰 Exchange: ${params.exchange.toUpperCase()}`);
    console.log(`📊 Symbol: ${params.symbol}`);
    console.log(`📈 Side: ${params.side.toUpperCase()}`);
    console.log(`💵 Amount: ${params.amount}`);
    console.log(`⚡ Type: ${params.orderType || 'market'}`);

    try {
      let order;
      
      if (params.orderType === 'limit' && params.price) {
        // Place limit order
        order = await exchange.createLimitOrder(
          params.symbol,
          params.side,
          params.amount,
          params.price
        );
      } else {
        // Place market order (immediate execution)
        order = await exchange.createMarketOrder(
          params.symbol,
          params.side,
          params.amount
        );
      }

      console.log('✅ REAL TRADE EXECUTED SUCCESSFULLY');
      console.log(`📋 Order ID: ${order.id}`);
      console.log(`💰 Status: ${order.status}`);
      console.log(`💵 Filled: ${order.filled}/${order.amount}`);
      console.log(`💳 Cost: $${order.cost}`);

      return {
        success: true,
        orderId: order.id,
        status: order.status,
        filled: order.filled,
        cost: order.cost,
        fee: order.fee
      };

    } catch (error) {
      console.log('❌ REAL TRADE FAILED');
      console.log(`Error: ${error.message}`);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAccountBalance(exchange: string) {
    const exchangeObj = this.exchanges.get(exchange);
    if (!exchangeObj) {
      throw new Error(`Exchange ${exchange} not connected`);
    }

    try {
      const balance = await exchangeObj.fetchBalance();
      console.log(`💳 ${exchange.toUpperCase()} Balance:`);
      
      const nonZeroBalances = Object.entries(balance.total)
        .filter(([_, amount]) => amount > 0)
        .reduce((acc, [currency, amount]) => ({ ...acc, [currency]: amount }), {});
      
      console.log(nonZeroBalances);
      return nonZeroBalances;
    } catch (error) {
      console.log(`❌ Balance fetch failed: ${error.message}`);
      return {};
    }
  }

  async placeTestOrder() {
    console.log('🧪 PLACING TEST REAL MONEY ORDER');
    
    // Try a small XRP buy order on Binance
    return await this.executeRealTrade({
      exchange: 'binance',
      symbol: 'XRP/USDT',
      side: 'buy',
      amount: 10, // 10 XRP
      orderType: 'market'
    });
  }
}

export const realTrader = new RealTradingExecutor();