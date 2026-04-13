"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Image as ImageIcon } from "lucide-react";
import { formatSoldCount } from "@/lib/utils";
import { PRODUCT_DATA } from "@/config/productData";
import { useMemo } from "react";

interface ShopProfileProps {
  data?: any;
  onProductClick?: (product: any) => void;
}

export function ShopProfile({ data = PRODUCT_DATA, onProductClick }: ShopProfileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current product ID to exclude it from "Mais desta loja"
  const currentProductId = data.id;

  // Automatically pick other products from the catalog, excluding the current one
  const otherProducts = useMemo(() => {
    const allProducts = data.storeProducts || [];
    const filtered = allProducts.filter((p: any) => 
      p.id?.toString() !== currentProductId?.toString()
    );
    // Shuffle randomly
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled;
  }, [data.storeProducts, currentProductId]);

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

  // Handle click: use callback if available (preview), otherwise navigate
  const handleClick = (product: any) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      const subdomain = searchParams.get("subdomain");
      const path = subdomain
        ? `/p/${product.id}?subdomain=${subdomain}`
        : `/p/${product.id}`;
      router.push(path);
    }
  };

  return (
    <div className="bg-white rounded-[14px] px-3 py-4 flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[48px] h-[48px] rounded-full overflow-hidden border border-gray-50">
             {data.storeLogo ? (
               <img src={data.storeLogo} alt="Store Logo" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                 <ImageIcon className="w-5 h-5 text-gray-300" />
               </div>
             )}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[#161823] font-semibold text-[15px] leading-tight">
                {data.storeName || "Minha Loja"}
              </h3>
              {data.isVerified && (
                <img src="/VERIFICADO.png" className="w-[14px] h-[14px] object-contain shrink-0 mt-0.5" alt="Verificado" />
              )}
            </div>
            <span className="text-gray-400 text-[12px] font-medium">
              TikTok Shop | {formatSoldCount(data.storeSoldCount || data.soldCount || "0")} vendido(s)
            </span>
          </div>
        </div>
        <button className="bg-white border border-gray-200 rounded-md px-4 py-1.5 text-[14px] font-semibold text-[#161823] shadow-sm">
          Visitar
        </button>
      </div>
      
      {/* Store Stats Row */}
      <div className="flex items-center gap-3 text-[12px] font-semibold text-[#161823] mt-1">
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-sm">
           <span>100% <span className="text-gray-400 font-medium">Resposta</span></span>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-sm">
           <span>99% <span className="text-gray-400 font-medium">Envios</span></span>
        </div>
      </div>

      {/* Mais desta loja - AUTOMÁTICO */}
      {otherProducts.length > 0 && (
        <div className="mt-2 text-inherit no-underline">
          <div className="flex justify-between items-center mb-3">
              <span className="text-[14px] font-semibold text-[#161823]">Mais desta loja</span>
              <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {otherProducts.map((product: any, i: number) => {
                const price = getProductPrice(product);
                const discount = getDiscount(product);
                const image = product.carouselImages?.[0] || product.image;

                return (
                  <button
                    key={product.id || i}
                    onClick={() => handleClick(product)}
                    className="flex flex-col gap-2 flex-shrink-0 w-[115px] group active:opacity-70 transition-opacity text-left"
                  >
                    <div className="w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100/50 flex items-center justify-center">
                      {image ? (
                        <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-200" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 px-0.5">
                      <span className="text-[14px] font-semibold text-[#161823]">
                        R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {discount && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-semibold text-[#ff0050] bg-[#ff0050]/5 px-1 py-0.5 rounded border border-[#ff0050]/10">
                            {discount}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
