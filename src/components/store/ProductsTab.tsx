import React, { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { Grid, List } from "lucide-react";

interface ProductsTabProps {
  products: any[];
  onProductClick: (product: any) => void;
  onBuyNow: (product: any) => void;
}

export function ProductsTab({ products, onProductClick, onBuyNow }: ProductsTabProps) {
  const [activeFilter, setActiveFilter] = useState("Recomendado");
  const filters = ["Recomendado", "Mais vendidos", "Lançamentos"];

  const sortedProducts = useMemo(() => {
    let result = [...products];
    if (activeFilter === "Mais vendidos") {
      result.sort((a, b) => {
        const soldA = parseInt(String(a.soldCount || "0").replace(/\D/g, '')) || 0;
        const soldB = parseInt(String(b.soldCount || "0").replace(/\D/g, '')) || 0;
        return soldB - soldA;
      });
    } else if (activeFilter === "Lançamentos") {
      result.sort((a, b) => {
        const dateA = new Date(a.created_at || a.id).getTime();
        const dateB = new Date(b.created_at || b.id).getTime();
        return dateB - dateA;
      });
    }
    return result;
  }, [products, activeFilter]);

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 pt-3 pb-4 sticky top-0 z-10 bg-white border-b border-[#F1F1F2] overflow-x-auto no-scrollbar">
        <div className="flex gap-6 whitespace-nowrap">
          {filters.map((filter) => (
            <div key={filter} className="flex flex-col items-center gap-1.5 shrink-0">
               <button
                 onClick={() => setActiveFilter(filter)}
                 className={`text-[14px] font-bold transition-colors ${
                   activeFilter === filter ? "text-[#161823]" : "text-[#8A8B91] hover:text-[#161823]/80"
                 }`}
               >
                 {filter}
               </button>
               {activeFilter === filter && <div className="h-[2px] w-full bg-[#161823] rounded-full" />}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 pl-4 bg-white">
           <div className="w-[1px] h-4 bg-[#F1F1F2]" />
           <button className="p-1">
             <Grid className="w-5 h-5 text-[#8A8B91]" />
           </button>
        </div>
      </div>

      <div className="flex flex-col px-4">
        {sortedProducts.map((product, i) => (
          <ProductCard key={product.id || i} product={product} variant="list" onClick={onProductClick} onBuyNow={onBuyNow} />
        ))}
      </div>
    </div>
  );
}

