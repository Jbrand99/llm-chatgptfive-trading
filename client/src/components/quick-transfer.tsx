import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign, ArrowRightLeft, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Connection } from "@shared/schema";

interface QuickTransferProps {
  accountId: string;
  currentCash?: string;
  connections: Connection[];
  onTransferComplete?: () => void;
}

const quickTransferSchema = z.object({
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return num > 0 && num <= 50000;
  }, "Amount must be between $0.01 and $50,000"),
});

type QuickTransferForm = z.infer<typeof quickTransferSchema>;

const PRESET_AMOUNTS = [500, 1000, 5000, 10000];

export function QuickTransfer({ accountId, currentCash, connections, onTransferComplete }: QuickTransferProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const brokerConnection = connections.find(c => c.type === 'broker');
  const tradingConnection = connections.find(c => c.type === 'trading');

  const form = useForm<QuickTransferForm>({
    resolver: zodResolver(quickTransferSchema),
    defaultValues: {
      amount: "",
    },
  });

  const quickTransferMutation = useMutation({
    mutationFn: (data: QuickTransferForm) =>
      apiRequest("POST", `/api/accounts/${accountId}/quick-transfer`, data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/accounts"] });
      setDialogOpen(false);
      form.reset();
      onTransferComplete?.();
      toast({
        title: "Transfer completed!",
        description: response.message || "Transfer from broker to trading account completed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer failed",
        description: error.message || "Failed to process transfer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuickTransferForm) => {
    quickTransferMutation.mutate(data);
  };

  const setPresetAmount = (amount: number) => {
    form.setValue("amount", amount.toString());
  };

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof value === 'string' ? parseFloat(value) : value);
  };

  const canTransfer = tradingConnection ? true : false; // Simplified - only need trading connection

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span>Add Funds</span>
        </CardTitle>
        <CardDescription>
          Add funds to your trading account instantly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <span className="text-sm text-slate-600 dark:text-slate-400">Current Balance</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(currentCash || '0')}
            </span>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg" disabled={!canTransfer}>
                <DollarSign className="h-4 w-4 mr-2" />
                Add Funds Now
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Funds to Trading Account</DialogTitle>
                <DialogDescription>
                  Add funds to your trading account for live trading. Funds will be available immediately.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <FormLabel>Quick Amounts</FormLabel>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {PRESET_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPresetAmount(amount)}
                          className="text-sm"
                        >
                          {formatCurrency(amount)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter amount" 
                              className="pl-9" 
                              type="number" 
                              step="0.01" 
                              min="0.01" 
                              max="50000" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div className="text-sm text-green-800 dark:text-green-200">
                      <div className="font-medium">Instant Funding:</div>
                      <div>• Funds available immediately</div>
                      <div>• Updates buying power automatically</div>
                      <div>• Ready for live trading</div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={quickTransferMutation.isPending}>
                      {quickTransferMutation.isPending ? "Adding..." : "Add Funds"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {!canTransfer && (
            <div className="text-xs text-center text-slate-500 dark:text-slate-400">
              <Badge variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                SETUP REQUIRED
              </Badge>
              <div className="mt-1">Trading connection must be initialized first</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}