import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@/hooks/use-auth";
import { ThemeProvider } from "next-themes";

// Pages
import AuthPage from "@/pages/Auth";
import Home from "@/pages/Home";
import Scan from "@/pages/Scan";
import Expenses from "@/pages/Expenses";
import Insights from "@/pages/Insights";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/">
        <ProtectedRoute component={Home} />
      </Route>
      <Route path="/scan">
        <ProtectedRoute component={Scan} />
      </Route>
      <Route path="/expenses">
        <ProtectedRoute component={Expenses} />
      </Route>
      <Route path="/insights">
        <ProtectedRoute component={Insights} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Toaster />
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
