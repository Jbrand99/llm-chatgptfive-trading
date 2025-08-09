import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Plus, Settings, TrendingUp, Shield, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const algorithmSchema = z.object({
  name: z.string().min(1, 'Algorithm name is required'),
  strategy: z.enum(['momentum', 'mean_reversion', 'breakout', 'sentiment']),
  riskLevel: z.number().min(1).max(5),
  maxPositions: z.number().min(1).max(20),
  maxPositionSize: z.string().min(1, 'Position size is required'),
  stopLossPercent: z.string().min(0.1).max(50),
  takeProfitPercent: z.string().min(0.1).max(100),
  config: z.object({
    lookbackPeriod: z.number().min(5).max(200).default(20),
    confidenceThreshold: z.number().min(50).max(95).default(75),
    maxDailyTrades: z.number().min(1).max(50).default(10),
    tradingHours: z.object({
      start: z.string().default('09:30'),
      end: z.string().default('16:00'),
    }),
    allowedSymbols: z.array(z.string()).default(['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN']),
  }).default({}),
});

type AlgorithmFormData = z.infer<typeof algorithmSchema>;

const strategyDescriptions = {
  momentum: 'Follows price trends and momentum indicators for entry/exit signals',
  mean_reversion: 'Trades on the assumption that prices will return to their average',
  breakout: 'Enters positions when price breaks through support/resistance levels',
  sentiment: 'Uses market sentiment and news analysis for trading decisions',
};

const riskDescriptions = {
  1: 'Very Conservative - Minimal risk, stable returns',
  2: 'Conservative - Low risk, steady growth',
  3: 'Moderate - Balanced risk/reward ratio',
  4: 'Aggressive - Higher risk for better returns',
  5: 'Very Aggressive - Maximum risk and potential',
};

export default function AiAlgorithmCreator() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AlgorithmFormData>({
    resolver: zodResolver(algorithmSchema),
    defaultValues: {
      name: '',
      strategy: 'momentum',
      riskLevel: 3,
      maxPositions: 5,
      maxPositionSize: '1000',
      stopLossPercent: '2',
      takeProfitPercent: '5',
      config: {
        lookbackPeriod: 20,
        confidenceThreshold: 75,
        maxDailyTrades: 10,
        tradingHours: {
          start: '09:30',
          end: '16:00',
        },
        allowedSymbols: ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'],
      },
    },
  });

  const createAlgorithmMutation = useMutation({
    mutationFn: async (data: AlgorithmFormData) => {
      return apiRequest('/api/ai-trading/algorithms', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-trading/algorithms'] });
      setOpen(false);
      form.reset();
      toast({
        title: "Algorithm Created",
        description: "Your AI trading algorithm has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error.message || "Failed to create algorithm",
      });
    },
  });

  const onSubmit = (data: AlgorithmFormData) => {
    createAlgorithmMutation.mutate(data);
  };

  const watchedStrategy = form.watch('strategy');
  const watchedRiskLevel = form.watch('riskLevel');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create AI Algorithm
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Create AI Trading Algorithm
          </DialogTitle>
          <DialogDescription>
            Configure an automated trading algorithm with custom parameters and risk management.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Algorithm Name</FormLabel>
                      <FormControl>
                        <Input placeholder="My Momentum Strategy" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your trading algorithm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="strategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trading Strategy</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a strategy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="momentum">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              Momentum Trading
                            </div>
                          </SelectItem>
                          <SelectItem value="mean_reversion">Mean Reversion</SelectItem>
                          <SelectItem value="breakout">Breakout Strategy</SelectItem>
                          <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {strategyDescriptions[watchedStrategy]}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Risk Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="riskLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Level: {field.value}/5</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        <Badge variant="outline" className="mr-2">
                          Level {watchedRiskLevel}
                        </Badge>
                        {riskDescriptions[watchedRiskLevel as keyof typeof riskDescriptions]}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stopLossPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stop Loss (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" min="0.1" max="50" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum loss percentage per position
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="takeProfitPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Take Profit (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" min="0.1" max="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Target profit percentage per position
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Position Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Position Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxPositions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Positions</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="20" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum concurrent positions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxPositionSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Position Size ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum dollar amount per position
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="config.lookbackPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lookback Period</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="5" 
                            max="200" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Historical data period (bars)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.confidenceThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confidence Threshold (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="50" 
                            max="95" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum AI confidence for trades
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="config.maxDailyTrades"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Daily Trades</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="50" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of trades per day
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="config.tradingHours.start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trading Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          When to start trading (EST)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="config.tradingHours.end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trading End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          When to stop trading (EST)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createAlgorithmMutation.isPending}>
                {createAlgorithmMutation.isPending ? 'Creating...' : 'Create Algorithm'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}