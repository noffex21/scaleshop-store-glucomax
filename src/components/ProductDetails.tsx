"use client";

import { useState, useEffect } from "react";
import { ChevronRight, CreditCard, Bookmark, Star } from "lucide-react";
import { formatSoldCount } from "@/lib/utils";
import { useFlashSaleTimer } from "@/hooks/useFlashSaleTimer";
import { PRODUCT_DATA } from "@/config/productData";

export function ProductDetails({ selectedKit = 1, data = PRODUCT_DATA }: { selectedKit?: number, data?: any }) {
  const timeLeft = useFlashSaleTimer();
  const kitData = data.kits?.[selectedKit as 1|2|3] || data.kits?.[1] || { price: 0, originalPrice: 1 };
  
  const discountPercent = Math.round((1 - (kitData.price / (kitData.originalPrice || 1))) * 100) || 0;
  const installments = Number(data.installmentsCount) || 3;

  return (
    <div className="bg-white rounded-[14px] pb-3 overflow-hidden">
      {/* New Minimalist Price Layout - Based on Image 1 */}
      <div className="px-3 pt-4 pb-2">

        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {/* Discount Tag */}
          <div className="bg-[#FE2C55] px-2 py-1 rounded-[6px] shrink-0">
             <span className="text-white text-[15px] font-bold">-{discountPercent}%</span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-[#FE2C55] text-[13px] font-medium whitespace-nowrap">A partir de R$</span>
            <div className="flex items-start text-[#FE2C55]">
               <span className="text-[34px] font-bold leading-[1] tracking-tighter">{Math.floor(kitData.price)}</span>
               <span className="text-[20px] font-bold leading-none mt-[2px]">,{Math.round((kitData.price % 1) * 100).toString().padStart(2, '0')}</span>
            </div>
            
            {/* Verified Ticket Icon */}
            <div className="text-[#FE2C55] ml-0.5">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
                  <path d="m9 12 2 2 4-4"/>
               </svg>
            </div>

            {/* Original Price */}
            <span className="text-gray-400 text-[14px] line-through ml-1.5 font-medium">
               R$ {kitData.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Installments row */}
        <div className="flex items-center gap-1.5 text-[#161823] text-[15px] font-medium mb-3">
           <div className="relative">
             <CreditCard className="w-[18px] h-[18px] text-gray-800" strokeWidth={2} />
             <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px]">
                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
             </div>
           </div>
           <span className="flex items-center gap-1">
             <span>{installments}x R$ {(kitData.price / installments).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
             <span className="text-[#FE2C55]">sem juros</span>
           </span>
           <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
        </div>

        {/* Promos */}
        <div className="flex gap-2.5 mt-2 overflow-x-auto pb-1 hide-scrollbar">
           <div className="flex items-center gap-1.5 bg-[#FFF2F6] text-[#FF2C55] text-[11px] font-bold px-2.5 py-1.5 rounded-[5px] whitespace-nowrap">
              <svg width="15" height="15" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12V36C4 38.2091 5.79086 40 8 40H40C42.2091 40 44 38.2091 44 36V12C44 9.79086 42.2091 8 40 8H8C5.79086 8 4 9.79086 4 12Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4"/>
                <path d="M14 16V32" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <path d="M22 16V32" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <path d="M30 16V32" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <path d="M38 16V32" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              Compre R$ 39 e ganhe 12% de desconto
           </div>
           <div className="flex items-center gap-1.5 bg-[#FFF2F6] text-[#FF2C55] text-[11px] font-bold px-2.5 py-1.5 rounded-[5px] whitespace-nowrap">
              Economize 3% com boleto
              <ChevronRight className="w-3.5 h-3.5" />
           </div>
        </div>

        <div className="mt-4 flex items-start gap-1.5 relative">
          <h1 className="text-[17px] font-semibold leading-[1.3] text-[#161823] pr-8">
             {data.name}
          </h1>
          <Bookmark className="absolute right-0 top-1 w-5 h-5 text-gray-800" />
        </div>
        
        <div className="flex items-center gap-1.5 mt-2.5">
           <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(Number(data.rating) || 5) ? "fill-[#fbbf24] text-[#fbbf24]" : "fill-gray-200 text-gray-200"}`} />
              ))}
           </div>
            <div className="flex items-center gap-1 text-[13px] text-[#161823]">
              <span className="font-semibold">{Number.isNaN(Number(data.rating)) ? "4.9" : (data.rating || "4.9")}</span>
              <span className="text-gray-400">({formatSoldCount(data.reviewCount)})</span>
              <span className="h-3 w-[1px] bg-gray-200 mx-0.5" />
              <span className="text-[#161823] font-medium">{formatSoldCount(data.soldCount)} vendidos</span>
           </div>
        </div>

      </div>
    </div>
  );
}

function TicketIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V10C5.10457 10 6 10.8954 6 12C6 13.1046 5.10457 14 4 14V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V14C18.8954 14 18 13.1046 18 12C18 10.8954 18.8954 10 20 10Z"/>
    </svg>
  );
}

import { Truck } from "lucide-react";
