import React from "react";
import { ProductCard } from "./ProductCard";
import { ChevronRight } from "lucide-react";

interface HomeTabProps {
  products: any[];
  onProductClick: (product: any) => void;
  onBuyNow: (product: any) => void;
  onViewTopProducts?: () => void;
}

export function HomeTab({ products, onProductClick, onBuyNow, onViewTopProducts }: HomeTabProps) {
  // Ordenar produtos por vendidos (descendo) para o ranking
  const sortedBySales = [...products].sort((a, b) => {
    const soldA = parseInt(String(a.soldCount || "0").replace(/\D/g, '')) || 0;
    const soldB = parseInt(String(b.soldCount || "0").replace(/\D/g, '')) || 0;
    return soldB - soldA;
  });

  const mainProducts = sortedBySales.slice(0, 6).map((p, i) => ({ ...p, ranking: i + 1 }));
  // Recomendado (all) - Mantém a ordem original ou recomendada
  const recommended = products;

  return (
    <div className="flex flex-col gap-6 py-4">
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#161823] font-tiktok-black text-[17px]">Principais produtos</h2>
          <button onClick={onViewTopProducts} className="flex items-center gap-1 text-[#8A8B91] text-[13px] font-medium">
            Ver mais <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x hide-scrollbar">
          {mainProducts.map((product, i) => (
            <div key={product.id || `main-${i}`} className="min-w-[136px] w-[136px] snap-start shrink-0 pb-1">
               <ProductCard product={product} onClick={onProductClick} onBuyNow={onBuyNow} />
            </div>
          ))}
        </div>
      </section>
      <div className="flex items-center justify-center gap-4 px-4 my-2">
         <div className="h-[1px] bg-[#F1F1F2] flex-1" />
         <span className="text-[#8A8B91] font-bold text-[12px] whitespace-nowrap uppercase tracking-[0.1em]">
            Recomendado para você
         </span>
         <div className="h-[1px] bg-[#F1F1F2] flex-1" />
      </div>

      <section className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {recommended.map((product, i) => (
            <ProductCard key={product.id || `rec-${i}`} product={product} onClick={onProductClick} onBuyNow={onBuyNow} />
          ))}
        </div>
      </section>
    </div>
  );
}

