"use client";

import React from "react";
import { TopNav } from "@/components/TopNav";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductOptionsShipping } from "@/components/ProductOptionsShipping";
import { ReviewsDescription } from "@/components/ReviewsDescription";
import { ShopProfile } from "@/components/ShopProfile";
import { AboutProduct } from "@/components/AboutProduct";
import { BottomNav } from "@/components/BottomNav";
import { BackToTop } from "@/components/BackToTop";

import { Play, Grid2X2, X, Truck, TicketCheck, Zap } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";

interface StoreLandingLayoutProps {
  data: any;
  selectedKit: number;
  setSelectedKit: (kit: number) => void;
  selectedColor?: string | null;
  setSelectedColor?: (color: string | null) => void;
  selectedSize?: string | null;
  setSelectedSize?: (size: string | null) => void;
  modalAction: "cart" | "buy" | "select" | null;
  setModalAction: (action: "cart" | "buy" | "select" | null) => void;
  onConfirmAction: () => void;
  runCartAnimation: number;
  cartCount?: number;
  onAddToCart?: () => void;
  onCartClick?: () => void;
  onBuyNowClick?: () => void;
  activeTab?: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  isPreview?: boolean;
  onShareClick?: () => void;
  onBack?: () => void;
  onProductClick?: (product: any) => void;
}

export function StoreLandingLayout({
  data,
  selectedKit,
  setSelectedKit,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  modalAction,
  setModalAction,
  onConfirmAction,
  runCartAnimation,
  cartCount = 0,
  onAddToCart,
  onCartClick,
  onBuyNowClick,
  activeTab = "overview",
  scrollRef,
  isPreview = false,
  onShareClick,
  onBack,
  onProductClick
}: StoreLandingLayoutProps) {
  if (!data) return null;

  const isModalOpen = modalAction !== null && modalAction !== undefined;
  const kits = data?.kits || {};
  
  const getDisplayImage = () => {
     const colorData = data.colors?.find((c: any) => c.name === selectedColor);
     return (data.enableColor && colorData?.image) ? colorData.image : (kits[selectedKit]?.image || data?.carouselImages?.[0]);
  };

  const scrollSpyIds = isPreview 
    ? ["p-overview", "p-reviews", "p-description", "p-recommendations"]
    : ["overview", "reviews", "description", "recommendations"];

  const currentActiveTab = useScrollSpy(scrollSpyIds, 150, isPreview ? (scrollRef as any) : undefined);

  return (
    <div className={`w-full overflow-x-hidden flex flex-col relative ${!isPreview ? 'min-h-screen bg-[#F8F8F8] pb-24 font-sans selection:bg-[#ff0050] selection:text-white' : 'h-full'}`}>
       <div className={`${!isPreview ? 'w-full max-w-[480px] mx-auto bg-white min-h-screen shadow-xl relative' : 'h-full flex flex-col relative w-full overflow-hidden'}`}>

          <div 
            ref={scrollRef as any}
            className={`flex-1 ${isPreview ? 'overflow-y-auto scrollbar-hide scroll-smooth pb-40 relative' : ''}`}
          >
            <TopNav 
              activeTab={currentActiveTab} 
              isPreview={isPreview} 
              cartCount={cartCount}
              onCartClick={onCartClick}
              onShareClick={onShareClick}
              onBack={onBack}
              storeName={data?.storeName}
            />
            <main className={`${isPreview ? 'mt-[50px]' : 'mt-[100px]'} pb-24`}>
              <div id={isPreview ? "p-overview" : "overview"} className="scroll-mt-[110px]">
                <ProductCarousel data={data} />
                <ProductDetails selectedKit={selectedKit} data={data} />
              </div>
              
              <div className="h-2 bg-[#F8F8F8]" />
              
              <ProductOptionsShipping 
                selectedKit={selectedKit}
                setSelectedKit={setSelectedKit}
                modalAction={modalAction}
                setModalAction={setModalAction}
                onConfirmAction={onConfirmAction}
                data={data}
                isInPreview={isPreview}
              />
              
              <div className="h-2 bg-[#F8F8F8]" />
              <div id={isPreview ? "p-reviews" : "reviews"} className="scroll-mt-[110px]">
                <ReviewsDescription data={data} />
              </div>
              <div className="h-2 bg-[#F8F8F8]" />
              <div id={isPreview ? "p-shop" : "shop-profile"} className="scroll-mt-[110px]">
                <ShopProfile data={data} onProductClick={onProductClick} />
              </div>
              <div className="h-2 bg-[#F8F8F8]" />
              <div id={isPreview ? "p-description" : "description"} className="scroll-mt-[110px]">
                <AboutProduct variant="description" data={data} />
              </div>
              <div className="h-2 bg-[#F8F8F8]" />
              <div id={isPreview ? "p-recommendations" : "recommendations"} className="scroll-mt-[110px]">
                <AboutProduct variant="recommendations" data={data} onProductClick={onProductClick} />
              </div>
              <div className="h-6 bg-[#F8F8F8]" />
            </main>
          </div>
          
          {!isPreview && <BackToTop />}
          
          <BottomNav 
            selectedKit={selectedKit}
            onAddToCart={onAddToCart} 
            onBuyNow={onBuyNowClick || (() => setModalAction("buy"))} 
            runCartAnimation={runCartAnimation}
            isInPreview={isPreview}
            onStoreClick={onBack}
          />

          {/* Modal TikTok Shop Fiel */}
          {modalAction && (
            <div className="fixed inset-0 z-[250] flex items-end justify-center sm:items-center bg-black/60 transition-all duration-300 animate-in fade-in">
              <div 
                className={`bg-white w-full max-w-[480px] rounded-t-[20px] sm:rounded-[20px] shadow-2xl flex flex-col overflow-hidden relative ${isPreview ? '' : 'animate-in slide-in-from-bottom duration-300'}`}
                style={{ maxHeight: '92vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Estilo TikTok */}
                <div className="flex items-center justify-between px-4 py-4">
                   <h2 className="text-[17px] font-bold text-[#161823]">Selecionar variações</h2>
                   <button 
                      onClick={() => setModalAction(null)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                   >
                      <X className="w-6 h-6 text-[#161823]" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar flex flex-col gap-6">
                   {/* Product Entry Summary (Fidelidade TikTok Shop) */}
                   <div className="flex gap-3 items-start">
                      <div className="w-[84px] h-[84px] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center shrink-0">
                         {(() => {
                            const finalImg = getDisplayImage();
                            return finalImg ? (
                               <img src={finalImg} alt="" className="w-full h-full object-cover" />
                            ) : (
                               <Grid2X2 className="w-8 h-8 text-gray-200" />
                            );
                         })()}
                      </div>
                      <div className="flex flex-col gap-1.5 pt-0.5">
                         <div className="flex items-center gap-1.5 flex-wrap">
                            <div className="bg-[#fe2c55] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                               -{Math.round(((kits[selectedKit]?.originalPrice - kits[selectedKit]?.price) / kits[selectedKit]?.originalPrice) * 100) || 20}%
                            </div>
                            <div className="flex items-baseline gap-0.5 text-[#fe2c55] font-black">
                               <span className="text-[14px]">R$</span>
                               <span className="text-[24px] leading-none tracking-tight">
                                  {kits[selectedKit]?.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[0]}
                                  <span className="text-[18px]">,{kits[selectedKit]?.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',')[1]}</span>
                               </span>
                               <TicketCheck className="w-4 h-4 ml-1" />
                            </div>
                         </div>
                         
                         <div className="text-[12px] text-gray-400 line-through font-medium">
                            R$ {kits[selectedKit]?.originalPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                         </div>
                         
                         <div className="flex flex-wrap gap-1.5 mt-0.5">
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#e1f9f6] text-[#00c9a7] rounded-[4px] border border-[#d1f2eb]">
                               <Truck className="w-3.5 h-3.5 fill-current opacity-80" />
                               <span className="text-[10px] font-bold">Frete grátis</span>
                            </div>
                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#fff0f3] text-[#fe2c55] rounded-[4px] border border-[#ffdee4]">
                               <div className="w-3.5 h-3.5 flex items-center justify-center">
                                  <Zap className="w-2.5 h-2.5 fill-current" />
                                </div>
                               <span className="text-[10px] font-bold">Desconto de R$ 10</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Variations Section */}
                   <div className="space-y-6">
                      {/* Cor Section (TikTok Style: 2 rows horizontal scroll) */}
                      {data.enableColor && data.colors && data.colors.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <span className="text-[14px] font-bold text-[#161823]">COR ({data.colors.length})</span>
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-rows-2 grid-flow-col gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                  {data.colors.map((color: any, idx: number) => {
                                     const isSelected = selectedColor === color.name;
                                     const hasImage = !!color.image && color.image.length > 5;

                                     if (hasImage) {
                                      return (
                                         <button
                                             key={idx}
                                             onClick={() => setSelectedColor?.(color.name)}
                                             className={`flex flex-col rounded-lg border-2 overflow-hidden transition-all duration-200 w-[106px] shrink-0 ${isSelected ? 'border-[#fe2c55]' : 'border-gray-50 bg-gray-50'}`}
                                         >
                                             <div className="w-full aspect-square bg-white flex items-center justify-center overflow-hidden">
                                                <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                                             </div>
                                             <div className="p-2 bg-white flex-1 flex flex-col justify-center min-h-[44px]">
                                                <span className={`text-[11px] font-medium leading-tight line-clamp-2 text-center ${isSelected ? 'text-[#fe2c55]' : 'text-gray-800'}`}>
                                                   {color.name}
                                                </span>
                                             </div>
                                         </button>
                                      );
                                     }

                                     // Se não tiver imagem
                                     return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor?.(color.name)}
                                            className={`px-4 py-2.5 rounded-md text-[13px] font-bold border-2 transition-all w-[106px] shrink-0 flex items-center justify-center ${isSelected ? 'bg-[#fff0f3] border-[#fe2c55] text-[#fe2c55]' : 'bg-gray-50 border-transparent text-[#161823]'}`}
                                        >
                                            <span className="truncate">{color.name}</span>
                                        </button>
                                     );
                                  })}
                                </div>
                                
                                {/* TikTok Scroll Indicator */}
                                <div className="w-8 h-1 bg-gray-100 rounded-full mx-auto relative overflow-hidden mt-1">
                                    <div className="absolute top-0 left-0 h-full w-1/3 bg-gray-400 rounded-full" />
                                </div>
                            </div>
                        </div>
                      )}

                      {/* Size Section */}
                      {data.enableSize && data.sizes && data.sizes.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <span className="text-[14px] font-bold text-[#161823]">TAM</span>
                            <div className="flex flex-wrap gap-2">
                              {data.sizes.map((size: string, idx: number) => {
                                 const isSelected = selectedSize === size;
                                 return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedSize?.(size)}
                                        className={`min-w-[60px] px-4 py-2 rounded-md text-[13px] font-bold border-2 transition-all ${isSelected ? 'border-[#fe2c55] text-[#fe2c55]' : 'border-gray-100 text-gray-800'}`}
                                    >
                                        {size.toUpperCase()}
                                    </button>
                                 );
                              })}
                            </div>
                        </div>
                      )}
                      
                      {/* Kits (Caso não tenha seção específica, mantivemos o fluxo) */}
                      <div className="flex flex-col gap-3">
                          <span className="text-[14px] font-bold text-[#161823]">Kit</span>
                          <div className="flex flex-wrap gap-2">
                            {Object.keys(kits).map((idStr) => {
                               const id = Number(idStr);
                               const isSelected = selectedKit === id;
                               return (
                                 <button
                                     key={id}
                                     onClick={() => setSelectedKit(id)}
                                     className={`px-4 py-2 rounded-md text-[13px] font-bold border-2 transition-all ${isSelected ? 'border-[#fe2c55] text-[#fe2c55]' : 'border-gray-100 text-gray-800'}`}
                                  >
                                     {(kits[id]?.name || `${id}x Kit`).toUpperCase()}
                                 </button>
                               );
                            })}
                          </div>
                      </div>
                   </div>
                </div>

                {/* Final Action Button (Rounded Full) */}
                <div className="p-4 bg-white">
                   <button 
                       onClick={() => {
                         if (modalAction === "cart" || modalAction === "buy") {
                            onConfirmAction();
                         } else {
                            setModalAction(null);
                         }
                       }}
                       className="w-full bg-[#fe2c55] text-white py-3.5 rounded-full font-bold text-[16px] transition-all active:scale-[0.98] shadow-lg shadow-[#fe2c55]/20"
                   >
                       {modalAction === "buy" ? 'Finalizar Compra' : 'Adicionar ao carrinho'}
                   </button>
                </div>
              </div>
            </div>
          )}
       </div>
    </div>
  );
}

