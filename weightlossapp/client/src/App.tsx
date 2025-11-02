import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import WeightTracker from "./pages/WeightTracker";
import Nutrition from "./pages/Nutrition";
import Recipes from "./pages/Recipes";
import AIChat from "./pages/AIChat";
import Exercise from "./pages/Exercise";
import Habits from "./pages/Habits";
import { isOnboardingComplete } from "@/lib/storage";
import ScrollToTop from "./components/ScrollToTop";

function Router() {
  const onboardingDone = isOnboardingComplete();

  return (
    <>
      <ScrollToTop />
      <Switch>
      <Route path="/">
        {onboardingDone ? <Redirect to="/dashboard" /> : <Redirect to="/onboarding" />}
      </Route>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/weight" component={WeightTracker} />
      <Route path="/nutrition" component={Nutrition} />
      <Route path="/recipes" component={Recipes} />
      <Route path="/ai-coach" component={AIChat} />
      <Route path="/exercise" component={Exercise} />
      <Route path="/habits" component={Habits} />
      <Route path="/achievements">Achievements (Coming Soon)</Route>
      <Route path="/analytics">Analytics (Coming Soon)</Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
