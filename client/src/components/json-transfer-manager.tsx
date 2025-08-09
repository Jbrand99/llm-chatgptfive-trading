import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, DollarSign, TrendingUp, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface JsonTransfer {
  id: number;
  transferId: string;
  fromBrokerAccountId: string;
  toTradingAccountId: string;
  transferType: 'funds' | 'assets' | 'data';
  amount?: string;
  assetSymbol?: string;
  assetQuantity?: string;
  status: string;
  metadata?: any;
  transferData: any;
  createdAt: string;
  updatedAt: string;
}

export function JsonTransferManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [transferType, setTransferType] = useState<'funds' | 'assets' | 'data'>('funds');
  const [fromAccount, setFromAccount] = useState('030f9db0-4313-42ed-bbd1-36b5bd83c185');
  const [toAccount, setToAccount] = useState('875807579');
  const [amount, setAmount] = useState('');
  const [assetSymbol, setAssetSymbol] = useState('');
  const [assetQuantity, setAssetQuantity] = useState('');
  const [transferData, setTransferData] = useState('{}');

  // Fetch JSON transfers for the broker account
  const { data: transfers = [], isLoading } = useQuery({
    queryKey: ['json-transfers', fromAccount],
    queryFn: async () => {
      const response = await fetch(`/api/broker-accounts/${fromAccount}/json-transfers`);
      if (!response.ok) throw new Error('Failed to fetch transfers');
      return response.json();
    },
    enabled: !!fromAccount,
  });

  const createTransferMutation = useMutation({
    mutationFn: async (transferData: any) => {
      const response = await fetch('/api/json-transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferData),
      });
      if (!response.ok) throw new Error('Failed to create transfer');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Transfer Created',
        description: 'JSON transfer has been successfully created and queued for processing.',
      });
      queryClient.invalidateQueries({ queryKey: ['json-transfers'] });
      // Reset form
      setAmount('');
      setAssetSymbol('');
      setAssetQuantity('');
      setTransferData('{}');
    },
    onError: (error: any) => {
      toast({
        title: 'Transfer Failed',
        description: error.message || 'Failed to create JSON transfer',
        variant: 'destructive',
      });
    },
  });

  const handleCreateTransfer = () => {
    try {
      const parsedTransferData = JSON.parse(transferData);
      
      const transfer = {
        fromBrokerAccountId: fromAccount,
        toTradingAccountId: toAccount,
        transferType,
        amount: transferType === 'funds' ? amount : undefined,
        assetSymbol: transferType === 'assets' ? assetSymbol : undefined,
        assetQuantity: transferType === 'assets' ? assetQuantity : undefined,
        metadata: {
          initiatedBy: 'user',
          timestamp: new Date().toISOString(),
          transferType,
        },
        transferData: parsedTransferData,
      };

      createTransferMutation.mutate(transfer);
    } catch (error) {
      toast({
        title: 'Invalid JSON',
        description: 'Please enter valid JSON in the transfer data field.',
        variant: 'destructive',
      });
    }
  };

  const getTransferIcon = (type: string) => {
    switch (type) {
      case 'funds': return <DollarSign className="w-4 h-4" />;
      case 'assets': return <TrendingUp className="w-4 h-4" />;
      case 'data': return <Database className="w-4 h-4" />;
      default: return <ArrowRightLeft className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Create Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Create JSON Transfer
          </CardTitle>
          <CardDescription>
            Transfer funds, assets, or data from broker account to trading account using JSON format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-account">From Broker Account</Label>
              <Input
                id="from-account"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                placeholder="Broker Account ID"
              />
            </div>
            <div>
              <Label htmlFor="to-account">To Trading Account</Label>
              <Input
                id="to-account"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                placeholder="Trading Account ID"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="transfer-type">Transfer Type</Label>
            <Select value={transferType} onValueChange={(value: any) => setTransferType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funds">Funds Transfer</SelectItem>
                <SelectItem value="assets">Assets Transfer</SelectItem>
                <SelectItem value="data">Data Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {transferType === 'funds' && (
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          )}

          {transferType === 'assets' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="asset-symbol">Asset Symbol</Label>
                <Input
                  id="asset-symbol"
                  value={assetSymbol}
                  onChange={(e) => setAssetSymbol(e.target.value)}
                  placeholder="AAPL"
                />
              </div>
              <div>
                <Label htmlFor="asset-quantity">Quantity</Label>
                <Input
                  id="asset-quantity"
                  type="number"
                  step="0.01"
                  value={assetQuantity}
                  onChange={(e) => setAssetQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="transfer-data">Transfer Data (JSON)</Label>
            <Textarea
              id="transfer-data"
              value={transferData}
              onChange={(e) => setTransferData(e.target.value)}
              placeholder='{"key": "value", "instructions": "Transfer details"}'
              className="min-h-20"
            />
          </div>

          <Button 
            onClick={handleCreateTransfer} 
            disabled={createTransferMutation.isPending}
            className="w-full"
          >
            {createTransferMutation.isPending ? 'Creating Transfer...' : 'Create Transfer'}
          </Button>
        </CardContent>
      </Card>

      {/* Transfer History */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>
            Recent JSON transfers from broker to trading account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading transfers...</div>
          ) : !Array.isArray(transfers) || transfers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transfers found. Create your first JSON transfer above.
            </div>
          ) : (
            <div className="space-y-3">
              {(transfers as JsonTransfer[]).map((transfer: JsonTransfer) => (
                <div key={transfer.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTransferIcon(transfer.transferType)}
                      <span className="font-medium">
                        {transfer.transferType.charAt(0).toUpperCase() + transfer.transferType.slice(1)} Transfer
                      </span>
                    </div>
                    <Badge className={getStatusColor(transfer.status)}>
                      {transfer.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>ID: {transfer.transferId}</div>
                    <div>From: {transfer.fromBrokerAccountId}</div>
                    <div>To: {transfer.toTradingAccountId}</div>
                    {transfer.amount && (
                      <div>Amount: ${parseFloat(transfer.amount).toLocaleString()}</div>
                    )}
                    {transfer.assetSymbol && (
                      <div>Asset: {transfer.assetQuantity} shares of {transfer.assetSymbol}</div>
                    )}
                    <div>Created: {new Date(transfer.createdAt).toLocaleString()}</div>
                  </div>
                  
                  {transfer.transferData && (
                    <details className="mt-2">
                      <summary className="text-sm cursor-pointer text-blue-600 hover:text-blue-800">
                        View Transfer Data
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(transfer.transferData, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}