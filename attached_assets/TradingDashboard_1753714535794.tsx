import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export default function TradingDashboard() {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { symbol: 'AAPL', price: 152.80, change: 2.55, changePercent: 1.7, volume: 45234567 },
    { symbol: 'TSLA', price: 238.90, change: -6.70, changePercent: -2.7, volume: 32145678 },
    { symbol: 'MSFT', price: 420.80, change: 8.20, changePercent: 2.0, volume: 28456789 },
    { symbol: 'GOOGL', price: 142.65, change: -1.35, changePercent: -0.9, volume: 19876543 },
    { symbol: 'AMZN', price: 178.25, change: 3.45, changePercent: 2.0, volume: 35678901 }
  ]);

  const [showPrices, setShowPrices] = useState(true);

  // Simulate live market data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(stock => {
        const changeAmount = (Math.random() - 0.5) * 4; // Random change
        const newPrice = Math.max(0, stock.price + changeAmount);
        const change = newPrice - (stock.price - stock.change);
        const changePercent = (change / (newPrice - change)) * 100;
        
        return {
          ...stock,
          price: newPrice,
          change,
          changePercent,
          volume: stock.volume + Math.floor(Math.random() * 100000)
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Trading Dashboard</h1>
          <p className="text-gray-600">Real-time market data and bot performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPrices(!showPrices)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showPrices ? <EyeOff size={16} /> : <Eye size={16} />}
            {showPrices ? 'Hide Prices' : 'Show Prices'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {showPrices ? '$12,847.50' : '••••••'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-600 text-sm font-medium">+2.4%</span>
            <span className="text-gray-500 text-sm ml-2">vs yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's P&L</p>
              <p className="text-2xl font-bold text-green-600">
                {showPrices ? '+$284.30' : '••••••'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-600 text-sm font-medium">+1.8%</span>
            <span className="text-gray-500 text-sm ml-2">return</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">73.2%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-purple-600 text-sm font-medium">156/213</span>
            <span className="text-gray-500 text-sm ml-2">trades</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Trades</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <LineChart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-orange-600 text-sm font-medium">2 pending</span>
            <span className="text-gray-500 text-sm ml-2">orders</span>
          </div>
        </div>
      </div>

      {/* Market Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Live Market Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marketData.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{stock.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-mono">
                      {showPrices ? `$${stock.price.toFixed(2)}` : '••••••'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`font-mono ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {showPrices ? (
                        `${stock.change >= 0 ? '+' : ''}$${stock.change.toFixed(2)}`
                      ) : '••••••'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center font-mono ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.changePercent >= 0 ? (
                        <ArrowUpRight size={16} className="mr-1" />
                      ) : (
                        <ArrowDownRight size={16} className="mr-1" />
                      )}
                      {showPrices ? `${stock.changePercent.toFixed(2)}%` : '••••'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900 font-mono">
                      {stock.volume.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors">
                        Buy
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors">
                        Sell
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}