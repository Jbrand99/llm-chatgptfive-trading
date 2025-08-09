import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Dashboard2026 from "@/pages/dashboard-2026";
import AiTradingPage from "@/pages/ai-trading";
import LiveTradingPage from "@/pages/live-trading";
import LiveDashboard from "@/pages/LiveDashboard";
import OAuthDashboard from "@/pages/OAuthDashboard";
import { Web3Dashboard } from "@/components/web3-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LiveDashboard} />
      <Route path="/legacy" component={Dashboard} />
      <Route path="/dashboard-2026" component={Dashboard2026} />
      <Route path="/ai-trading" component={AiTradingPage} />
      <Route path="/live-trading" component={LiveTradingPage} />
      <Route path="/web3" component={Web3Dashboard} />
      <Route path="/oauth" component={OAuthDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
