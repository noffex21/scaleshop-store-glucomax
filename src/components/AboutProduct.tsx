"use client";

import { ChevronRight, CreditCard, Bookmark, Image as ImageIcon, Play, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFlashSaleTimer } from "@/hooks/useFlashSaleTimer";
import { PRODUCT_DATA } from "@/config/productData";

export function AboutProduct({ variant, data = PRODUCT_DATA, onProductClick }: { variant?: "description" | "recommendations", data?: any, onProductClick?: (product: any) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const recommendations = useMemo(() => {
    const allProducts = data.storeProducts || [];
    const filtered = allProducts.filter((p: any) => p.id?.toString() !== data.id?.toString());
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [data.storeProducts, data.id]);

  // Helper: get the real selling price from kit 1 or direct price
  const getProductPrice = (product: any): number => {
    const kitPrice = product.kits?.[1]?.price || product.kits?.["1"]?.price;
    return kitPrice || product.price || 0;
  };

  // Helper: get the original/comparison price
  const getOriginalPrice = (product: any): number => {
    const kitOriginal = product.kits?.[1]?.originalPrice || product.kits?.["1"]?.originalPrice;
    return kitOriginal || product.originalPrice || 0;
  };

  // Helper: calculate discount percentage
  const getDiscount = (product: any): string => {
    const price = getProductPrice(product);
    const original = getOriginalPrice(product);
    if (original > 0 && price > 0 && original > price) {
      const pct = Math.round(((original - price) / original) * 100);
      return `-${pct}%`;
    }
    if (product.discount) return product.discount;
    return "";
  };

  const handleClick = (product: any) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      const subdomain = searchParams.get("subdomain");
      const path = subdomain ? `/p/${product.id}?subdomain=${subdomain}` : `/p/${product.id}`;
      router.push(path);
    }
  };

  if (variant === "recommendations") {
    if (recommendations.length === 0) return null;

    return (
      <div className="bg-white rounded-[14px] px-3 py-5 overflow-hidden">
        <h2 className="text-[#161823] font-semibold text-[16px] mb-4">Você também pode gostar</h2>
        <div className="grid grid-cols-2 gap-x-2 gap-y-4">
          {recommendations.map((item: any, idx: number) => {
             const price = getProductPrice(item);
             const originalPrice = getOriginalPrice(item);
             const discount = getDiscount(item);
             const image = item.carouselImages?.[0] || item.image;

             return (
            <button key={item.id || idx} onClick={() => handleClick(item)} className="flex flex-col relative focus:outline-none text-left group">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-100/50">
                {image ? (
                  <img src={image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}
                {discount && (
                  <div className="absolute top-0 right-0 bg-[#fe2c55] text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-bl-lg">
                    {discount}
                  </div>
                )}
              </div>
              <div className="mt-2 flex flex-col gap-1 px-0.5">
                <h3 className="text-[13px] text-[#161823] font-medium leading-[1.4] line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[15px] font-semibold text-[#fe2c55]">
                       R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {originalPrice > price && (
                      <span className="text-[11px] text-gray-400 line-through">
                          R$ {originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-[11px] text-gray-400 font-medium">{item.rating || "4.9"}</span>
                </div>
              </div>
            </button>
          )})}
        </div>
      </div>
    );
  }

  // DEFAULT: Description Variant (ttk 11/12 style)
  return (
    <div className="bg-white rounded-[14px] px-3 py-5 overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <h2 className="text-[#161823] font-semibold text-[16px] mb-4">Sobre este produto</h2>
        
        <div className="text-[#161823] text-[14px] leading-[1.6] space-y-4">
          <div className="flex flex-col border-b border-gray-50 pb-4">
             <span className="text-gray-400 text-[11px] uppercase font-semibold tracking-wider mb-3">Especificações</span>
             <ul className="space-y-3">
                <li className="flex justify-between items-center">
                  <span className="text-gray-400">Marca</span>
                  <span className="font-medium text-[#161823]">{data.brand}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-400">Volume</span>
                  <span className="font-medium text-[#161823]">{data.description.volume}</span>
                </li>
             </ul>
          </div>

          <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[10000px]" : "max-h-[180px] relative"}`}>
            <div className="pt-2">
              <p className="font-semibold text-[#161823] text-[15px] mb-3">
                Descrição detalhada
              </p>
              {data.name && (
                <p className="font-semibold text-[#161823] text-[15px] mb-1">
                  {data.name}
                </p>
              )}
              {data.description.short && (
                <p className="text-[#161823] mb-4 whitespace-pre-line text-[14px] leading-relaxed">
                  {data.description.short}
                </p>
              )}
              
              {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  {data.description.detailed && (
                    <p className="text-[#161823] mb-6 text-[14px] leading-relaxed whitespace-pre-line">
                      {data.description.detailed}
                    </p>
                  )}
                  
                  {/* Vídeo Demonstrativo 9:16 */}
                  {data.description?.videoUrl && (
                    <div className="my-6 relative rounded-2xl overflow-hidden aspect-[9/16] bg-black max-w-[280px] mx-auto shadow-lg">
                      <video 
                        src={data.description?.videoUrl || "/videos/product-demo.mp4"} 
                        poster={data.description?.videoThumbnail || undefined}
                        className="w-full h-full object-cover"
                        controls
                        muted
                        loop
                        playsInline
                      />
                    </div>
                  )}

                  {data.description.specs && data.description.specs.length > 0 && (
                    <div className="mt-6">
                      <p className="text-[#161823] font-semibold mb-3">
                        Especificações técnicas:
                      </p>
                      <ul className="list-disc pl-5 text-gray-500 space-y-2 mt-2 text-[14px]">
                        {data.description.specs.map((spec: any, index: number) => (
                          <li key={index} className="pl-1"><span className="font-medium text-[#161823]">{spec.label}:</span> {spec.value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
            )}
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-full py-3 text-[#ff0050] font-semibold text-[14px] gap-1 active:bg-gray-50 transition-colors border-t border-gray-50 mt-2"
          >
             {isExpanded ? "Ver menos" : "Ver mais"}
             <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-90"}`} />
          </button>
        </div>
    </div>
  );
}
