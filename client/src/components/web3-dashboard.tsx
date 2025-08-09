import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, Bot, Zap, Coins, DollarSign, PlayCircle, StopCircle } from "lucide-react";
import { SpecializedTradingBots } from './specialized-trading-bots';
import { apiRequest } from '@/lib/queryClient';

interface OptimismStatus {
  isRunning: boolean;
  strategies: string[];
  totalEarned: number;
  network: string;
  protocolBalances: Record<string, { amount: number; symbol: string; usdValue: number }>;
  lastUpdate: string;
  message?: string;
}

interface Web3Status {
  isRunning: boolean;
  algorithms: number;
  openPositions: number;
  totalTrades: number;
  totalWithdrawals: number;
  xrpTarget: string;
  lastUpdate: string;
}

function OptimismMainnetDashboard() {
  const queryClient = useQueryClient();
  
  const { data: optimismStatus } = useQuery<OptimismStatus>({
    queryKey: ["/api/optimism/status"],
    refetchInterval: 5000,
  });

  const startOptimismEngine = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/optimism/start', 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/optimism/status'] });
    }
  });

  const stopOptimismEngine = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/optimism/stop', 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/optimism/status'] });
    }
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            OP Mainnet DeFi Engine
          </CardTitle>
          <CardDescription>
            Advanced DeFi strategies on Optimism Mainnet with automated XRP withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <Badge variant={optimismStatus?.isRunning ? "default" : "secondary"}>
                  {optimismStatus?.isRunning ? "RUNNING" : "STOPPED"}
                </Badge>
                {optimismStatus?.isRunning && (
                  <Badge variant="outline" className="animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    DeFi Trading
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Active Strategies</span>
              <span className="text-2xl font-bold">{optimismStatus?.strategies?.length || 0}</span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Total Earned (ETH)</span>
              <span className="text-2xl font-bold text-green-600">{optimismStatus?.totalEarned?.toFixed(6) || '0.000000'}</span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Network</span>
              <span className="text-sm font-semibold text-red-500">Optimism Mainnet</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Token Balances</CardTitle>
            <CardDescription>Claimed tokens awaiting trade execution</CardDescription>
          </CardHeader>
          <CardContent>
            {!optimismStatus?.protocolBalances || Object.keys(optimismStatus.protocolBalances).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No DeFi positions yet. Engine starting...
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(optimismStatus.protocolBalances).map(([token, balance]: [string, any]) => (
                  <div key={token} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{token}</span>
                    </div>
                    <span className="font-mono text-sm">
                      {typeof balance === 'number' ? balance.toFixed(8) : balance}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protocol Balances</CardTitle>
            <CardDescription>DeFi protocol positions and rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Velodrome (VELO)</span>
                <Badge variant="outline">45.5% APY</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Aave V3 (aETH)</span>
                <Badge variant="outline">3.2% APY</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Curve (CRV)</span>
                <Badge variant="outline">12.8% APY</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>OP Mainnet Native</span>
                <Badge variant="outline">Network Fees</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>DeFi Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge className="w-2 h-2 rounded-full p-0 bg-red-500" />
              Velodrome LP farming
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="w-2 h-2 rounded-full p-0 bg-blue-500" />
              Aave V3 lending
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="w-2 h-2 rounded-full p-0 bg-purple-500" />
              Curve yield farming
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge className="w-2 h-2 rounded-full p-0 bg-orange-500" />
              Auto-withdraw profits to XRP
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OP Mainnet Controls */}
      <Card>
        <CardHeader>
          <CardTitle>DeFi Engine Controls</CardTitle>
          <CardDescription>Start or stop the OP Mainnet DeFi strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button
              onClick={() => startOptimismEngine.mutate()}
              disabled={optimismStatus?.isRunning || startOptimismEngine.isPending}
              size="sm"
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600"
            >
              <PlayCircle className="h-4 w-4 mr-1" />
              {startOptimismEngine.isPending ? "Starting..." : "Start DeFi Engine"}
            </Button>
            <Button
              onClick={() => stopOptimismEngine.mutate()}
              disabled={!optimismStatus?.isRunning || stopOptimismEngine.isPending}
              size="sm"
              variant="destructive"
              className="flex-1"
            >
              <StopCircle className="h-4 w-4 mr-1" />
              {stopOptimismEngine.isPending ? "Stopping..." : "Stop Engine"}
            </Button>
          </div>
          {optimismStatus?.lastUpdate && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Last update: {new Date(optimismStatus.lastUpdate).toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface Position {
  id: string;
  symbol: string;
  side: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: string;
  status: string;
  algorithmId: string;
}

interface Withdrawal {
  id: string;
  amount: string;
  txHash: string;
  status: string;
  timestamp: string;
  triggerType: string;
}

interface Algorithm {
  id: string;
  name: string;
  isActive: boolean;
  description: string;
}

export function Web3Dashboard() {
  const { data: status } = useQuery<Web3Status>({
    queryKey: ["/api/web3/status"],
    refetchInterval: 5000,
  });

  const { data: positions } = useQuery<Position[]>({
    queryKey: ["/api/web3/positions"],
    refetchInterval: 10000,
  });

  const { data: withdrawals } = useQuery<Withdrawal[]>({
    queryKey: ["/api/web3/withdrawals"],
    refetchInterval: 15000,
  });

  const { data: algorithms } = useQuery<Algorithm[]>({
    queryKey: ["/api/web3/algorithms"],
    refetchInterval: 30000,
  });

  const openPositions = positions?.filter(p => p.status === 'open') || [];
  const totalPnl = openPositions.reduce((sum, pos) => sum + parseFloat(pos.pnl || '0'), 0);
  const totalWithdrawals = withdrawals?.reduce((sum, w) => sum + parseFloat(w.amount || '0'), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Web3 Crypto Trading Bot</h1>
          <p className="text-muted-foreground">
            Automated crypto trading with XRP withdrawals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status?.isRunning ? "default" : "secondary"} className="flex items-center gap-1">
            <Bot className="w-3 h-3" />
            {status?.isRunning ? "LIVE" : "OFFLINE"}
          </Badge>
          {status?.isRunning && (
            <Badge variant="outline" className="animate-pulse">
              <Zap className="w-3 h-3 mr-1" />
              Auto-Trading
            </Badge>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.isRunning ? "RUNNING" : "STOPPED"}
            </div>
            <p className="text-xs text-muted-foreground">
              {status?.algorithms || 0} algorithms active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openPositions.length}</div>
            <p className="text-xs text-muted-foreground">
              P&L: ${totalPnl.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">XRP Withdrawals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{withdrawals?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {totalWithdrawals.toFixed(2)} XRP
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Address</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono break-all">
              rB1Gbk...yGV8j
            </div>
            <p className="text-xs text-muted-foreground">
              Tag: 606424328
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="positions">Live Positions</TabsTrigger>
          <TabsTrigger value="withdrawals">XRP Withdrawals</TabsTrigger>
          <TabsTrigger value="algorithms">Trading Bots</TabsTrigger>
          <TabsTrigger value="specialized">Specialized Bots</TabsTrigger>
          <TabsTrigger value="optimism">OP Mainnet</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Positions</CardTitle>
              <CardDescription>
                Real-time cryptocurrency positions with auto-withdraw
              </CardDescription>
            </CardHeader>
            <CardContent>
              {openPositions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No open positions. Bot is analyzing markets...
                </div>
              ) : (
                <div className="space-y-4">
                  {openPositions.map((position: any, index: number) => (
                    <div key={position.id || index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Position #{position.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {position.side} • Entry: ${parseFloat(position.entryPrice || '0').toFixed(4)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            parseFloat(position.pnl || '0') >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${parseFloat(position.pnl || '0').toFixed(2)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {parseFloat(position.pnlPercent || '0').toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span>Amount: {parseFloat(position.amount || '0').toFixed(4)}</span>
                        <span>Current: ${parseFloat(position.currentPrice || '0').toFixed(4)}</span>
                        <span>Stop: ${parseFloat(position.stopLoss || '0').toFixed(4)}</span>
                        <span>Target: ${parseFloat(position.takeProfit || '0').toFixed(4)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>XRP Auto-Withdrawals</CardTitle>
              <CardDescription>
                Automatic profit withdrawals to your XRP wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!withdrawals || withdrawals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No withdrawals yet. Profits will auto-withdraw to XRP address.
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawals.map((withdrawal: any, index: number) => (
                    <div key={withdrawal.id || index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{withdrawal.asset} Withdrawal</h4>
                          <p className="text-sm text-muted-foreground">
                            To: {withdrawal.targetAddress?.substring(0, 10)}...{withdrawal.targetAddress?.substring(-4)}
                          </p>
                          {withdrawal.destinationTag && (
                            <p className="text-xs text-muted-foreground">
                              Tag: {withdrawal.destinationTag}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {parseFloat(withdrawal.amount || '0').toFixed(2)} XRP
                          </div>
                          <Badge variant={withdrawal.status === 'confirmed' ? 'default' : 'secondary'}>
                            {withdrawal.status}
                          </Badge>
                        </div>
                      </div>
                      {withdrawal.txHash && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          TX: {withdrawal.txHash}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Trading Algorithms</CardTitle>
              <CardDescription>
                Automated trading strategies and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!algorithms || algorithms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No algorithms configured. Setting up default XRP trader...
                </div>
              ) : (
                <div className="space-y-4">
                  {algorithms.map((algorithm: any, index: number) => (
                    <div key={algorithm.id || index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{algorithm.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Strategy: {algorithm.strategy} • Risk: {algorithm.riskLevel}/10
                          </p>
                        </div>
                        <Badge variant={algorithm.status === 'active' ? 'default' : 'secondary'}>
                          {algorithm.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span>Max Position: ${algorithm.maxPositionSize}</span>
                        <span>Stop Loss: {algorithm.stopLossPercent}%</span>
                        <span>Take Profit: {algorithm.takeProfitPercent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialized" className="space-y-4">
          <SpecializedTradingBots />
        </TabsContent>

        <TabsContent value="optimism" className="space-y-4">
          <OptimismMainnetDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}