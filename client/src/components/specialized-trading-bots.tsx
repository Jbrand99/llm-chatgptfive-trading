import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import { 
  TrendingUp, 
  ArrowUpDown, 
  Grid3X3, 
  Zap, 
  PlayCircle, 
  StopCircle,
  Target,
  BarChart3,
  Activity,
  Wallet
} from 'lucide-react';

interface BotStatus {
  isRunning: boolean;
  algorithms: number;
  openPositions: number;
  totalTrades: number;
  totalWithdrawals: number;
  xrpTarget: string;
  lastUpdate: string;
  gridLevels?: number;
}

export function SpecializedTradingBots() {
  const queryClient = useQueryClient();
  
  // Bot status queries
  const { data: arbitrageStatus } = useQuery<BotStatus>({
    queryKey: ['/api/arbitrage/status'],
    refetchInterval: 5000
  });

  const { data: momentumStatus } = useQuery<BotStatus>({
    queryKey: ['/api/momentum/status'],
    refetchInterval: 5000
  });

  const { data: gridStatus } = useQuery<BotStatus>({
    queryKey: ['/api/grid/status'],
    refetchInterval: 5000
  });

  // Bot control mutations
  const startBot = useMutation({
    mutationFn: async (botType: string) => {
      return apiRequest(`/api/${botType}/start`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/arbitrage/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/momentum/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/grid/status'] });
    }
  });

  const stopBot = useMutation({
    mutationFn: async (botType: string) => {
      return apiRequest(`/api/${botType}/stop`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/arbitrage/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/momentum/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/grid/status'] });
    }
  });

  const BotCard = ({ 
    title, 
    description, 
    icon: Icon, 
    status, 
    botType, 
    features,
    color = "blue"
  }: {
    title: string;
    description: string;
    icon: any;
    status: BotStatus | undefined;
    botType: string;
    features: string[];
    color?: string;
  }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 text-${color}-500`} />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge 
            variant={status?.isRunning ? "default" : "secondary"}
            className={status?.isRunning ? "bg-green-500" : ""}
          >
            {status?.isRunning ? "LIVE" : "STOPPED"}
          </Badge>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Open Positions</p>
            <p className="text-2xl font-bold text-green-600">
              {status?.openPositions || 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-2xl font-bold text-blue-600">
              {status?.totalTrades || 0}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Algorithms</p>
            <p className="text-xl font-semibold">{status?.algorithms || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Withdrawals</p>
            <p className="text-xl font-semibold text-orange-600">
              {status?.totalWithdrawals || 0}
            </p>
          </div>
          {status?.gridLevels && (
            <div className="col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">Grid Levels Active</p>
              <p className="text-xl font-semibold text-purple-600">{status.gridLevels}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Features */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Features:</p>
          <div className="grid grid-cols-1 gap-1">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-xs text-muted-foreground">
                <div className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* XRP Target */}
        {status?.xrpTarget && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">XRP Withdrawal Address:</p>
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-orange-500" />
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {status.xrpTarget}
              </code>
            </div>
          </div>
        )}

        <Separator />

        {/* Controls */}
        <div className="flex space-x-2">
          <Button
            onClick={() => startBot.mutate(botType)}
            disabled={status?.isRunning || startBot.isPending}
            size="sm"
            variant="default"
            className="flex-1"
          >
            <PlayCircle className="h-4 w-4 mr-1" />
            {startBot.isPending ? "Starting..." : "Start Bot"}
          </Button>
          <Button
            onClick={() => stopBot.mutate(botType)}
            disabled={!status?.isRunning || stopBot.isPending}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            <StopCircle className="h-4 w-4 mr-1" />
            {stopBot.isPending ? "Stopping..." : "Stop Bot"}
          </Button>
        </div>

        {/* Last Update */}
        {status?.lastUpdate && (
          <p className="text-xs text-muted-foreground text-center">
            Last update: {new Date(status.lastUpdate).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Specialized Trading Bots</h2>
          <p className="text-muted-foreground">
            Advanced automated trading strategies with XRP auto-withdrawal
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50">
            <Activity className="h-3 w-3 mr-1" />
            Auto-Deploy Active
          </Badge>
          <Badge variant="outline" className="bg-orange-50">
            <Target className="h-3 w-3 mr-1" />
            XRP Target: rB1...GV8j
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BotCard
          title="Arbitrage Bot"
          description="Cross-exchange price difference capture"
          icon={ArrowUpDown}
          status={arbitrageStatus}
          botType="arbitrage"
          color="blue"
          features={[
            "Multi-exchange price monitoring",
            "Automatic profit opportunity detection",
            "Cross-platform arbitrage execution",
            "Risk-managed position sizing",
            "Auto-profit withdrawal to XRP"
          ]}
        />

        <BotCard
          title="Momentum Bot"
          description="High-frequency momentum scalping"
          icon={TrendingUp}
          status={momentumStatus}
          botType="momentum"
          color="green"
          features={[
            "Real-time technical analysis (RSI, MACD)",
            "High-frequency trading signals",
            "Momentum breakout detection",
            "Volume-based confirmation",
            "Auto-profit capture system"
          ]}
        />

        <BotCard
          title="Grid Bot"
          description="Range-bound multi-level trading"
          icon={Grid3X3}
          status={gridStatus}
          botType="grid"
          color="purple"
          features={[
            "Multi-level grid placement",
            "Automated order management",
            "Dynamic grid rebalancing",
            "Range-bound profit capture",
            "Grid profit auto-withdrawal"
          ]}
        />
      </div>

      {/* Combined Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Combined Trading Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {(arbitrageStatus?.openPositions || 0) + 
                 (momentumStatus?.openPositions || 0) + 
                 (gridStatus?.openPositions || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Open Positions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {(arbitrageStatus?.totalTrades || 0) + 
                 (momentumStatus?.totalTrades || 0) + 
                 (gridStatus?.totalTrades || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Trades Executed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {(arbitrageStatus?.totalWithdrawals || 0) + 
                 (momentumStatus?.totalWithdrawals || 0) + 
                 (gridStatus?.totalWithdrawals || 0)}
              </p>
              <p className="text-sm text-muted-foreground">XRP Withdrawals</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {(arbitrageStatus?.algorithms || 0) + 
                 (momentumStatus?.algorithms || 0) + 
                 (gridStatus?.algorithms || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Active Algorithms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}