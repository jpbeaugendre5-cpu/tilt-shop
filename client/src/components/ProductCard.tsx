import { trpc } from "@/lib/trpc";
import { Heart, ShoppingCart, Star, Zap, TrendingUp, Sparkles, Award, Tag } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string | null;
  price: string;
  originalPrice?: string | null;
  imageUrl?: string | null;
  badge?: string | null;
  rating?: string | null;
  reviewCount?: number | null;
  stock?: number | null;
}

interface ProductCardProps {
  product: Product;
  sessionId?: string;
}

const BADGE_CONFIG: Record<string, { label: string; icon: any; className: string }> = {
  innovation: { label: "Innovation", icon: Zap, className: "badge-innovation" },
  tendance: { label: "Tendance", icon: TrendingUp, className: "badge-tendance" },
  nouveau: { label: "Nouveau", icon: Sparkles, className: "badge-nouveau" },
  bestseller: { label: "Best-seller", icon: Award, className: "badge-bestseller" },
  promo: { label: "Promo", icon: Tag, className: "bg-orange-500 text-white text-[0.7rem] font-bold px-2 py-0.5 rounded" },
};

const PRODUCT_COLORS = [
  "from-[#1a1a2e] to-[#16213e]",
  "from-[#1a2a1a] to-[#162116]",
  "from-[#2a1a1a] to-[#211616]",
  "from-[#1a1a2a] to-[#16162a]",
  "from-[#2a2a1a] to-[#21211a]",
];

export default function ProductCard({ product, sessionId }: ProductCardProps) {
  const [, navigate] = useLocation();
  const [isFav, setIsFav] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const addToCart = trpc.cart.add.useMutation({
    onSuccess: () => {
      toast.success("Ajouté au panier !", {
        description: product.name,
        action: { label: "Voir le panier", onClick: () => navigate("/panier") },
      });
      setAddingToCart(false);
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout");
      setAddingToCart(false);
    },
  });

  const discount = product.originalPrice
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)
    : 0;

  const badge = product.badge ? BADGE_CONFIG[product.badge] : null;
  const colorClass = PRODUCT_COLORS[product.id % PRODUCT_COLORS.length];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAddingToCart(true);
    addToCart.mutate({
      productId: product.id,
      quantity: 1,
      sessionId: sessionId || localStorage.getItem("tilt_session") || "",
    });
  };

  return (
    <div
      className="product-card group"
      onClick={() => navigate(`/produit/${product.slug}`)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-[#1e1e1e] aspect-square`}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-card-image w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Zap className="w-16 h-16 text-[#FFD700]/30" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badge && (
            <span className={badge.className}>
              <badge.icon className="w-3 h-3" />
              {badge.label}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[0.7rem] font-bold px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsFav(!isFav);
            toast.success(isFav ? "Retiré des favoris" : "Ajouté aux favoris");
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/70"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-white"}`} />
        </button>

        {/* Stock faible */}
        {product.stock !== null && product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-3 left-3 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full">
            Plus que {product.stock} en stock
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2 group-hover:text-[#FFD700]/90 transition-colors duration-200">
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDescription}
          </p>
        )}

        {/* Rating */}
        {product.rating && parseFloat(product.rating) > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${star <= Math.round(parseFloat(product.rating!)) ? "fill-[#FFD700] text-[#FFD700]" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount ?? 0})</span>
          </div>
        )}

        {/* Prix + CTA */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-[#FFD700]">
              {parseFloat(product.price).toFixed(2)}€
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-xs text-gray-500 line-through">
                {parseFloat(product.originalPrice).toFixed(2)}€
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              product.stock === 0
                ? "bg-[#1e1e1e] text-gray-500 cursor-not-allowed border border-[#2a2a2a]"
                : "bg-[#FFD700] text-black hover:bg-[#FFE55C] active:scale-95"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {addingToCart ? "..." : product.stock === 0 ? "Épuisé" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
