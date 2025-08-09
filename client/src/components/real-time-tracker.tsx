import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, Clock, DollarSign, TrendingUp, Zap, Bot, Wallet } from "lucide-react";

interface BotStatus {
  isRunning: boolean;
  algorithms: number;
  openPositions: number;
  totalEarned?: Record<string, string>;
  exchanges?: number;
  totalFaucets?: number;
  totalClaimed?: number;
}

interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  amount?: string;
  currency?: string;
}

export function RealTimeTracker() {
  const [botStatuses, setBotStatuses] = useState<Record<string, BotStatus>>({});
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [totalEarnings, setTotalEarnings] = useState({ usd: 0, btc: 0, eth: 0, xrp: 0 });
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const fetchBotStatuses = async () => {
      try {
        const botTypes = ['grid', 'arbitrage', 'momentum', 'faucet', 'web3', 'funding', 'ai-trading'];
        const statuses: Record<string, BotStatus> = {};

        const responses = await Promise.all(
          botTypes.map(async (type) => {
            try {
              const response = await fetch(`/api/${type}/status`);
              if (response.ok) {
                const data = await response.json();
                return { type, data };
              }
            } catch (error) {
              console.error(`Failed to fetch ${type} status:`, error);
            }
            return { type, data: { isRunning: false, algorithms: 0, openPositions: 0 } };
          })
        );

        responses.forEach(({ type, data }) => {
          statuses[type] = data;
        });

        setBotStatuses(statuses);

        // Calculate total earnings
        let totalUsd = 0;
        let totalBtc = 0;
        let totalEth = 0;
        let totalXrp = 0;

        Object.values(statuses).forEach(status => {
          if (status.totalEarned) {
            totalBtc += parseFloat(status.totalEarned.BTC || '0');
            totalEth += parseFloat(status.totalEarned.ETH || '0');
            totalXrp += parseFloat(status.totalEarned.XRP || '0');
            totalUsd += parseFloat(status.totalEarned.USD || '0');
          }
        });

        setTotalEarnings({ usd: totalUsd, btc: totalBtc, eth: totalEth, xrp: totalXrp });

        // Add activity logs for running bots
        const runningBots = Object.entries(statuses).filter(([_, status]) => status.isRunning);
        if (runningBots.length > 0) {
          const newLog: ActivityLog = {
            id: Date.now().toString(),
            timestamp: new Date(),
            type: 'success',
            message: `${runningBots.length} trading bots active and earning`,
          };
          
          setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
        }

      } catch (error) {
        console.error('Failed to fetch bot statuses:', error);
      }
    };

    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/connections');
        if (response.ok) {
          const connections = await response.json();
          setConnectionCount(connections.length);
        }
      } catch (error) {
        console.error('Failed to fetch connections:', error);
      }
    };

    // Initial fetch
    fetchBotStatuses();
    fetchConnections();

    // Set up intervals
    const statusInterval = setInterval(fetchBotStatuses, 2000); // Every 2 seconds
    const connectionInterval = setInterval(fetchConnections, 5000); // Every 5 seconds

    return () => {
      clearInterval(statusInterval);
      clearInterval(connectionInterval);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusIcon = (isRunning: boolean) => {
    return isRunning ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'warning': return <AlertCircle className="h-3 w-3 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />;
      default: return <Clock className="h-3 w-3 text-blue-500" />;
    }
  };

  const totalRunningBots = Object.values(botStatuses).filter(status => status.isRunning).length;
  const totalAlgorithms = Object.values(botStatuses).reduce((sum, status) => sum + (status.algorithms || 0), 0);
  const totalPositions = Object.values(botStatuses).reduce((sum, status) => sum + (status.openPositions || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header with real-time clock */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Trading Operations</h2>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(currentTime)}
          </Badge>
          <Badge variant={totalRunningBots > 0 ? "default" : "destructive"}>
            {totalRunningBots} Active Bots
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Running Bots</p>
                <p className="text-2xl font-bold">{totalRunningBots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Algorithms</p>
                <p className="text-2xl font-bold">{totalAlgorithms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Open Positions</p>
                <p className="text-2xl font-bold">{totalPositions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-lg font-bold">${totalEarnings.usd.toFixed(4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bot Status Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Trading Bot Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(botStatuses).map(([botType, status]) => (
                <div key={botType} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.isRunning)}
                    <div>
                      <p className="font-medium capitalize">{botType.replace('-', ' ')} Bot</p>
                      <p className="text-sm text-muted-foreground">
                        {status.algorithms || 0} algorithms • {status.openPositions || 0} positions
                        {status.exchanges && ` • ${status.exchanges} exchanges`}
                        {status.totalFaucets && ` • ${status.totalFaucets} faucets`}
                      </p>
                    </div>
                  </div>
                  <Badge variant={status.isRunning ? "default" : "secondary"}>
                    {status.isRunning ? "ACTIVE" : "STOPPED"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Live Activity Feed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {activityLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Monitoring for trading activity...
                  </p>
                ) : (
                  activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-2 rounded border">
                      {getActivityIcon(log.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{log.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(log.timestamp)}
                          {log.amount && log.currency && (
                            <span className="ml-2">• {log.amount} {log.currency}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Earnings Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Earnings Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Bitcoin</p>
              <p className="text-xl font-bold">{totalEarnings.btc.toFixed(8)} BTC</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Ethereum</p>
              <p className="text-xl font-bold">{totalEarnings.eth.toFixed(6)} ETH</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">XRP</p>
              <p className="text-xl font-bold">{totalEarnings.xrp.toFixed(4)} XRP</p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">USD Value</p>
              <p className="text-xl font-bold">${totalEarnings.usd.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Target Info */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Withdrawal Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Address:</span>
              <span className="font-mono">rB1kVfLSxpXCw7sLCBcm5LFZYzkS6xmwSK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Memo Tag:</span>
              <span className="font-mono">606424328</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum Threshold:</span>
              <span>$0.25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="default">Auto-Withdraw Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}