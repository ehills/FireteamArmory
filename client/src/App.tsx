import { Switch, Route, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import ArmyBuilder from "@/pages/ArmyBuilder";
import AdminUnits from "@/pages/AdminUnits";
import { ArmyProvider } from "@/contexts/ArmyContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ArmyBuilder} />
      <Route path="/admin/units" component={AdminUnits} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ArmyProvider>
          <Toaster />
          <Router />
        </ArmyProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
