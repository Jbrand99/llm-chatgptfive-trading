import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { QuickTransfer } from "@/components/quick-transfer";
import type { Account, ConnectionHealth } from "@shared/schema";

interface AccountOverviewProps {
  connections: any[];
}

export function AccountOverview({ connections }: AccountOverviewProps) {
  const tradingConnection = connections.find(c => c.type === 'trading');
  
  const { data: account, isLoading: accountLoading, refetch } = useQuery<Account>({
    queryKey: ["/api/connections", tradingConnection?.id, "account"],
    enabled: !!tradingConnection?.id,
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: 3,
  });

  const { data: healthData } = useQuery<ConnectionHealth[]>({
    queryKey: ["/api/health"],
  });

  const connectionHealth = healthData?.find(h => h.connectionId === tradingConnection?.id);

  const formatCurrency = (value: string | null | undefined) => {
    if (!value) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value));
  };

  if (accountLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Account Information */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account ID</label>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-mono bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded">
                    {account?.accountId || 'Not available'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Type</label>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {account?.accountType || 'Not available'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <Badge 
                    variant="secondary" 
                    className={account?.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${account?.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}></div>
                    {account?.status || 'Unknown'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Created</label>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {account?.createdAt ? new Date(account.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trading Permissions</label>
                  <div className="flex flex-wrap gap-1">
                    {account?.permissions && account.permissions.length > 0 ? (
                      account.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {permission}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500 dark:text-slate-400">No permissions data</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Day Trading BP</label>
                  <p className="text-sm text-slate-900 dark:text-slate-100 font-semibold">
                    {formatCurrency(account?.dayTradingBuyingPower)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Summary */}
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Portfolio Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Value</span>
                  <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(account?.portfolioValue)}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Buying Power</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(account?.buyingPower)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Cash</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(account?.cash)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Positions</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {account?.positionsCount || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Health */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Connection Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">API Response Time</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${connectionHealth?.responseTime && connectionHealth.responseTime < 100 ? 'bg-success' : 'bg-warning'}`}></div>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {connectionHealth?.responseTime ? `${connectionHealth.responseTime}ms` : 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Rate Limit</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {connectionHealth?.rateLimitUsed && connectionHealth?.rateLimit 
                    ? `${connectionHealth.rateLimitUsed}/${connectionHealth.rateLimit}`
                    : 'Unknown'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Last Error</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {connectionHealth?.lastError || 'None'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Transfer Component */}
        {account && (
          <QuickTransfer 
            accountId={account.accountId} 
            currentCash={account.cash || undefined}
            connections={connections}
            onTransferComplete={() => {
              // Refresh account data after transfer
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
}
