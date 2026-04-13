import React from "react";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface TopProductsScreenProps {
  products: any[];
  onBack: () => void;
  onProductClick: (product: any) => void;
  onBuyNow: (product: any) => void;
  cartCount: number;
}

export function TopProductsScreen({ products, onBack, onProductClick, onBuyNow, cartCount }: TopProductsScreenProps) {
  // Ordered by sold quantity
  const sortedBySales = [...products].sort((a, b) => {
    const soldA = parseInt(String(a.soldCount || "0").replace(/\D/g, '')) || 0;
    const soldB = parseInt(String(b.soldCount || "0").replace(/\D/g, '')) || 0;
    return soldB - soldA;
  });

  const topProducts = sortedBySales.map((p, i) => ({ ...p, ranking: i + 1 }));

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col w-full max-w-[480px] mx-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-[201] flex items-center justify-between border-b border-gray-100 shadow-sm shrink-0">
        <button onClick={onBack} className="p-1 -ml-1 text-[#161823] hover:bg-gray-50 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[17px] font-bold text-[#161823]">Principais produtos</h1>
        <div className="relative">
           <ShoppingCart className="w-6 h-6 text-[#161823]" />
           {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#fe2c55] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                 {cartCount}
              </span>
           )}
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto px-4 bg-white flex flex-col pb-20">
        {topProducts.map((product) => (
           <ProductCard 
             key={product.id || product.ranking} 
             product={product} 
             variant="list" 
             onClick={onProductClick} 
             onBuyNow={onBuyNow} 
           />
        ))}

        <div className="text-center py-6">
           <span className="text-[13px] text-gray-400 font-medium">Não há mais produtos</span>
        </div>
      </div>
    </div>
  );
}
