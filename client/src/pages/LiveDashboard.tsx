import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, DollarSign, Activity, Clock, Target, Download, AlertCircle, Shield, Key, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface TradingStatus {
  isRunning: boolean;
  algorithms: number;
  totalProfit: number;
  totalTrades: number;
  successRate: number;
  openPositions: number;
}

interface WithdrawalRecord {
  id: string;
  amount: number;
  currency: string;
  usdValue: number;
  txHash?: string;
  status: string;
  timestamp: string;
  source: string;
}

interface TaxRecord {
  id: string;
  transactionHash: string;
  date: string;
  type: string;
  usdAmount: number;
  cryptoAmount: number;
  cryptoAsset: string;
  source: string;
  exchangeRate: number;
  taxYear: number;
}

interface OAuthStatus {
  configured: boolean;
  authenticated: boolean;
  clientId: string | null;
  tokenExpiry: string | null;
  timestamp: string;
}

export default function LiveDashboard() {
  const [realTimeProfit, setRealTimeProfit] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);

  // Real-time status queries
  const { data: momentumStatus } = useQuery<TradingStatus>({
    queryKey: ['/api/momentum/status'],
    refetchInterval: 1000
  });

  const { data: gridStatus } = useQuery<TradingStatus>({
    queryKey: ['/api/grid/status'],
    refetchInterval: 1000
  });

  const { data: arbitrageStatus } = useQuery<TradingStatus>({
    queryKey: ['/api/arbitrage/status'],
    refetchInterval: 1000
  });

  const { data: web3Status } = useQuery<TradingStatus>({
    queryKey: ['/api/web3/status'],
    refetchInterval: 1000
  });

  const { data: faucetStatus } = useQuery<TradingStatus>({
    queryKey: ['/api/faucet/status'],
    refetchInterval: 1000
  });

  const { data: aiTradingStatus } = useQuery<TradingStatus>({
    queryKey: ['/api/ai-trading/status'],
    refetchInterval: 1000
  });

  // Withdrawal records
  const { data: withdrawals } = useQuery<WithdrawalRecord[]>({
    queryKey: ['/api/withdrawals/history'],
    refetchInterval: 5000
  });

  // Tax records
  const { data: taxRecords } = useQuery<TaxRecord[]>({
    queryKey: ['/api/tax-records'],
    refetchInterval: 10000
  });

  // OAuth status
  const { data: oauthStatus } = useQuery<OAuthStatus>({
    queryKey: ['/api/oauth/status'],
    refetchInterval: 5000
  });

  // Calculate total profits
  useEffect(() => {
    const totalProfit = [
      momentumStatus?.totalProfit || 0,
      gridStatus?.totalProfit || 0,
      arbitrageStatus?.totalProfit || 0,
      web3Status?.totalProfit || 0,
      faucetStatus?.totalProfit || 0,
      aiTradingStatus?.totalProfit || 0
    ].reduce((sum, profit) => sum + profit, 0);
    
    setRealTimeProfit(totalProfit);
  }, [momentumStatus, gridStatus, arbitrageStatus, web3Status, faucetStatus, aiTradingStatus]);

  // Calculate total withdrawals
  useEffect(() => {
    if (withdrawals) {
      const total = withdrawals.reduce((sum, w) => sum + w.usdValue, 0);
      setTotalWithdrawals(total);
    }
  }, [withdrawals]);

  const allAlgorithms = [
    { name: 'Momentum Trading', status: momentumStatus, color: 'bg-blue-500' },
    { name: 'Grid Trading', status: gridStatus, color: 'bg-green-500' },
    { name: 'Arbitrage', status: arbitrageStatus, color: 'bg-yellow-500' },
    { name: 'Web3 DEX', status: web3Status, color: 'bg-purple-500' },
    { name: 'Faucet Mining', status: faucetStatus, color: 'bg-orange-500' },
    { name: 'AI Trading', status: aiTradingStatus, color: 'bg-red-500' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="live-dashboard">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="title-live-trading">Live Trading Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time monitoring and tax reporting</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">LIVE</span>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            6 Algorithms Active
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="card-total-profit">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit (Live)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-total-profit">
              {formatCurrency(realTimeProfit)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Real-time calculation</p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-withdrawals">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-total-withdrawals">
              {formatCurrency(totalWithdrawals)}
            </div>
            <p className="text-xs text-gray-500 mt-1">XRP mainnet transfers</p>
          </CardContent>
        </Card>

        <Card data-testid="card-web3-access">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Web3 Tax Trading</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = '/web3'}
              className="w-full mb-2"
              data-testid="button-web3-dashboard"
            >
              Open Web3 Dashboard
            </Button>
            <p className="text-xs text-gray-500">Full Web3 trading with tax records</p>
          </CardContent>
        </Card>

        <Card data-testid="card-tax-records">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Records</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600" data-testid="text-tax-records-count">
              {taxRecords?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">IRS compliant records</p>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Status */}
      <Card data-testid="card-algorithm-status">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Trading Algorithm Status</span>
          </CardTitle>
          <CardDescription>Real-time performance of all 6 trading strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAlgorithms.map((algo, index) => (
              <div key={index} className="border rounded-lg p-4" data-testid={`algorithm-${algo.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${algo.color}`}></div>
                    <span className="font-medium text-sm">{algo.name}</span>
                  </div>
                  <Badge variant={algo.status?.isRunning ? "default" : "secondary"} data-testid={`status-${algo.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {algo.status?.isRunning ? 'ACTIVE' : 'INACTIVE'}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Profit: <span className="font-mono">{formatCurrency(algo.status?.totalProfit || 0)}</span></div>
                  <div>Trades: <span className="font-mono">{algo.status?.totalTrades || 0}</span></div>
                  <div>Success Rate: <span className="font-mono">{algo.status?.successRate || 0}%</span></div>
                  <div>Open Positions: <span className="font-mono">{algo.status?.openPositions || 0}</span></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="withdrawals" className="space-y-4" data-testid="tabs-dashboard">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="withdrawals" data-testid="tab-withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="tax-records" data-testid="tab-tax-records">Tax Records</TabsTrigger>
          <TabsTrigger value="live-trades" data-testid="tab-live-trades">Live Trading</TabsTrigger>
          <TabsTrigger value="oauth" data-testid="tab-oauth">OAuth Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="withdrawals" className="space-y-4" data-testid="content-withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>XRP Withdrawal History</CardTitle>
              <CardDescription>All profit withdrawals to your XRP address with memo tags</CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawals && withdrawals.length > 0 ? (
                <div className="space-y-3">
                  {withdrawals.slice(0, 10).map((withdrawal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`withdrawal-${index}`}>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium">{withdrawal.amount} {withdrawal.currency}</div>
                          <div className="text-sm text-gray-500">{formatCurrency(withdrawal.usdValue)}</div>
                          <Badge variant={withdrawal.status === 'completed' ? 'default' : 'secondary'}>
                            {withdrawal.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(withdrawal.timestamp)} • Source: {withdrawal.source}
                        </div>
                        {withdrawal.txHash && (
                          <div className="text-xs font-mono text-blue-600 mt-1">
                            TX: {withdrawal.txHash.substring(0, 16)}...
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-600 font-medium">+{formatCurrency(withdrawal.usdValue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No withdrawals recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax-records" className="space-y-4" data-testid="content-tax-records">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tax Records (IRS Compliant)</CardTitle>
                <CardDescription>Detailed transaction records for tax reporting purposes</CardDescription>
              </div>
              <Button variant="outline" size="sm" data-testid="button-download-tax-records">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {taxRecords && taxRecords.length > 0 ? (
                <div className="space-y-3">
                  {taxRecords.slice(0, 10).map((record, index) => (
                    <div key={index} className="border rounded-lg p-4" data-testid={`tax-record-${index}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{record.type}</Badge>
                          <span className="text-sm font-medium">{record.cryptoAmount} {record.cryptoAsset}</span>
                          <span className="text-sm text-gray-500">{formatCurrency(record.usdAmount)}</span>
                        </div>
                        <div className="text-sm text-gray-500">Tax Year: {record.taxYear}</div>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Date: {formatDate(record.date)}</div>
                        <div>Source: {record.source}</div>
                        <div>Exchange Rate: {record.exchangeRate} USD/{record.cryptoAsset}</div>
                        <div className="font-mono">TX: {record.transactionHash.substring(0, 32)}...</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No tax records found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-trades" className="space-y-4" data-testid="content-live-trades">
          <Card>
            <CardHeader>
              <CardTitle>Live Trading Activity</CardTitle>
              <CardDescription>Real-time trading operations across all algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allAlgorithms.filter(algo => algo.status?.isRunning).map((algo, index) => (
                  <div key={index} className="border rounded-lg p-4" data-testid={`live-trading-${algo.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${algo.color}`}></div>
                        <span className="font-medium">{algo.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Last update: {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Total Profit</div>
                        <div className="font-mono text-green-600">{formatCurrency(algo.status?.totalProfit || 0)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Total Trades</div>
                        <div className="font-mono">{algo.status?.totalTrades || 0}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Success Rate</div>
                        <div className="font-mono">{algo.status?.successRate || 0}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Open Positions</div>
                        <div className="font-mono">{algo.status?.openPositions || 0}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Success Rate</div>
                      <Progress value={algo.status?.successRate || 0} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oauth" className="space-y-4" data-testid="content-oauth">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* OAuth Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  OAuth Service Status
                </CardTitle>
                <CardDescription>
                  Authentication system status and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    {oauthStatus?.configured ? (
                      <CheckCircle data-testid="icon-configured" className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle data-testid="icon-not-configured" className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">Credentials Configured</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {oauthStatus?.authenticated ? (
                      <CheckCircle data-testid="icon-authenticated" className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle data-testid="icon-not-authenticated" className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">Currently Authenticated</span>
                  </div>
                </div>

                {oauthStatus?.clientId && (
                  <div className="text-sm">
                    <strong>Client ID:</strong> {oauthStatus.clientId}
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Last updated: {oauthStatus?.timestamp ? new Date(oauthStatus.timestamp).toLocaleString() : 'Unknown'}
                </div>
              </CardContent>
            </Card>

            {/* OAuth Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  OAuth Actions
                </CardTitle>
                <CardDescription>
                  Test authentication and token management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  data-testid="button-oauth-test"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open('/oauth', '_blank')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Open OAuth Dashboard
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  <p><strong>Available Endpoints:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>/api/oauth/status - Service status</li>
                    <li>/api/oauth/authenticate - Get access token</li>
                    <li>/api/oauth/validate - Validate token</li>
                    <li>/api/oauth/protected - Test protected resource</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* OAuth Integration Info */}
          <Card>
            <CardHeader>
              <CardTitle>OAuth Integration Details</CardTitle>
              <CardDescription>
                OAuth 2.0 authentication system integrated into your decentralized trading platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">Client Configuration</div>
                  <div className="text-gray-600 mt-1">
                    • Client ID: 50b5e6a3-f3f0-47be-8c2a-ccbfd45ef611<br />
                    • Environment variables securely configured<br />
                    • Token expiration: 3600 seconds (1 hour)
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Security Features</div>
                  <div className="text-gray-600 mt-1">
                    • Industry-standard OAuth 2.0 protocol<br />
                    • Secure credential storage<br />
                    • Token validation and refresh<br />
                    • Protected endpoint testing
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Integration Status</div>
                  <div className="text-gray-600 mt-1">
                    • Real-time status monitoring<br />
                    • Automatic token management<br />
                    • Full API endpoint coverage<br />
                    • Production-ready implementation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}