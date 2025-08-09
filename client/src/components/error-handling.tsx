import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ErrorHandlingProps {
  connections: any[];
}

export function ErrorHandling({ connections }: ErrorHandlingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [autoRetry, setAutoRetry] = useState(true);
  const [monitorHealth, setMonitorHealth] = useState(true);
  const [debugLogging, setDebugLogging] = useState(false);

  const testConnectionMutation = useMutation({
    mutationFn: async (connectionId: number) => {
      const response = await apiRequest("POST", `/api/connections/${connectionId}/test`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/health"] });
      toast({
        title: "Connection Test Successful",
        description: data.message || "Connection is working properly.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Test Failed",
        description: error.message || "Failed to test connection",
        variant: "destructive",
      });
    },
  });

  const resetCredentialsMutation = useMutation({
    mutationFn: async () => {
      // First reset, then initialize
      await apiRequest("POST", "/api/connections/reset");
      const response = await apiRequest("POST", "/api/connections/initialize");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accounts/linked"] });
      toast({
        title: "Connections Reset",
        description: "All connections have been reset and reinitialized successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset connections",
        variant: "destructive",
      });
    },
  });

  const hasErrors = connections.some(c => c.status === 'error');
  const tradingConnection = connections.find(c => c.type === 'trading');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Error Logs */}
      <Card>
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Error Logs</h3>
        </div>
        <CardContent className="p-6">
          {hasErrors ? (
            <div className="space-y-3">
              {connections
                .filter(c => c.status === 'error')
                .map((connection) => (
                  <div key={connection.id} className="flex items-start space-x-3 p-3 bg-error/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-error mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {connection.type === 'broker' ? 'Broker' : 'Trading'} Connection Error
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Failed to connect to {connection.endpoint}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">No recent errors detected</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">All API connections are functioning normally</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Settings */}
      <Card>
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Connection Settings</h3>
        </div>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="auto-retry"
              checked={autoRetry}
              onCheckedChange={(checked) => setAutoRetry(checked as boolean)}
            />
            <label htmlFor="auto-retry" className="text-sm text-slate-700 dark:text-slate-300">
              Auto-retry failed connections
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="monitor-health"
              checked={monitorHealth}
              onCheckedChange={(checked) => setMonitorHealth(checked as boolean)}
            />
            <label htmlFor="monitor-health" className="text-sm text-slate-700 dark:text-slate-300">
              Monitor connection health
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="debug-logging"
              checked={debugLogging}
              onCheckedChange={(checked) => setDebugLogging(checked as boolean)}
            />
            <label htmlFor="debug-logging" className="text-sm text-slate-700 dark:text-slate-300">
              Enable debug logging
            </label>
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex space-x-3">
              <Button 
                className="flex-1"
                onClick={() => tradingConnection && testConnectionMutation.mutate(tradingConnection.id)}
                disabled={testConnectionMutation.isPending || !tradingConnection}
              >
                Test Connection
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => resetCredentialsMutation.mutate()}
                disabled={resetCredentialsMutation.isPending}
              >
                Reset & Reconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
