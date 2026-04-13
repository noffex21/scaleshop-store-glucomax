"use client";
import { ChevronLeft, Search, ShoppingCart, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function TopNav({ 
  activeTab: defaultActiveTab, 
  isPreview = false,
  cartCount = 0,
  onCartClick,
  onShareClick,
  onBack,
  storeName
}: { 
  activeTab?: string, 
  isPreview?: boolean,
  cartCount?: number,
  onCartClick?: () => void,
  onShareClick?: () => void,
  onBack?: () => void,
  storeName?: string
}) {
  const router = useRouter();
  const tabs = [
    { label: "Visão geral", id: "overview" },
    { label: "Avaliações", id: "reviews" },
    { label: "Descrição", id: "description" },
    { label: "Recomendações", id: "recommendations" }
  ];

  const [activeTab, setActiveTab] = useState(defaultActiveTab || "overview");

  useEffect(() => {
    if (defaultActiveTab) setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  return (
    <div className={`${isPreview ? 'sticky' : 'fixed'} top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${!isPreview ? 'max-w-[480px] mx-auto' : ''}`}>
       <div className="flex items-center justify-between px-3 py-2.5 h-[52px]">
          <button 
            onClick={onBack}
            className="flex items-center justify-center text-black p-1 active:scale-90 transition-transform"
          >
             <ChevronLeft className="h-6 w-6 stroke-[1.8]" />
          </button>

          {/* Search Bar */}
          <div className="flex-1 flex items-center h-[36px] bg-[#f1f1f2] rounded-full px-3 mx-2">
             <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" strokeWidth={2.5} />
             <input 
               type="text"
               placeholder={storeName || "Pesquisar"}
               className="flex-1 bg-transparent text-[14px] text-[#161823] placeholder-gray-500 outline-none border-none font-normal"
               onKeyDown={(e) => {
                 if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                   const query = (e.target as HTMLInputElement).value.trim();
                   const params = new URLSearchParams(window.location.search);
                   const sub = params.get("subdomain");
                   const path = sub ? `/loja?subdomain=${sub}&q=${encodeURIComponent(query)}` : `/loja?q=${encodeURIComponent(query)}`;
                   router.push(path);
                 }
               }}
             />
          </div>

          {/* Right Area Icons */}
          <div className="flex items-center gap-0.5">
            <button 
              onClick={onShareClick}
              className="p-1.5 text-black active:scale-90 transition-transform"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M14 5v4c-7 0-10 2.5-11 10 2.5-3.5 6-5 11-5v4l7-6.5L14 5z"/>
               </svg>
            </button>
            <button 
              onClick={onCartClick}
              className="p-1.5 text-black active:scale-90 transition-transform relative"
            >
               <ShoppingCart className="w-[22px] h-[22px] stroke-[1.8]" />
               {cartCount > 0 && (
                 <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-[#fe2c55] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-in zoom-in duration-300">
                   {cartCount}
                 </span>
               )}
            </button>
            <button className="p-1.5 text-black active:scale-90 transition-transform">
               <MoreHorizontal className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>
       </div>

       {/* Tabs Row */}
       <div className="flex items-center justify-between px-4 h-[44px] bg-white/50 border-b border-gray-100/50 overflow-x-auto overflow-y-hidden flex-nowrap scrollbar-hide">
          {tabs.map((tab) => {
             const isActive = activeTab === tab.id;
             return (
               <button 
                  key={tab.id}
                  onClick={() => {
                    const targetId = isPreview ? `p-${tab.id}` : tab.id;
                    const el = document.getElementById(targetId);
                    
                    if (el) {
                      const container = el.closest('.overflow-y-auto');
                      if (container) {
                        container.scrollTo({
                          top: el.offsetTop - 50,
                          behavior: "smooth"
                        });
                      } else {
                        const offset = 100; // Ajustado para a Nav Bar fixa
                        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth"
                        });
                      }
                    }
                  }}
                  className="relative flex flex-col items-center justify-center h-full px-4 flex-shrink-0"
               >
                  <span className={`text-[14px] whitespace-nowrap transition-all duration-300 ${isActive ? "text-[#161823] font-bold" : "text-gray-500 font-medium"}`}>
                     {tab.label}
                  </span>
                  {isActive && (
                     <div className="absolute bottom-[0px] w-full max-w-[32px] h-[3px] bg-[#161823] rounded-full transition-all duration-300" />
                  )}
               </button>
             );
          })}
       </div>
    </div>
  );
}
