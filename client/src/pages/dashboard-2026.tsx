import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { 
  TrendingUp, 
  Bell, 
  Settings, 
  Brain, 
  Zap, 
  Wallet, 
  Activity, 
  BarChart3,
  Shield,
  Bot,
  Sparkles,
  Target,
  Globe,
  DollarSign,
  ChevronRight,
  Play,
  Pause
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { ConnectionStatus } from "@/components/connection-status";
import { AccountLinking } from "@/components/account-linking";
import { AccountOverview } from "@/components/account-overview";
import { RecentActivity } from "@/components/recent-activity";
import { RealTimeTracker } from "@/components/real-time-tracker";
// Legacy components commented out to avoid errors
// import { ErrorHandling } from "@/components/error-handling";
// import { TransferHistory } from "@/components/transfer-history";
// import { TradingInterface } from "@/components/trading-interface";
// import { BrokerAccountManager } from "@/components/broker-account-manager";
// import { BrokerAccountDisplay } from "@/components/broker-account-display";
// import { TradingAssetsSearch } from "@/components/trading-assets-search";
// import { JsonTransferManager } from "@/components/json-transfer-manager";
// import { BrokerTradingOrders } from "@/components/broker-trading-orders";
// import { SpecializedTradingBots } from "@/components/specialized-trading-bots";
// import AiTradingDashboard from "@/components/ai-trading-dashboard";
// import { Web3EarningsDashboard } from "@/components/web3-earnings-dashboard";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Connection } from "@shared/schema";

export default function Dashboard2026() {
  const { toast } = useToast();

  // Initialize connections on first load
  const initializeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/connections/initialize");
      return response.json();
    },
    onSuccess: () => {
      connectionsQuery.refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to initialize trading connections",
        variant: "destructive",
      });
    },
  });

  const connectionsQuery = useQuery<Connection[]>({
    queryKey: ["/api/connections"],
    refetchInterval: 10000, // Refresh every 10 seconds for live updates
  });

  // Bot status queries
  const aiTradingStatus = useQuery({
    queryKey: ["/api/ai-trading/status"],
    refetchInterval: 5000,
  });

  const gridBotStatus = useQuery({
    queryKey: ["/api/grid/status"],
    refetchInterval: 5000,
  });

  const momentumBotStatus = useQuery({
    queryKey: ["/api/momentum/status"],
    refetchInterval: 5000,
  });

  const arbitrageBotStatus = useQuery({
    queryKey: ["/api/arbitrage/status"],
    refetchInterval: 5000,
  });

  const faucetBotStatus = useQuery({
    queryKey: ["/api/faucet/status"],
    refetchInterval: 5000,
  });

  const web3Status = useQuery({
    queryKey: ["/api/web3/status"],
    refetchInterval: 5000,
  });

  // Funding status
  const fundingStatus = useQuery({
    queryKey: ["/api/funding/status"],
    refetchInterval: 5000,
  });

  // Auto-initialize on mount
  useEffect(() => {
    if (!connectionsQuery.data || connectionsQuery.data.length === 0) {
      initializeMutation.mutate();
    }
  }, []);

  const connections = connectionsQuery.data || [];
  const hasConnections = connections.length > 0;

  // Status indicators
  const getStatusColor = (isRunning: boolean, hasError = false) => {
    if (hasError) return "bg-red-500";
    return isRunning ? "bg-green-500" : "bg-gray-400";
  };

  const getStatusText = (isRunning: boolean, hasError = false) => {
    if (hasError) return "Error";
    return isRunning ? "Active" : "Inactive";
  };

  // Calculate total portfolio value
  const totalPortfolioValue = connections.reduce((total, conn) => {
    // This would be calculated from actual account data
    return total + 25000; // Example value
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black">
      {/* Navigation Header */}
      <nav className="border-b border-gray-800/50 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Alpaca AI Trading
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-500/20 text-green-400 bg-green-500/10">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Live Trading
            </Badge>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Real-Time Trading Tracker */}
        <RealTimeTracker />

        {/* Legacy Components (Hidden by default, can be toggled) */}
        <div className="space-y-6">
          <details className="group">
            <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors">
              <span className="text-sm">Legacy Dashboard Components</span>
            </summary>
            <div className="mt-6 space-y-6 opacity-50">
              {!hasConnections && (
                <Card className="border-amber-500/50 bg-amber-500/10">
                  <CardHeader>
                    <CardTitle className="text-amber-200 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Initialize Trading Connections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-amber-100">
                      Set up your Alpaca trading connections to begin automated trading.
                    </p>
                    <Button 
                      onClick={() => initializeMutation.mutate()}
                      disabled={initializeMutation.isPending}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {initializeMutation.isPending ? "Initializing..." : "Initialize Connections"}
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <div className="text-center text-gray-500 py-8">
                Legacy components available in development mode
              </div>
            </div>
          </details>
        </div>
      </div>

      {initializeMutation.isPending && (
        <LoadingOverlay message="Initializing trading connections..." />
      )}
    </div>
  );
}