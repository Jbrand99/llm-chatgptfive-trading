import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, DollarSign, Clock, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderResponse {
  id: string;
  client_order_id: string;
  created_at: string;
  symbol: string;
  qty: string;
  side: string;
  order_type: string;
  status: string;
  time_in_force: string;
  commission: string;
  filled_qty: string;
  filled_avg_price: string | null;
  expires_at: string;
}

export function BrokerTradingOrders() {
  const { toast } = useToast();
  
  const [symbol, setSymbol] = useState('AAPL');
  const [quantity, setQuantity] = useState('1');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [timeInForce, setTimeInForce] = useState<'day' | 'gtc'>('day');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOrderResponse, setLastOrderResponse] = useState<OrderResponse | null>(null);

  // Broker account ID from your successful example
  const brokerAccountId = '030f9db0-4313-42ed-bbd1-36b5bd83c185';

  const handlePlaceOrder = async () => {
    try {
      setIsSubmitting(true);
      
      // Build order payload matching your successful example format
      const orderPayload = {
        symbol: symbol.toUpperCase(),
        qty: parseInt(quantity),
        side,
        type: orderType,
        time_in_force: timeInForce,
        ...(orderType === 'limit' && { limit_price: parseFloat(limitPrice) }),
      };

      console.log('Placing order:', orderPayload);

      // Call the broker trading API endpoint
      const response = await fetch(`/api/broker-accounts/${brokerAccountId}/trading-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Order failed');
      }

      setLastOrderResponse(responseData);
      
      toast({
        title: 'Order Placed Successfully',
        description: `${side.toUpperCase()} ${quantity} shares of ${symbol} - Order ID: ${responseData.id}`,
      });

      // Reset form
      setSymbol('AAPL');
      setQuantity('1');
      setLimitPrice('');

    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted': return 'bg-blue-500';
      case 'filled': return 'bg-green-500';
      case 'canceled': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const formatCurrency = (value: string | null) => {
    if (!value || value === '0') return 'N/A';
    return `$${parseFloat(value).toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Order Placement Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Place Trading Order
          </CardTitle>
          <CardDescription>
            Place stock orders using Alpaca Broker API for account {brokerAccountId}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="AAPL"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="side">Order Side</Label>
              <Select value={side} onValueChange={(value: any) => setSide(value)}>
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
              <Label htmlFor="order-type">Order Type</Label>
              <Select value={orderType} onValueChange={(value: any) => setOrderType(value)}>
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

          {orderType === 'limit' && (
            <div>
              <Label htmlFor="limit-price">Limit Price ($)</Label>
              <Input
                id="limit-price"
                type="number"
                step="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="150.00"
              />
            </div>
          )}

          <div>
            <Label htmlFor="time-in-force">Time in Force</Label>
            <Select value={timeInForce} onValueChange={(value: any) => setTimeInForce(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="gtc">Good Till Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Order Preview</h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <div>{side.toUpperCase()} {quantity} shares of {symbol}</div>
              <div>Order Type: {orderType.toUpperCase()}</div>
              {orderType === 'limit' && limitPrice && (
                <div>Limit Price: ${limitPrice}</div>
              )}
              <div>Time in Force: {timeInForce.toUpperCase()}</div>
              <div>Account: {brokerAccountId}</div>
            </div>
          </div>

          <Button 
            onClick={handlePlaceOrder} 
            disabled={isSubmitting || !symbol || !quantity}
            className="w-full"
          >
            {isSubmitting ? 'Placing Order...' : `Place ${side.toUpperCase()} Order`}
          </Button>
        </CardContent>
      </Card>

      {/* Last Order Response */}
      <Card>
        <CardHeader>
          <CardTitle>Last Order Response</CardTitle>
          <CardDescription>
            Response from the most recent order placement
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!lastOrderResponse ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders placed yet. Place your first order using the form on the left.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Order Submitted</span>
                </div>
                <Badge className={getStatusColor(lastOrderResponse.status)}>
                  {lastOrderResponse.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Order ID</Label>
                  <div className="font-mono text-xs">{lastOrderResponse.id}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Client Order ID</Label>
                  <div className="font-mono text-xs">{lastOrderResponse.client_order_id}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Symbol</Label>
                  <div className="font-medium">{lastOrderResponse.symbol}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Quantity</Label>
                  <div>{lastOrderResponse.qty} shares</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Side</Label>
                  <div className="capitalize">{lastOrderResponse.side}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Order Type</Label>
                  <div className="capitalize">{lastOrderResponse.order_type}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Time in Force</Label>
                  <div className="uppercase">{lastOrderResponse.time_in_force}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Commission</Label>
                  <div>{formatCurrency(lastOrderResponse.commission)}</div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Filled Quantity</Label>
                  <div>{lastOrderResponse.filled_qty} shares</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Filled Price</Label>
                  <div>{formatCurrency(lastOrderResponse.filled_avg_price)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created At</Label>
                  <div className="text-xs">
                    {new Date(lastOrderResponse.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Expires At</Label>
                  <div className="text-xs">
                    {new Date(lastOrderResponse.expires_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {lastOrderResponse.status === 'accepted' && (
                <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Order Pending</span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Your order has been accepted and is waiting to be filled during market hours.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}