import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface TradingInterfaceProps {
  accountId: string;
  cash: string;
  buyingPower: string;
}

export function TradingInterface({ accountId, cash, buyingPower }: TradingInterfaceProps) {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderType, setOrderType] = useState("market");
  const [side, setSide] = useState("buy");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tradeMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest("POST", `/api/accounts/${accountId}/orders`, orderData);
    },
    onSuccess: (response: any) => {
      toast({
        title: "Order Submitted",
        description: `${side.toUpperCase()} order for ${quantity} shares of ${symbol} submitted successfully`,
      });
      // Reset form
      setSymbol("");
      setQuantity("");
      // Refresh account data
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
    onError: (error: any) => {
      toast({
        title: "Trade Failed",
        description: error.message || "Failed to submit order",
        variant: "destructive",
      });
    },
  });

  const handleTrade = () => {
    if (!symbol || !quantity) {
      toast({
        title: "Missing Information",
        description: "Please enter symbol and quantity",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      symbol: symbol.toUpperCase(),
      qty: quantity,
      side,
      type: orderType,
      time_in_force: "day"
    };

    tradeMutation.mutate(orderData);
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value || '0'));
  };

  const availableCash = parseFloat(cash || '0');
  const canTrade = availableCash > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Live Trading Interface
        </CardTitle>
        <CardDescription>
          Place real trades with your live account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canTrade && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Account Not Funded</p>
                <p>Your account shows {formatCurrency(cash)} balance. Fund your account through alpaca.markets to start trading.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Available Cash</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(cash)}</p>
          </div>
          <div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Buying Power</span>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(buyingPower)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              placeholder="AAPL"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Side</Label>
            <Select value={side} onValueChange={setSide}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Order Type</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleTrade} 
          disabled={tradeMutation.isPending || !canTrade}
          className="w-full"
          variant={side === "buy" ? "default" : "destructive"}
        >
          {tradeMutation.isPending ? "Submitting..." : `${side.toUpperCase()} ${symbol || "Stock"}`}
        </Button>
      </CardContent>
    </Card>
  );
}