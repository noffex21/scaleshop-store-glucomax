"use client";
import { ChevronRight, Star, ThumbsUp, Play, ShoppingBag, Check, Image as ImageIcon, ChevronDown } from "lucide-react";
import { useState } from "react";

import { PRODUCT_DATA } from "@/config/productData";
import { maskName, formatSoldCount } from "@/lib/utils";

export function ReviewsDescription({ data = PRODUCT_DATA }: { data?: any }) {
  return (
    <div className="flex flex-col">
      {/* Avaliações dos clientes Header */}
      <div className="bg-white rounded-[14px] px-3 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#161823] font-semibold text-[15px]">Avaliações dos clientes ({formatSoldCount(data.reviewCount || "451")})</h2>
          <span className="text-[13px] text-gray-500 font-medium flex items-center">
            Ver mais <ChevronRight className="w-4 h-4 text-gray-400" />
          </span>
        </div>
        <div className="flex items-center gap-1.5 mb-5 pt-0.5">
          <span className="text-[#161823] font-bold text-[20px]">{data.rating || "5.0"}</span>
          <span className="text-gray-400 text-[14px] font-medium">/ 5</span>
          <div className="flex items-center gap-0.5 ml-1">
             {[...Array(5)].map((_, i) => (
               <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(Number(data.rating) || 5) ? "fill-[#fbbf24] text-[#fbbf24]" : "fill-gray-200 text-gray-200"}`} />
             ))}
          </div>
          <div className="w-3.5 h-3.5 border border-gray-400 rounded-full flex items-center justify-center text-[9px] text-gray-500 font-bold ml-1">i</div>
        </div>

        {/* User Reviews */}
        <div className="flex flex-col gap-6">
           {(Array.isArray(data.reviews) ? data.reviews : [])
             .slice(0, 3)
             .map((review: any) => (
             <div 
               key={review.id} 
               className="flex flex-col pt-1"
             >
                <div className="flex items-center gap-2.5 mb-2.5">
                   <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                      <img 
                        src={review.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                        alt={review.user} 
                        className="w-full h-full object-cover" 
                      />
                   </div>
                   <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
                      <span className="text-[13px] font-semibold text-[#161823]">
                        {review.verified ? review.user : maskName(review.user)}
                      </span>
                      {review.verified && (
                        <img src="/VERIFICADO.png" className="w-[14px] h-[14px] object-contain" alt="Conta Verificada" />
                      )}
                      {review.verifiedPurchase !== false && (
                        <span className="text-[12px] text-gray-400 font-medium">
                          · Compra Verificada
                        </span>
                      )}
                   </div>
                </div>

                <div className="flex gap-0.5 mb-2 text-[#fbbf24]">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.stars ? 'fill-current' : 'text-gray-200'}`} />
                   ))}
                </div>

                <span className="text-[12px] text-gray-400 font-medium mb-2.5">Item: {review.productInfo || review.itemDetail || "Padrão"}</span>

                <p className="text-[14px] text-[#161823] mb-3 leading-[1.4] font-normal line-clamp-2">
                   {review.text}
                </p>

                {review.images && review.images.length > 0 && (
                   <div className="flex gap-1.5 mt-0.5 overflow-x-auto hide-scrollbar">
                      {review.images.map((img: string, idx: number) => (
                         <div key={idx} className="w-[100px] h-[100px] rounded-lg overflow-hidden border border-gray-100 shrink-0">
                            <img src={img} className="w-full h-full object-cover" />
                         </div>
                      ))}
                   </div>
                )}
             </div>
            ))}
        </div>

        <div className="mt-8 border-t border-gray-50 pt-6">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#161823] font-semibold text-[15px]">Avaliações da loja ({formatSoldCount(data.storeGlobalReviewCount || data.storeReviewCount || "6,2 mil")})</h3>
              <ChevronRight className="w-5 h-5 text-gray-300" />
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
              <div className="flex items-center gap-1.5 bg-gray-50/80 px-3 py-1.5 rounded-full border border-gray-100/50 whitespace-nowrap">
                 <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                    <ImageIcon className="w-2.5 h-2.5 text-white" />
                 </div>
                 <span className="text-[12px] font-medium text-[#161823]">Inclui imagens ou vídeos (682)</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-50/80 px-3 py-1.5 rounded-full border border-gray-100/50 whitespace-nowrap">
                 <span className="text-[12px] font-medium text-[#161823]">5 <Star className="w-2.5 h-2.5 inline fill-[#fbbf24] text-[#fbbf24] -mt-0.5" /> (4,3 mil)</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-50/80 px-3 py-1.5 rounded-full border border-gray-100/50 whitespace-nowrap">
                 <span className="text-[12px] font-medium text-[#161823]">4 <Star className="w-2.5 h-2.5 inline fill-[#fbbf24] text-[#fbbf24] -mt-0.5" /> (498)</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
