import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Coins, TrendingUp, Zap, Network, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Web3Status {
  isRunning: boolean;
  totalEarnings: number;
  sources: Record<string, number>;
  networksConnected: number;
  lastUpdate: string;
  networks: Record<string, {
    connected: boolean;
    blockNumber?: number;
    latency?: number;
    error?: string;
  }>;
  mode: string;
}

export function Web3EarningsDashboard() {
  const { data: status, isLoading, error } = useQuery<Web3Status>({
    queryKey: ['/api/web3-defi/status'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const handleWithdraw = async () => {
    try {
      const response = await fetch('/api/web3-fallback/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: status?.totalEarnings || 0,
          currency: 'ETH',
          targetAddress: 'rB1kVfLSxpXCw7sLCBcm5LFZYzkS6xmwSK',
          network: 'ethereum'
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Withdrawal successful!\nTX: ${result.txHash}\nAmount: ${result.amount.toFixed(6)} ETH`);
      } else {
        alert(`❌ Withdrawal failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`❌ Withdrawal error: ${(error as Error).message}`);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Web3 Earnings Loading...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Web3 Earnings Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load Web3 earnings status: {(error as Error)?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const minWithdrawal = 0.0001;
  const canWithdraw = status.totalEarnings >= minWithdrawal;
  const withdrawalProgress = Math.min((status.totalEarnings / minWithdrawal) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-green-600" />
              Web3 Real Money Earnings
            </div>
            <Badge variant={status.isRunning ? "default" : "secondary"}>
              {status.isRunning ? "🟢 EARNING" : "⏸️ STOPPED"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Total Earnings */}
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {status.totalEarnings.toFixed(8)} ETH
            </div>
            <div className="text-sm text-gray-500">
              Total Earned • ${(status.totalEarnings * 2400).toFixed(2)} USD
            </div>
          </div>

          {/* Withdrawal Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Withdrawal Progress</span>
              <span>{withdrawalProgress.toFixed(1)}%</span>
            </div>
            <Progress value={withdrawalProgress} className="h-2" />
            <div className="text-xs text-gray-500 text-center">
              Minimum withdrawal: {minWithdrawal} ETH
            </div>
          </div>

          {/* Withdraw Button */}
          <Button 
            onClick={handleWithdraw}
            disabled={!canWithdraw}
            className="w-full"
            variant={canWithdraw ? "default" : "secondary"}
          >
            <Zap className="h-4 w-4 mr-2" />
            {canWithdraw 
              ? `Withdraw ${status.totalEarnings.toFixed(6)} ETH`
              : `Need ${(minWithdrawal - status.totalEarnings).toFixed(6)} more ETH`
            }
          </Button>

          <div className="text-xs text-center text-gray-500">
            🎯 Withdrawals sent to: rB1kVfLSxpXCw7sLCBcm5LFZYzkS6xmwSK
          </div>
        </CardContent>
      </Card>

      {/* Earning Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            DeFi Earning Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(status.sources).map(([protocol, amount]) => (
              <div key={protocol} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{protocol}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">
                    +{amount.toFixed(8)} ETH
                  </div>
                  <div className="text-xs text-gray-500">
                    ${(amount * 2400).toFixed(4)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Blockchain Networks ({status.networksConnected}/5)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(status.networks).map(([network, info]) => (
              <div key={network} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    info.connected ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium capitalize">{network}</span>
                </div>
                <div className="text-right text-sm">
                  {info.connected ? (
                    <div>
                      <div className="font-mono">#{info.blockNumber?.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{info.latency}ms</div>
                    </div>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Offline
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Mode:</span>
            <Badge variant="outline">{status.mode}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Last Update:</span>
            <span className="font-mono text-xs">
              {new Date(status.lastUpdate).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Auto-Refresh:</span>
            <Badge variant="outline">5s</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}