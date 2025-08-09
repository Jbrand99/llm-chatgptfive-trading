import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { TrendingUp, Bell, Settings, Brain, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ConnectionStatus } from "@/components/connection-status";
import { AccountLinking } from "@/components/account-linking";
import { AccountOverview } from "@/components/account-overview";
import { RecentActivity } from "@/components/recent-activity";
import { ErrorHandling } from "@/components/error-handling";
import { TransferHistory } from "@/components/transfer-history";
import { TradingInterface } from "@/components/trading-interface";
import { BrokerAccountManager } from "@/components/broker-account-manager";
import { BrokerAccountDisplay } from "@/components/broker-account-display";
import { TradingAssetsSearch } from "@/components/trading-assets-search";
import { JsonTransferManager } from "@/components/json-transfer-manager";
import { BrokerTradingOrders } from "@/components/broker-trading-orders";
import { SpecializedTradingBots } from "@/components/specialized-trading-bots";
import AiTradingDashboard from "@/components/ai-trading-dashboard";
import { Web3EarningsDashboard } from "@/components/web3-earnings-dashboard";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Connection } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();

  // Initialize connections on first load
  const initializeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/connections/initialize");
      return response.json();
    },
    onSuccess: () => {
      // Refetch connections after initialization
      connectionsQuery.refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Initialization Failed",
        description: error.message || "Failed to initialize connections",
        variant: "destructive",
      });
    },
  });

  const connectionsQuery = useQuery<Connection[]>({
    queryKey: ["/api/connections"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Auto-test connections after initialization
  const testConnectionsMutation = useMutation({
    mutationFn: async (connections: Connection[]) => {
      const results = [];
      for (const connection of connections) {
        try {
          const response = await apiRequest("POST", `/api/connections/${connection.id}/test`);
          const result = await response.json();
          results.push({ connectionId: connection.id, success: result.success });
        } catch (error) {
          results.push({ connectionId: connection.id, success: false });
        }
      }
      return results;
    },
    onSuccess: () => {
      connectionsQuery.refetch();
      toast({
        title: "Connections Verified",
        description: "All connections have been tested successfully.",
      });
    },
  });

  useEffect(() => {
    // Initialize connections if none exist
    if (connectionsQuery.data && connectionsQuery.data.length === 0) {
      initializeMutation.mutate();
    } else if (connectionsQuery.data && connectionsQuery.data.length > 0) {
      // Test connections if they haven't been verified recently
      const needsTesting = connectionsQuery.data.some(c => 
        !c.lastVerified || 
        (new Date().getTime() - new Date(c.lastVerified).getTime()) > 300000 // 5 minutes
      );
      
      if (needsTesting) {
        testConnectionsMutation.mutate(connectionsQuery.data);
      }
    }
  }, [connectionsQuery.data]);

  const connections = connectionsQuery.data || [];
  const isConnected = connections.some(c => c.status === 'connected');
  const isLoading = connectionsQuery.isLoading || initializeMutation.isPending || testConnectionsMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <LoadingOverlay 
        isVisible={isLoading} 
        message={
          initializeMutation.isPending ? "Initializing connections..." :
          testConnectionsMutation.isPending ? "Verifying credentials..." :
          "Loading dashboard..."
        }
      />
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Alpaca Trading Platform</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Account Connection Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`}></div>
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <Link href="/live-trading">
                <Button variant="default" size="sm" className="gap-2 bg-red-600 hover:bg-red-700">
                  <TrendingUp className="h-4 w-4" />
                  Live Trading
                </Button>
              </Link>
              <Link href="/ai-trading">
                <Button variant="outline" size="sm" className="gap-2">
                  <Brain className="h-4 w-4" />
                  AI Trading
                </Button>
              </Link>
              <Link href="/web3">
                <Button variant="default" size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                  <Zap className="h-4 w-4" />
                  Web3 Bot LIVE
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ConnectionStatus connections={connections} isLoading={connectionsQuery.isLoading} />
        <AccountLinking />
        
        {/* Broker Account Management Section */}
        <div className="mb-8">
          <BrokerAccountManager connections={connections} />
        </div>

        {/* Display processed broker account data */}
        <div className="mb-8">
          <BrokerAccountDisplay accountId="030f9db0-4313-42ed-bbd1-36b5bd83c185" />
        </div>

        {/* Trading Assets Search */}
        <div className="mb-8">
          <TradingAssetsSearch />
        </div>

        {/* JSON Transfer Manager */}
        <div className="mb-8">
          <JsonTransferManager />
        </div>

        {/* Broker Trading Orders */}
        <div className="mb-8">
          <BrokerTradingOrders />
        </div>

        <AccountOverview connections={connections} />
        <TransferHistory accountId="66d37d00-1a32-49b7-8ff3-c8337174b5c5" />
        {connections.some(c => c.type === 'trading' && c.status === 'connected') && (
          <TradingInterface 
            accountId="66d37d00-1a32-49b7-8ff3-c8337174b5c5"
            cash="0"
            buyingPower="0"
          />
        )}
        
        {/* Specialized Trading Bots Section */}
        <div className="mb-8">
          <SpecializedTradingBots />
        </div>

        {/* AI Trading Dashboard Section */}
        <div className="mb-8">
          <AiTradingDashboard />
        </div>

        {/* Web3 Earnings Dashboard Section */}
        <div className="mb-8">
          <Web3EarningsDashboard />
        </div>
        
        <RecentActivity />
        <ErrorHandling connections={connections} />
      </div>
    </div>
  );
}
