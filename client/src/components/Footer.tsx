import { Zap, Shield, Truck, Lock, Headphones, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#111] border-t border-[#2a2a2a] mt-16">
      {/* Réassurance */}
      <div className="border-b border-[#2a2a2a]">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: "Sélectionné avec soin", desc: "Produits testés et approuvés" },
              { icon: Truck, label: "Livraison rapide", desc: "Expédition sous 24-48h" },
              { icon: Lock, label: "Paiement sécurisé", desc: "Transactions 100% protégées" },
              { icon: Headphones, label: "Service client", desc: "Disponible 7j/7" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFD700]/10 border border-[#FFD700]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#FFD700] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="font-bold text-xl text-white">TILT<span className="text-[#FFD700]">.</span>SHOP</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Les bonnes idées, qui changent tout. Des produits malins pour simplifier votre quotidien.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <button key={i} className="w-8 h-8 bg-[#252525] border border-[#3d3d3d] rounded-lg flex items-center justify-center text-gray-400 hover:text-[#FFD700] hover:border-[#FFD700]/40 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Boutique</h4>
            <ul className="space-y-2">
              {[
                { href: "/catalogue", label: "Tous les produits" },
                { href: "/catalogue?badge=innovation", label: "Innovations" },
                { href: "/catalogue?badge=tendance", label: "Tendances" },
                { href: "/catalogue?badge=nouveau", label: "Nouveautés" },
                { href: "/catalogue?badge=promo", label: "Promotions" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Aide</h4>
            <ul className="space-y-2">
              {[
                "Suivi de commande",
                "Retours & échanges",
                "FAQ",
                "Contact",
                "Guide des tailles",
              ].map((item) => (
                <li key={item}>
                  <button className="text-sm text-gray-400 hover:text-[#FFD700] transition-colors duration-200 text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Newsletter IA</h4>
            <p className="text-sm text-gray-400 mb-3">
              Recevez les meilleures innovations sélectionnées par notre IA chaque semaine.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-3 py-2 bg-[#252525] border border-[#3d3d3d] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#FFD700] text-black text-sm font-bold rounded-lg hover:bg-[#FFE55C] transition-colors"
              >
                OK
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#2a2a2a]">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © 2025 TILT.SHOP — Les bonnes idées, qui changent tout. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {["CGV", "Politique de confidentialité", "Mentions légales", "Cookies"].map((item) => (
              <button key={item} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
