import React from 'react';
import TradingBot from './components/TradingBot';
import TradingDashboard from './components/TradingDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <TradingBot />
      <TradingDashboard />
    </div>
  );
}

export default App;
