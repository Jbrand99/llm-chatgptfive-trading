import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  PlayCircle,
  StopCircle,
  Wallet,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveTradingStatus {
  isRunning: boolean;
  alpacaConfigured: boolean;
  web3FallbacksAvailable: number;
  endpoint: string;
}

interface AlpacaAccount {
  id: string;
  account_number: string;
  status: string;
  buying_power: string;
  cash: string;
  portfolio_value: string;
  daytrading_buying_power: string;
  pattern_day_trader: boolean;
  trading_blocked: boolean;
  account_blocked: boolean;
}

export default function LiveTradingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch live trading status
  const { data: status, isLoading: statusLoading } = useQuery<LiveTradingStatus>({
    queryKey: ['/api/live-trading/status'],
    refetchInterval: 5000,
  });

  // Fetch account data
  const { data: account, isLoading: accountLoading } = useQuery<AlpacaAccount>({
    queryKey: ['/api/connections/1/account'],
    refetchInterval: 10000,
  });

  // Start live trading
  const startTradingMutation = useMutation({
    mutationFn: () => apiRequest('/api/live-trading/start', 'POST'),
    onSuccess: () => {
      toast({
        title: "Live Trading Started",
        description: "Real money trading is now active with Web3 fallback enabled"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/live-trading/status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Start Trading",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Stop live trading
  const stopTradingMutation = useMutation({
    mutationFn: () => apiRequest('/api/live-trading/stop', 'POST'),
    onSuccess: () => {
      toast({
        title: "Live Trading Stopped",
        description: "All trading operations have been halted"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/live-trading/status'] });
    }
  });

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Trading System</h1>
        <p className="text-muted-foreground">
          Real money trading with Alpaca API and Web3 fallback system
        </p>
      </div>

      {/* Trading Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trading Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status?.isRunning ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <StopCircle className="h-3 w-3 mr-1" />
                  STOPPED
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alpaca API</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {status?.alpacaConfigured ? (
                <Badge variant="default" className="bg-blue-500">
                  CONNECTED
                </Badge>
              ) : (
                <Badge variant="destructive">
                  NOT CONFIGURED
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Web3 Fallback</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={status?.web3FallbacksAvailable ? "default" : "secondary"}>
                {status?.web3FallbacksAvailable || 0}/4 READY
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {account?.status === 'ACTIVE' ? (
                <Badge variant="default" className="bg-green-500">
                  {account.status}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {account?.status || 'UNKNOWN'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      {account && (
        <Card>
          <CardHeader>
            <CardTitle>Alpaca Account #{account.account_number}</CardTitle>
            <CardDescription>
              Live trading account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Buying Power</p>
                <p className="text-2xl font-bold">{formatCurrency(account.buying_power)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cash</p>
                <p className="text-2xl font-bold">{formatCurrency(account.cash)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">{formatCurrency(account.portfolio_value)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Day Trading Power</p>
                <p className="text-2xl font-bold">{formatCurrency(account.daytrading_buying_power)}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pattern Day Trader</p>
                <Badge variant={account.pattern_day_trader ? "destructive" : "secondary"}>
                  {account.pattern_day_trader ? "YES" : "NO"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trading Blocked</p>
                <Badge variant={account.trading_blocked ? "destructive" : "default"}>
                  {account.trading_blocked ? "BLOCKED" : "ENABLED"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Blocked</p>
                <Badge variant={account.account_blocked ? "destructive" : "default"}>
                  {account.account_blocked ? "BLOCKED" : "ACTIVE"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Controls</CardTitle>
          <CardDescription>
            Start or stop live trading operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            {!status?.isRunning ? (
              <Button
                onClick={() => startTradingMutation.mutate()}
                disabled={startTradingMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Live Trading
              </Button>
            ) : (
              <Button
                onClick={() => stopTradingMutation.mutate()}
                disabled={stopTradingMutation.isPending}
                variant="destructive"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Stop Trading
              </Button>
            )}
          </div>

          {account?.trading_blocked && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Trading Restricted
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your account has trading restrictions. This may be due to:
                    </p>
                    <ul className="list-disc list-inside mt-1">
                      <li>Insufficient account funding</li>
                      <li>Account verification pending</li>
                      <li>Regulatory restrictions</li>
                    </ul>
                    <p className="mt-2">
                      Web3 fallback system will automatically activate for blockchain-based trades.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Configuration and connection details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trading Endpoint</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {status?.endpoint}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">XRP Withdrawal Address</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                rB1kVfLSxpXCw7sLCBcm5LFZYzkS6xmwSK
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Features Enabled:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Real-time market analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Automated position management</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Web3 fallback system</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Automatic XRP withdrawals</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}