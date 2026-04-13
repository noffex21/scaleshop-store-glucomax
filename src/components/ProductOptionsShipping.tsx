"use client";

import { ChevronRight, Truck, ShieldCheck, Grid2X2, Check, Ticket, Play } from "lucide-react";
import { useState } from "react";

export function ProductOptionsShipping({ 
  selectedKit = 1, 
  setSelectedKit,
  modalAction,
  setModalAction,
  onConfirmAction,
  data,
  isInPreview = false
}: { 
  selectedKit?: number, 
  setSelectedKit?: (val: number) => void,
  modalAction?: "cart" | "buy" | "select" | null,
  setModalAction?: (val: "cart" | "buy" | "select" | null) => void,
  onConfirmAction?: () => void,
  data?: any,
  isInPreview?: boolean
}) {
  const isModalOpen = modalAction !== null && modalAction !== undefined;
  const kits = data?.kits || {};

  return (
    <div className="bg-white rounded-[14px] flex flex-col overflow-hidden">
      {/* ... (Shipping Box remains same) */}
      <div className="px-3 py-3 border-b border-gray-50/60">
         <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
               <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px] text-[#161823] mt-[1px] shrink-0 flip-rtl">
                  <g clipPath="url(#Icon-Truck_Moving_LTR_svg__a)">
                    <path d="M9.73 7c-.78 0-1.48 0-2.06.05-.63.05-1.29.16-1.94.5a5 5 0 0 0-2.19 2.18 4.5 4.5 0 0 0-.4 1.27H27.2c.87 0 1.4 0 1.8.03a2.58 2.58 0 0 1 .45.08 1 1 0 0 1 .45.45l.02.06.05.37c.03.4.03.94.03 1.81V26a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8h4.03c1.23 0 1.36.03 1.44.05a1 1 0 0 1 .38.24c.06.06.14.16.69 1.26l.8 1.6a33.9 33.9 0 0 1 1.88 4.08 15 15 0 0 1 .64 2.7c.14 1 .14 2.04.14 4.5V36h-3.5a6.8 6.8 0 0 0-13 0h-8a6.8 6.8 0 0 0-12.48-1.24C7 34.4 7 33.91 7 33.2V32a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v1.27c0 .78 0 1.48.05 2.06.05.63.16 1.29.5 1.94a5 5 0 0 0 2.87 2.46A6.8 6.8 0 0 0 19.5 40h8a6.8 6.8 0 0 0 13 0h3.95c.23 0 .52 0 .77-.02.29-.02.7-.08 1.14-.3a3 3 0 0 0 1.62-2.46c.02-.25.02-.54.02-.77v-4.19c0-2.24 0-3.57-.18-4.88a19 19 0 0 0-.81-3.43c-.42-1.25-1.02-2.44-2.02-4.45l-.87-1.74-.1-.19a7.7 7.7 0 0 0-1.38-2.14 5 5 0 0 0-1.86-1.16 7.7 7.7 0 0 0-2.54-.27H34v-.27c0-.78 0-1.48-.05-2.06a5.08 5.08 0 0 0-.5-1.94 5 5 0 0 0-2.18-2.19 5.07 5.07 0 0 0-1.94-.5C28.75 7 28.05 7 27.27 7H9.73Zm.1 31.37v-.74a3.2 3.2 0 1 1 0 .74ZM34 34.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Z"></path>
                    <path d="M1 19h16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1ZM3 24a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2Z"></path>
                  </g>
                  <defs>
                    <clipPath id="Icon-Truck_Moving_LTR_svg__a">
                      <path d="M0 0h48v48H0z"></path>
                    </clipPath>
                  </defs>
               </svg>
               <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-[#161823] text-[13px]">
                     <span className="text-[#00c9a7] font-medium">Frete grátis</span>
                     <span className="font-normal text-gray-500">
                        Receba até {(() => {
                           const d1 = new Date();
                           const d2 = new Date();
                           d1.setDate(d1.getDate() + 4);
                           d2.setDate(d2.getDate() + 7);
                           const m = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][d2.getMonth()];
                           return `${d1.getDate()}–${d2.getDate()} de ${m}`;
                        })()}
                     </span>
                  </div>
                  <div className="text-[13px] text-gray-500 mt-1">
                     Taxa de envio: <span className="line-through">R$ 8,40</span>
                  </div>
               </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5" />
         </div>
      </div>

      {/* Product Options Selector */}
      <button 
         onClick={() => setModalAction?.("select")}
         className="px-3 py-3 w-full flex items-center justify-between active:bg-gray-50 transition-colors"
      >
         <div className="flex items-center gap-2.5">
            <Grid2X2 className="w-[18px] h-[18px] text-gray-700 stroke-[1.5]" />
            <div className="flex gap-2 ml-1">
               {Object.keys(kits).map((idStr) => {
                 const id = Number(idStr);
                 return (
                  <div 
                   key={id} 
                   className={`w-[40px] h-[40px] rounded bg-gray-100 overflow-hidden border-2 flex items-center justify-center transition-all ${selectedKit === id ? 'border-[#fe2c55]' : 'border-gray-100'}`}
                  >
                     {(kits[id]?.image || data?.carouselImages?.[0]) ? (
                        <img src={kits[id]?.image || data?.carouselImages?.[0]} className="w-full h-full object-cover" alt={`Kit ${id}`} />
                     ) : (
                        <Grid2X2 className="w-4 h-4 text-gray-300" />
                     )}
                  </div>
                 );
               })}
            </div>
         </div>
         <div className="flex items-center gap-1 text-[13px] text-gray-500 font-medium">
            {Object.keys(kits).length} opções disponíveis
            <ChevronRight className="w-4 h-4 text-gray-400" />
         </div>
      </button>

      {/* Modal moved to Layout level for proper preview positioning */}

      {/* ... rest of the component (Protection, Offers, Videos) remains same but could also be data-driven if needed) */}

      {/* Customer Protection */}
      <div className="bg-white px-3 py-3 border-b border-gray-100">
         <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path fillRule="evenodd" clipRule="evenodd" d="M12 1.5C11.6 1.5 11.2 1.6 10.9 1.8L3.2 6.4C2.7 6.7 2.4 7.2 2.4 7.7V12.6C2.4 18.2 6.6 22.9 11.9 23.5C12 23.5 12 23.5 12.1 23.5C17.4 22.9 21.6 18.2 21.6 12.6V7.7C21.6 7.2 21.3 6.7 20.8 6.4L13.1 1.8C12.8 1.6 12.4 1.5 12 1.5Z" fill="#A47035"/>
                 <path d="M10.8 16.2L6.5 11.9L8.1 10.3L10.8 13L16.2 7.6L17.8 9.2L10.8 16.2Z" fill="white"/>
               </svg>
               <span className="text-[13px] font-bold text-[#92530C]">Proteção do cliente</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
         </div>
         <div className="pl-[28px] grid grid-cols-2 gap-y-2 gap-x-2">
            <div className="flex items-center gap-1.5 text-[13px] text-[#161823]">
               <Check className="w-3.5 h-3.5 text-[#92530C] shrink-0" strokeWidth={3} />
               Devolução gratuita
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#161823] truncate">
               <Check className="w-3.5 h-3.5 text-[#92530C] shrink-0" strokeWidth={3} />
               Reembolso automático por danos
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#161823]">
               <Check className="w-3.5 h-3.5 text-[#92530C] shrink-0" strokeWidth={3} />
               Pagamento seguro
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#161823]">
               <Check className="w-3.5 h-3.5 text-[#92530C] shrink-0" strokeWidth={3} />
               Reembolso automático por atraso
            </div>
         </div>
      </div>

      {/* Ofertas */}
      <div className="bg-white px-3 py-3 border-b border-gray-100">
         <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
               <span className="text-[15px] font-bold text-[#161823]">Ofertas</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
         </div>
         

         {/* Horizontal Scroll Coupons */}
         <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {/* Coupon 1 */}
            {/* Coupon 1 */}
            <div className="flex flex-shrink-0 items-stretch rounded-xl overflow-hidden h-[76px] min-w-[310px] bg-[#f8fdfd] border border-[#007b7b]/10 relative ticket-shape">
               {/* Ticket Cutouts */}
               <div className="absolute left-[80px] -top-1.5 w-3 h-3 bg-white rounded-full border border-[#007b7b]/10 z-10"></div>
               <div className="absolute left-[80px] -bottom-1.5 w-3 h-3 bg-white rounded-full border border-[#007b7b]/10 z-10"></div>
               
               <div className="w-[82px] flex flex-col items-center justify-center border-r border-dashed border-[#007b7b]/20 relative">
                  <div className="mb-0.5">
                     <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="text-[#007b7b] w-[26px] h-[26px] flip-rtl">
                        <g clipPath="url(#Icon-Truck_Moving_Coupon1)">
                          <path d="M9.73 7c-.78 0-1.48 0-2.06.05-.63.05-1.29.16-1.94.5a5 5 0 0 0-2.19 2.18 4.5 4.5 0 0 0-.4 1.27H27.2c.87 0 1.4 0 1.8.03a2.58 2.58 0 0 1 .45.08 1 1 0 0 1 .45.45l.02.06.05.37c.03.4.03.94.03 1.81V26a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8h4.03c1.23 0 1.36.03 1.44.05a1 1 0 0 1 .38.24c.06.06.14.16.69 1.26l.8 1.6a33.9 33.9 0 0 1 1.88 4.08 15 15 0 0 1 .64 2.7c.14 1 .14 2.04.14 4.5V36h-3.5a6.8 6.8 0 0 0-13 0h-8a6.8 6.8 0 0 0-12.48-1.24C7 34.4 7 33.91 7 33.2V32a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v1.27c0 .78 0 1.48.05 2.06.05.63.16 1.29.5 1.94a5 5 0 0 0 2.87 2.46A6.8 6.8 0 0 0 19.5 40h8a6.8 6.8 0 0 0 13 0h3.95c.23 0 .52 0 .77-.02.29-.02.7-.08 1.14-.3a3 3 0 0 0 1.62-2.46c.02-.25.02-.54.02-.77v-4.19c0-2.24 0-3.57-.18-4.88a19 19 0 0 0-.81-3.43c-.42-1.25-1.02-2.44-2.02-4.45l-.87-1.74-.1-.19a7.7 7.7 0 0 0-1.38-2.14 5 5 0 0 0-1.86-1.16 7.7 7.7 0 0 0-2.54-.27H34v-.27c0-.78 0-1.48-.05-2.06a5.08 5.08 0 0 0-.5-1.94 5 5 0 0 0-2.18-2.19 5.07 5.07 0 0 0-1.94-.5C28.75 7 28.05 7 27.27 7H9.73Zm.1 31.37v-.74a3.2 3.2 0 1 1 0 .74ZM34 34.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Z"></path>
                          <path d="M1 19h16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1ZM3 24a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2Z"></path>
                        </g>
                        <defs>
                          <clipPath id="Icon-Truck_Moving_Coupon1">
                            <path d="M0 0h48v48H0z"></path>
                          </clipPath>
                        </defs>
                     </svg>
                  </div>
                  <span className="text-[11px] text-[#007b7b] font-bold">Envio</span>
               </div>
               <div className="flex-1 flex items-center justify-between pl-5 pr-3">
                  <div className="flex flex-col">
                     <span className="text-[16px] font-bold text-[#007b7b] leading-tight">R$ 20 de desconto</span>
                     <span className="text-[10.5px] text-[#161823] font-medium">em pedidos acima de R$ 50</span>
                  </div>
                  <button className="bg-[#00B9B9] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm shadow-[#00B9B9]/20 active:scale-95 transition-all ml-2">
                     Resgatar
                  </button>
               </div>
            </div>
            
            {/* Coupon 2 */}
            <div className="flex flex-shrink-0 items-stretch rounded-xl overflow-hidden h-[76px] min-w-[310px] bg-[#f8fdfd] border border-[#007b7b]/10 relative ticket-shape">
               {/* Ticket Cutouts */}
               <div className="absolute left-[80px] -top-1.5 w-3 h-3 bg-white rounded-full border border-[#007b7b]/10 z-10"></div>
               <div className="absolute left-[80px] -bottom-1.5 w-3 h-3 bg-white rounded-full border border-[#007b7b]/10 z-10"></div>
               
               <div className="w-[82px] flex flex-col items-center justify-center border-r border-dashed border-[#007b7b]/20 relative">
                  <div className="mb-0.5">
                     <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="text-[#007b7b] w-[26px] h-[26px] flip-rtl">
                        <g clipPath="url(#Icon-Truck_Moving_Coupon2)">
                          <path d="M9.73 7c-.78 0-1.48 0-2.06.05-.63.05-1.29.16-1.94.5a5 5 0 0 0-2.19 2.18 4.5 4.5 0 0 0-.4 1.27H27.2c.87 0 1.4 0 1.8.03a2.58 2.58 0 0 1 .45.08 1 1 0 0 1 .45.45l.02.06.05.37c.03.4.03.94.03 1.81V26a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8h4.03c1.23 0 1.36.03 1.44.05a1 1 0 0 1 .38.24c.06.06.14.16.69 1.26l.8 1.6a33.9 33.9 0 0 1 1.88 4.08 15 15 0 0 1 .64 2.7c.14 1 .14 2.04.14 4.5V36h-3.5a6.8 6.8 0 0 0-13 0h-8a6.8 6.8 0 0 0-12.48-1.24C7 34.4 7 33.91 7 33.2V32a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v1.27c0 .78 0 1.48.05 2.06.05.63.16 1.29.5 1.94a5 5 0 0 0 2.87 2.46A6.8 6.8 0 0 0 19.5 40h8a6.8 6.8 0 0 0 13 0h3.95c.23 0 .52 0 .77-.02.29-.02.7-.08 1.14-.3a3 3 0 0 0 1.62-2.46c.02-.25.02-.54.02-.77v-4.19c0-2.24 0-3.57-.18-4.88a19 19 0 0 0-.81-3.43c-.42-1.25-1.02-2.44-2.02-4.45l-.87-1.74-.1-.19a7.7 7.7 0 0 0-1.38-2.14 5 5 0 0 0-1.86-1.16 7.7 7.7 0 0 0-2.54-.27H34v-.27c0-.78 0-1.48-.05-2.06a5.08 5.08 0 0 0-.5-1.94 5 5 0 0 0-2.18-2.19 5.07 5.07 0 0 0-1.94-.5C28.75 7 28.05 7 27.27 7H9.73Zm.1 31.37v-.74a3.2 3.2 0 1 1 0 .74ZM34 34.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Z"></path>
                          <path d="M1 19h16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1ZM3 24a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2Z"></path>
                        </g>
                        <defs>
                          <clipPath id="Icon-Truck_Moving_Coupon2">
                            <path d="M0 0h48v48H0z"></path>
                          </clipPath>
                        </defs>
                     </svg>
                  </div>
                  <span className="text-[11px] text-[#007b7b] font-bold">Envio</span>
               </div>
               <div className="flex-1 flex items-center justify-between pl-5 pr-3">
                  <div className="flex flex-col">
                     <span className="text-[16px] font-bold text-[#007b7b] leading-tight">Frete grátis</span>
                     <span className="text-[10.5px] text-[#161823] font-medium">em pedidos acima de R$ 50</span>
                  </div>
                  <button className="bg-[#00B9B9] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm shadow-[#00B9B9]/20 active:scale-95 transition-all ml-2">
                     Resgatar
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Videos de criadores */}
      {data.creatorVideos && data.creatorVideos.length > 0 && (
      <div className="bg-white pt-4 pb-2 border-b-4 border-stone-100">
         <h2 className="text-[15px] font-bold text-[#161823] px-3 mb-3">Vídeos de criadores ({data.creatorVideos.length})</h2>
         <div className="flex gap-2.5 overflow-x-auto pl-3 pr-4 pb-2 hide-scrollbar">
            {data.creatorVideos.map((video: any) => (
              <div key={video.id} className="relative w-[130px] h-[180px] rounded-lg overflow-hidden flex-shrink-0">
                <img src={video.coverImage} className="w-full h-full object-cover" alt="Video cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 left-2 bg-black/20 rounded-full p-1 border border-white/20">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-gray-300 overflow-hidden border border-white">
                    <img src={video.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-[11px] font-medium truncate w-[90px]">{video.username}</span>
                </div>
              </div>
            ))}
          </div>
      </div>
      )}
    </div>
  );
}
