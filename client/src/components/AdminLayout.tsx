import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  BarChart3, Brain, CheckSquare, DollarSign, LayoutDashboard,
  LogOut, Megaphone, Package, ShoppingBag, Zap, Menu, X
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/campagnes", label: "Campagnes IA", icon: Megaphone },
  { href: "/admin/validation", label: "Validation humaine", icon: CheckSquare },
  { href: "/admin/pricing", label: "Pricing dynamique", icon: DollarSign },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-[#FFD700] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Accès Admin IA</h2>
          <p className="text-gray-400 mb-6">Connexion requise pour accéder au tableau de bord</p>
          <a href={getLoginUrl()} className="btn-tilt-primary inline-flex">Se connecter</a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Accès refusé</h2>
          <p className="text-gray-400 mb-6">Vous n'avez pas les droits administrateur</p>
          <Link href="/" className="btn-tilt-outline inline-flex">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-[#1e1e1e] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-5 border-b border-[#1e1e1e]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">TILT<span className="text-[#FFD700]">.</span>SHOP</span>
              <p className="text-[10px] text-gray-500 leading-none">Admin IA</p>
            </div>
          </Link>
        </div>

        {/* AI Control Badge */}
        <div className="mx-4 mt-4 p-3 bg-[#FFD700]/5 border border-[#FFD700]/15 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-[#FFD700]" />
            <span className="text-xs font-bold text-[#FFD700]">Contrôle IA actif</span>
            <div className="pulse-dot ml-auto" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-[10px] text-gray-500 mb-1">IA</div>
              <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFD700] rounded-full" style={{ width: "90%" }} />
              </div>
              <div className="text-[10px] text-[#FFD700] mt-0.5 font-bold">90%</div>
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-gray-500 mb-1">Humain</div>
              <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: "10%" }} />
              </div>
              <div className="text-[10px] text-blue-400 mt-0.5 font-bold">10%</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                location === href
                  ? "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#1e1e1e]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#FFD700]/15 rounded-full flex items-center justify-center">
              <span className="text-[#FFD700] text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#1e1e1e] px-6 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Système IA opérationnel</span>
            </div>
            <Link href="/" className="text-xs text-gray-500 hover:text-[#FFD700] transition-colors px-2">
              ← Boutique
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
