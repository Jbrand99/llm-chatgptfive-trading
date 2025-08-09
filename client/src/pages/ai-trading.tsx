import { useState } from 'react';
import AiTradingDashboard from '@/components/ai-trading-dashboard';
import AiAlgorithmCreator from '@/components/ai-algorithm-creator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Shield, 
  Target, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function AiTradingPage() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowDashboard(false)}
            className="mb-4"
          >
            ← Back to Setup
          </Button>
          <AiAlgorithmCreator />
        </div>
        <AiTradingDashboard />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            AI Trading Engine
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Automated deployment and withdrawal system powered by advanced AI algorithms 
          for live trading with intelligent risk management.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold">Auto-Deploy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatically opens positions based on AI analysis
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Auto-Withdraw</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Smart position closing with profit/loss targets
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold">Risk Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced stop-loss and position sizing
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold">Live Trading</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time execution via Alpaca Markets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            How AI Auto-Deploy & Withdraw Works
          </CardTitle>
          <CardDescription>
            Understanding the automated trading process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Auto-Deploy Process
                </h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">1</Badge>
                    <span>AI analyzes real-time market data and technical indicators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">2</Badge>
                    <span>Algorithm generates trading signals with confidence scores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">3</Badge>
                    <span>System validates signals against risk parameters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">4</Badge>
                    <span>Position automatically opened with calculated size</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">5</Badge>
                    <span>Stop-loss and take-profit levels set automatically</span>
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  Auto-Withdraw Process
                </h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">1</Badge>
                    <span>Continuous monitoring of open positions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">2</Badge>
                    <span>Real-time P&L calculation and risk assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">3</Badge>
                    <span>Trigger conditions: stop-loss, take-profit, or AI signal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">4</Badge>
                    <span>Automatic position closure at market prices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="outline" className="min-w-fit">5</Badge>
                    <span>Performance tracking and algorithm learning</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Available Trading Strategies</CardTitle>
          <CardDescription>
            Choose from proven algorithmic trading approaches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Momentum Strategy
              </h3>
              <p className="text-sm text-gray-600">
                Follows price trends and momentum indicators. Ideal for trending markets 
                with clear directional movement.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">High Frequency</Badge>
                <Badge variant="secondary">Trend Following</Badge>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Mean Reversion</h3>
              <p className="text-sm text-gray-600">
                Trades on the assumption that prices will return to their average. 
                Works well in sideways or range-bound markets.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">Counter-Trend</Badge>
                <Badge variant="secondary">Range Trading</Badge>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Breakout Strategy</h3>
              <p className="text-sm text-gray-600">
                Enters positions when price breaks through key support/resistance levels. 
                Captures explosive price movements.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">Volatility</Badge>
                <Badge variant="secondary">Key Levels</Badge>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Sentiment Analysis</h3>
              <p className="text-sm text-gray-600">
                Uses market sentiment, news, and social media analysis. 
                Leverages market psychology for trading decisions.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">News-Based</Badge>
                <Badge variant="secondary">AI Sentiment</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Warning */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            Important Risk Disclosure
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800 dark:text-yellow-200">
          <ul className="space-y-2 text-sm">
            <li>• Automated trading involves substantial risk and may not be suitable for all investors</li>
            <li>• Past performance does not guarantee future results</li>
            <li>• AI algorithms can experience losses during volatile market conditions</li>
            <li>• Always start with small position sizes to test algorithm performance</li>
            <li>• Monitor your account regularly and be prepared to intervene manually if needed</li>
          </ul>
        </CardContent>
      </Card>

      {/* Get Started */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Ready to Start AI Trading?
          </CardTitle>
          <CardDescription>
            Create your first algorithm and begin automated trading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your account is connected and ready for live trading. 
            Create an AI algorithm to get started with automated deployment and withdrawal.
          </p>
          <div className="flex justify-center gap-4">
            <AiAlgorithmCreator />
            <Button 
              variant="outline"
              onClick={() => setShowDashboard(true)}
            >
              View Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}