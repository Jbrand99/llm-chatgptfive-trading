import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LinkedAccountData {
  linked: boolean;
  brokerAccount?: {
    id: string;
    number: string;
    status: string;
    connection: string;
  };
  tradingAccount?: {
    id: string;
    number: string;
    status: string;
    connection: string;
    linkedBrokerAccountId?: string;
  };
  message?: string;
}

export function AccountLinking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: linkData, isLoading } = useQuery<LinkedAccountData>({
    queryKey: ["/api/accounts/linked"],
    refetchInterval: 10000, // Check linking status every 10 seconds
  });

  const linkAccountsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/accounts/link", {
        brokerAccountNumber: linkData?.brokerAccount?.number,
        tradingAccountId: linkData?.tradingAccount?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts/linked"] });
      toast({
        title: "Accounts Linked Successfully",
        description: "Your broker and trading accounts are now connected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Linking Failed",
        description: error.message || "Failed to link accounts",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isLinked = linkData?.linked || false;
  const canLink = linkData?.brokerAccount?.connection === 'connected' && 
                  linkData?.tradingAccount?.connection === 'connected';

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Link className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Account Linking</h2>
            <Badge 
              variant="secondary" 
              className={isLinked ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}
            >
              {isLinked ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Linked
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Not Linked
                </>
              )}
            </Badge>
          </div>
          
          {!isLinked && canLink && (
            <Button
              onClick={() => linkAccountsMutation.mutate()}
              disabled={linkAccountsMutation.isPending}
              size="sm"
            >
              Link Accounts
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Broker Account */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Broker Account</h3>
              <Badge 
                variant="secondary" 
                className={linkData?.brokerAccount?.connection === 'connected' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}
              >
                {linkData?.brokerAccount?.connection === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Account #:</span>
                <span className="text-slate-900 dark:text-slate-100 font-mono">
                  {linkData?.brokerAccount?.number || '8803412SW'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Account ID:</span>
                <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">
                  {linkData?.brokerAccount?.id ? 
                    `${linkData.brokerAccount.id.substring(0, 8)}...` : 
                    '1f6be5f9...'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Status:</span>
                <span className="text-slate-900 dark:text-slate-100">
                  {linkData?.brokerAccount?.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Connection Arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center space-y-2">
              <ArrowRight className={`h-6 w-6 ${isLinked ? 'text-success' : 'text-slate-400'}`} />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isLinked ? 'Linked' : 'Not Linked'}
              </span>
            </div>
          </div>

          {/* Trading Account */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Trading Account</h3>
              <Badge 
                variant="secondary" 
                className={linkData?.tradingAccount?.connection === 'connected' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}
              >
                {linkData?.tradingAccount?.connection === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Account #:</span>
                <span className="text-slate-900 dark:text-slate-100 font-mono">
                  {linkData?.tradingAccount?.number || '875807579'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Account ID:</span>
                <span className="text-slate-900 dark:text-slate-100 font-mono text-xs">
                  {linkData?.tradingAccount?.id ? 
                    `${linkData.tradingAccount.id.substring(0, 8)}...` : 
                    'TAC875807579'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Status:</span>
                <span className="text-slate-900 dark:text-slate-100">
                  {linkData?.tradingAccount?.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!canLink && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning-foreground">
              Both accounts must be connected before they can be linked. Please ensure your API credentials are correct.
            </p>
          </div>
        )}

        {isLinked && (
          <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm text-success-foreground">
              ✓ Accounts successfully linked. Broker account {linkData?.brokerAccount?.number} is connected to trading account {linkData?.tradingAccount?.number}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}