import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Activity,
  Brain,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  Settings,
  Target,
  Shield,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Percent,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface TradingAlgorithm {
  id: number;
  name: string;
  strategy: string;
  status: 'active' | 'inactive' | 'paused';
  riskLevel: number;
  maxPositions: number;
  maxPositionSize: string;
  stopLossPercent: string;
  takeProfitPercent: string;
  config: any;
  createdAt: string;
  updatedAt: string;
}

interface AiPosition {
  id: number;
  algorithmId: number;
  symbol: string;
  side: 'long' | 'short';
  quantity: string;
  entryPrice: string;
  currentPrice: string;
  stopLoss: string;
  takeProfit: string;
  status: 'open' | 'closed' | 'closing';
  pnl: string;
  pnlPercent: string;
  openedAt: string;
  reason: string;
}

interface AiTrade {
  id: number;
  algorithmId: number;
  positionId: number;
  symbol: string;
  side: 'buy' | 'sell';
  orderType: string;
  quantity: string;
  price: string;
  fillPrice: string;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  orderId: string;
  confidence: string;
  signals: string[];
  executedAt: string;
}

interface MarketSignal {
  id: number;
  symbol: string;
  signalType: string;
  strength: string;
  timeframe: string;
  data: any;
  createdAt: string;
}

export default function AiTradingDashboard() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch AI algorithms
  const { data: algorithms = [], isLoading: algorithmsLoading } = useQuery({
    queryKey: ['/api/ai-trading/algorithms'],
    refetchInterval: 5000,
  });

  // Fetch AI positions
  const { data: positions = [], isLoading: positionsLoading } = useQuery({
    queryKey: ['/api/ai-trading/positions'],
    refetchInterval: 2000,
  });

  // Fetch AI trades
  const { data: trades = [], isLoading: tradesLoading } = useQuery({
    queryKey: ['/api/ai-trading/trades'],
    refetchInterval: 3000,
  });

  // Fetch market signals
  const { data: signals = [], isLoading: signalsLoading } = useQuery({
    queryKey: ['/api/ai-trading/signals'],
    refetchInterval: 5000,
  });

  // Toggle algorithm status mutation
  const toggleAlgorithmMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest('PATCH', `/api/ai-trading/algorithms/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading/algorithms'] });
      toast({
        title: "Algorithm Updated",
        description: "Algorithm status changed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update algorithm status",
      });
    },
  });

  // Auto-deploy mutation
  const autoDeployMutation = useMutation({
    mutationFn: async (deployData: any) => {
      const response = await apiRequest('POST', '/api/ai-trading/auto-deploy', deployData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading/positions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading/trades'] });
      toast({
        title: "Auto-Deploy Successful",
        description: `Position opened for ${data.symbol || 'unknown'} at ${data.price || 'market price'}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Auto-Deploy Failed",
        description: error.message || "Failed to deploy position",
      });
    },
  });

  // Auto-withdraw mutation
  const autoWithdrawMutation = useMutation({
    mutationFn: async (withdrawData: any) => {
      const response = await apiRequest('POST', '/api/ai-trading/auto-withdraw', withdrawData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading/positions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading/trades'] });
      toast({
        title: "Auto-Withdraw Successful",
        description: `Position closed for ${data.symbol || 'unknown'} with P&L: ${data.pnl || 'unknown'}`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Auto-Withdraw Failed",
        description: error.message || "Failed to close position",
      });
    },
  });

  // Market analysis mutation
  const marketAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai-trading/analyze-market', {
        symbols: ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'],
        timeframes: ['1Day', '1Hour']
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading/signals'] });
      toast({
        title: "Market Analysis Complete",
        description: "New market signals generated",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Market analysis failed",
      });
    },
  });

  const activeAlgorithms = (algorithms as TradingAlgorithm[]).filter((algo: TradingAlgorithm) => algo.status === 'active');
  const openPositions = (positions as AiPosition[]).filter((pos: AiPosition) => pos.status === 'open');
  const totalPnL = openPositions.reduce((sum: number, pos: AiPosition) => 
    sum + parseFloat(pos.pnl || '0'), 0
  );

  const recentTrades = (trades as AiTrade[]).slice(0, 10);
  const strongSignals = (signals as MarketSignal[]).filter((signal: MarketSignal) => 
    Math.abs(parseFloat(signal.strength)) > 50
  );

  const handleToggleAlgorithm = (algorithm: TradingAlgorithm) => {
    const newStatus = algorithm.status === 'active' ? 'inactive' : 'active';
    toggleAlgorithmMutation.mutate({ id: algorithm.id, status: newStatus });
  };

  const handleAutodeploy = (symbol: string, side: 'long' | 'short') => {
    if (!selectedAlgorithm) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an algorithm first",
      });
      return;
    }

    autoDeployMutation.mutate({
      algorithmId: selectedAlgorithm,
      symbol,
      side,
      confidence: 85,
      signals: ['Manual deploy', 'User initiated']
    });
  };

  const handleAutoWithdraw = (positionId: number, reason?: string) => {
    autoWithdrawMutation.mutate({
      positionId,
      reason: reason || 'Manual close',
      forceClose: true
    });
  };

  // Real money withdrawal mutation
  const realWithdrawMutation = useMutation({
    mutationFn: async (data: { amount: number; currency: string }) => {
      const response = await apiRequest('POST', '/api/cdp-withdrawal', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Real Money Withdrawal Successful",
          description: `${data.amount || 'Amount'} XRP sent to your wallet via CDP blockchain transaction`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Withdrawal Failed",
          description: data.error || "Real money withdrawal failed",
        });
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Withdrawal Error",
        description: error.message || "Failed to process real money withdrawal",
      });
    },
  });

  const handleRealWithdraw = (amount: number) => {
    realWithdrawMutation.mutate({
      amount,
      currency: 'XRP'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            AI Trading Engine
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Automated deployment and withdrawal system
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => marketAnalysisMutation.mutate()}
            disabled={marketAnalysisMutation.isPending}
            variant="outline"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {marketAnalysisMutation.isPending ? 'Analyzing...' : 'Analyze Market'}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Algorithms</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlgorithms.length}</div>
            <p className="text-xs text-muted-foreground">
              {algorithms.length} total algorithms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openPositions.length}</div>
            <p className="text-xs text-muted-foreground">
              Live trading positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalPnL.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Unrealized P&L
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Strong Signals</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{strongSignals.length}</div>
            <p className="text-xs text-muted-foreground">
              High confidence signals
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="algorithms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="signals">Market Signals</TabsTrigger>
          <TabsTrigger value="deploy">Quick Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="algorithms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Trading Algorithms</CardTitle>
              <CardDescription>
                Manage your automated trading strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {algorithmsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : algorithms.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No algorithms configured. Create your first AI trading algorithm.
                </div>
              ) : (
                <div className="space-y-4">
                  {algorithms.map((algorithm: TradingAlgorithm) => (
                    <div key={algorithm.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          algorithm.status === 'active' ? 'bg-green-500' : 
                          algorithm.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <div>
                          <h3 className="font-medium">{algorithm.name}</h3>
                          <p className="text-sm text-gray-500">
                            {algorithm.strategy} • Risk Level {algorithm.riskLevel}/5 • 
                            Max ${algorithm.maxPositionSize} per position
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={algorithm.status === 'active' ? 'default' : 'secondary'}>
                          {algorithm.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAlgorithm(algorithm.id)}
                          className={selectedAlgorithm === algorithm.id ? 'ring-2 ring-blue-500' : ''}
                        >
                          {selectedAlgorithm === algorithm.id ? 'Selected' : 'Select'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleToggleAlgorithm(algorithm)}
                          disabled={toggleAlgorithmMutation.isPending}
                        >
                          {algorithm.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Positions</CardTitle>
              <CardDescription>
                Monitor your live AI trading positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {positionsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : openPositions.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No open positions. Use auto-deploy to create positions.
                </div>
              ) : (
                <div className="space-y-4">
                  {openPositions.map((position: AiPosition) => (
                    <div key={position.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center gap-1 ${
                          position.side === 'long' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {position.side === 'long' ? 
                            <TrendingUp className="h-4 w-4" /> : 
                            <TrendingDown className="h-4 w-4" />
                          }
                          <span className="text-xs font-medium">{position.side.toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{position.symbol}</h3>
                          <p className="text-sm text-gray-500">
                            {position.quantity} shares @ ${parseFloat(position.entryPrice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          parseFloat(position.pnl || '0') >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${parseFloat(position.pnl || '0').toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parseFloat(position.pnlPercent || '0').toFixed(2)}%
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAutoWithdraw(position.id)}
                        disabled={autoWithdrawMutation.isPending}
                      >
                        Close Position
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>
                View your AI trading execution history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tradesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recentTrades.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No trades executed yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTrades.map((trade: AiTrade) => (
                    <div key={trade.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          trade.status === 'filled' ? 'bg-green-500' : 
                          trade.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <span className="font-medium">{trade.symbol}</span>
                          <span className={`ml-2 text-xs px-2 py-1 rounded ${
                            trade.side === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {trade.side.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {trade.quantity} @ ${parseFloat(trade.fillPrice || trade.price).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(trade.executedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Signals</CardTitle>
              <CardDescription>
                AI-generated market analysis and trading signals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {signalsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : signals.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No market signals generated yet. Run market analysis to generate signals.
                </div>
              ) : (
                <div className="space-y-3">
                  {signals.slice(0, 15).map((signal: MarketSignal) => (
                    <div key={signal.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium">{signal.symbol}</div>
                        <Badge variant="outline">{signal.signalType}</Badge>
                        <Badge variant="outline">{signal.timeframe}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={Math.abs(parseFloat(signal.strength))} 
                          className="w-20 h-2"
                        />
                        <span className={`text-sm font-medium ${
                          parseFloat(signal.strength) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {parseFloat(signal.strength) > 0 ? '+' : ''}{parseFloat(signal.strength).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real Money Withdrawal</CardTitle>
              <CardDescription>
                Test real CDP-funded withdrawals to your XRP wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-gray-600 mb-4">
                  Target Wallet: <span className="font-mono text-blue-600">rB1kVfLSxpXCw7sLCBcm5LFZYzkS6xmwSK</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0.5, 1.0, 2.5].map(amount => (
                    <Button
                      key={amount}
                      onClick={() => handleRealWithdraw(amount)}
                      disabled={realWithdrawMutation.isPending}
                      variant="outline"
                      className="p-4 h-auto flex flex-col"
                    >
                      <DollarSign className="h-6 w-6 mb-2" />
                      <span className="text-lg font-bold">{amount} XRP</span>
                      <span className="text-xs text-gray-500">Real Money</span>
                    </Button>
                  ))}
                </div>
                
                {realWithdrawMutation.isPending && (
                  <div className="text-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Processing real money withdrawal...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Deploy</CardTitle>
              <CardDescription>
                Manually trigger AI auto-deploy for specific symbols
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedAlgorithm ? (
                <div className="text-center p-8">
                  <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-gray-600">Please select an algorithm first from the Algorithms tab.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Selected Algorithm: <span className="font-medium">
                      {(algorithms as TradingAlgorithm[]).find((a: TradingAlgorithm) => a.id === selectedAlgorithm)?.name}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'].map(symbol => (
                      <div key={symbol} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3">{symbol}</h3>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAutodeploy(symbol, 'long')}
                            disabled={autoDeployMutation.isPending}
                            className="flex-1"
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Buy (Long)
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAutodeploy(symbol, 'short')}
                            disabled={autoDeployMutation.isPending}
                            className="flex-1"
                          >
                            <TrendingDown className="h-4 w-4 mr-1" />
                            Sell (Short)
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}