import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Menu, Search, ShoppingCart, User, X, Zap, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const sessionId = typeof window !== "undefined" ? (localStorage.getItem("tilt_session") || (() => {
    const id = Math.random().toString(36).slice(2);
    localStorage.setItem("tilt_session", id);
    return id;
  })()) : "";

  const { data: cartData } = trpc.cart.get.useQuery({ sessionId }, { refetchInterval: 5000 });
  const cartCount = cartData?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) ?? 0;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/catalogue?badge=innovation", label: "Innovations" },
    { href: "/catalogue?badge=tendance", label: "Tendances" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#111]/98 backdrop-blur-xl border-b border-[#252525] shadow-[0_1px_0_rgba(255,255,255,0.04)]"
            : "bg-[#111]/90 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center transition-all duration-300 group-hover:brightness-110">
                  <Zap className="w-5 h-5 text-black fill-black" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                TILT<span className="text-[#FFD700]">.</span>SHOP
              </span>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location === link.href
                      ? "text-[#FFD700] bg-[#FFD700]/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link href="/panier" className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#FFD700] text-black text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                    <div className="w-7 h-7 bg-[#FFD700]/20 border border-[#FFD700]/40 rounded-full flex items-center justify-center">
                      <span className="text-[#FFD700] text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#252525] border border-[#3d3d3d] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                    <div className="p-3 border-b border-[#3d3d3d]">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/compte" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <User className="w-4 h-4" /> Mon compte
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors">
                        <Zap className="w-4 h-4" /> Admin IA
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <a
                  href={getLoginUrl()}
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#FFD700] text-black text-sm font-bold rounded-lg hover:bg-[#FFE55C] transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  Connexion
                </a>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3 animate-slide-up">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit innovant..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#333] border border-[#3d3d3d] rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-all"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#3d3d3d] bg-[#1a1a1a] animate-slide-up">
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location === link.href
                      ? "text-[#FFD700] bg-[#FFD700]/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <a
                  href={getLoginUrl()}
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFD700] text-black text-sm font-bold rounded-lg"
                >
                  <User className="w-4 h-4" /> Connexion
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
