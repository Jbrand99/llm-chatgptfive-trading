import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, TrendingUp, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Connection } from "@shared/schema";

interface ConnectionStatusProps {
  connections: Connection[];
  isLoading: boolean;
}

export function ConnectionStatus({ connections, isLoading }: ConnectionStatusProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/connections/refresh");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/health"] });
      toast({
        title: "Connections Refreshed",
        description: "Connection status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh connections",
        variant: "destructive",
      });
    },
  });

  const brokerConnection = connections.find(c => c.type === 'broker');
  const tradingConnection = connections.find(c => c.type === 'trading');

  const getStatusIcon = (status: string) => {
    return status === 'connected' ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-warning';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-success/10 text-success';
      case 'error': return 'bg-error/10 text-error';
      default: return 'bg-warning/10 text-warning';
    }
  };

  return (
    <div className="mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Connection Status</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending || isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Broker Account Connection */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Broker Account</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${brokerConnection?.status === 'connected' ? 'bg-success' : 'bg-error'}`}></div>
                  <Badge variant="secondary" className={getStatusBadgeColor(brokerConnection?.status || 'disconnected')}>
                    {brokerConnection?.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Endpoint:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">
                    {brokerConnection?.endpoint ? new URL(brokerConnection.endpoint).hostname : 'Not configured'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">API Key:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">
                    {brokerConnection?.apiKey ? `${brokerConnection.apiKey.substring(0, 8)}...` : 'Not configured'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Last Verified:</span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {brokerConnection?.lastVerified 
                      ? new Date(brokerConnection.lastVerified).toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Trading Account Connection */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">Trading Account</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${tradingConnection?.status === 'connected' ? 'bg-success' : 'bg-error'}`}></div>
                  <Badge variant="secondary" className={getStatusBadgeColor(tradingConnection?.status || 'disconnected')}>
                    {tradingConnection?.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Endpoint:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">
                    {tradingConnection?.endpoint ? new URL(tradingConnection.endpoint).hostname : 'Not configured'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">API Key:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">
                    {tradingConnection?.apiKey ? `${tradingConnection.apiKey.substring(0, 8)}...` : 'Not configured'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Last Verified:</span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {tradingConnection?.lastVerified 
                      ? new Date(tradingConnection.lastVerified).toLocaleString()
                      : 'Never'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
