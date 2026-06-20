import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminValidation from "./pages/admin/AdminValidation";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AIChatWidget from "./components/AIChatWidget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalogue" component={Catalogue} />
      <Route path="/produit/:slug" component={ProductDetail} />
      <Route path="/panier" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/confirmation/:orderNumber" component={OrderConfirmation} />
      <Route path="/compte" component={Account} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/campagnes" component={AdminCampaigns} />
      <Route path="/admin/validation" component={AdminValidation} />
      <Route path="/admin/pricing" component={AdminPricing} />
      <Route path="/admin/produits" component={AdminProducts} />
      <Route path="/admin/commandes" component={AdminOrders} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
          <AIChatWidget />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
