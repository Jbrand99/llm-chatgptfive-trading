import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  status: 'filled' | 'pending' | 'cancelled';
}

interface BotConfig {
  strategy: string;
  riskLevel: number;
  maxPositions: number;
  stopLoss: number;
  takeProfit: number;
}

export default function TradingBot() {
  const [isActive, setIsActive] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [positions, setPositions] = useState<Position[]>([
    {
      symbol: 'AAPL',
      quantity: 10,
      avgPrice: 150.25,
      currentPrice: 152.80,
      pnl: 25.50,
      pnlPercent: 1.7
    },
    {
      symbol: 'TSLA',
      quantity: 5,
      avgPrice: 245.60,
      currentPrice: 238.90,
      pnl: -33.50,
      pnlPercent: -2.7
    }
  ]);
  
  const [recentTrades, setRecentTrades] = useState<Trade[]>([
    {
      id: '1',
      symbol: 'AAPL',
      side: 'buy',
      quantity: 10,
      price: 150.25,
      timestamp: '2025-01-27 14:30:15',
      status: 'filled'
    },
    {
      id: '2',
      symbol: 'MSFT',
      side: 'sell',
      quantity: 8,
      price: 420.80,
      timestamp: '2025-01-27 14:28:42',
      status: 'filled'
    }
  ]);

  const [botConfig, setBotConfig] = useState<BotConfig>({
    strategy: 'momentum',
    riskLevel: 3,
    maxPositions: 5,
    stopLoss: 2,
    takeProfit: 5
  });

  const [apiKeys, setApiKeys] = useState({
    alpacaKey: '',
    alpacaSecret: '',
    endpoint: 'https://replit.com/@zopzopzop2025/AlpacaConnect-1'
  });

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');

  // Simulate live price updates
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => {
        const priceChange = (Math.random() - 0.5) * 2; // Random price movement
        const newPrice = Math.max(0, pos.currentPrice + priceChange);
        const pnl = (newPrice - pos.avgPrice) * pos.quantity;
        const pnlPercent = ((newPrice - pos.avgPrice) / pos.avgPrice) * 100;
        
        return {
          ...pos,
          currentPrice: newPrice,
          pnl,
          pnlPercent
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const connectToAPI = async () => {
    setConnectionStatus('connecting');
    
    // Simulate API connection
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  const toggleBot = () => {
    setIsActive(!isActive);
  };

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);

  return (
    <div className="w-96 h-screen bg-gray-900 text-white border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trading Bot</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-400 capitalize">{connectionStatus}</span>
          </div>
        </div>

        {/* API Connection */}
        {connectionStatus === 'disconnected' && (
          <div className="space-y-2 mb-4">
            <input
              type="text"
              placeholder="Alpaca API Key"
              value={apiKeys.alpacaKey}
              onChange={(e) => setApiKeys(prev => ({ ...prev, alpacaKey: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm"
            />
            <input
              type="password"
              placeholder="Alpaca Secret Key"
              value={apiKeys.alpacaSecret}
              onChange={(e) => setApiKeys(prev => ({ ...prev, alpacaSecret: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm"
            />
            <button
              onClick={connectToAPI}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
            >
              Connect to AlpacaConnect
            </button>
          </div>
        )}

        {/* Bot Controls */}
        <div className="flex gap-2">
          <button
            onClick={toggleBot}
            disabled={connectionStatus !== 'connected'}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
              isActive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {isActive ? 'Stop Bot' : 'Start Bot'}
          </button>
          <button className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Account Summary */}
      <div className="p-4 border-b border-gray-700">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Balance</span>
            <span className="font-mono text-green-400">${balance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total P&L</span>
            <span className={`font-mono ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Active Positions</span>
            <span className="font-mono">{positions.length}</span>
          </div>
        </div>
      </div>

      {/* Bot Status */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={16} className={isActive ? 'text-green-400' : 'text-gray-400'} />
          <span className="font-medium">
            {isActive ? 'Bot Active' : 'Bot Inactive'}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Strategy: {botConfig.strategy.toUpperCase()} | Risk: {botConfig.riskLevel}/5
        </div>
      </div>

      {/* Positions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <DollarSign size={16} />
            Positions
          </h3>
          <div className="space-y-2">
            {positions.map((position, index) => (
              <div key={index} className="bg-gray-800 rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{position.symbol}</span>
                  <div className="flex items-center gap-1">
                    {position.pnl >= 0 ? (
                      <TrendingUp size={12} className="text-green-400" />
                    ) : (
                      <TrendingDown size={12} className="text-red-400" />
                    )}
                    <span className={`text-xs ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Qty: {position.quantity}</span>
                    <span>Avg: ${position.avgPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current: ${position.currentPrice.toFixed(2)}</span>
                    <span className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trades */}
        <div className="p-4 border-t border-gray-700">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Clock size={16} />
            Recent Trades
          </h3>
          <div className="space-y-2">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="bg-gray-800 rounded p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{trade.symbol}</span>
                  <div className="flex items-center gap-1">
                    {trade.status === 'filled' ? (
                      <CheckCircle size={12} className="text-green-400" />
                    ) : trade.status === 'pending' ? (
                      <Clock size={12} className="text-yellow-400" />
                    ) : (
                      <AlertCircle size={12} className="text-red-400" />
                    )}
                    <span className={`text-xs px-1 py-0.5 rounded ${
                      trade.side === 'buy' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                    }`}>
                      {trade.side.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>{trade.quantity} @ ${trade.price.toFixed(2)}</span>
                    <span>{new Date(trade.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}