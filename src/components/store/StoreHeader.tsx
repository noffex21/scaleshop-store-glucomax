import React from "react";
import { Search, Share2, ShoppingCart, ChevronLeft } from "lucide-react";
import { formatSoldCount } from "@/lib/utils";

interface StoreHeaderProps {
  storeName: string;
  storeLogo: string;
  soldCount: string;
  cartCount: number;
  onBack?: () => void;
  onCartClick?: () => void;
  onSearch?: (query: string) => void;
  initialSearchQuery?: string;
  storeBackground?: string;
  isVerified?: boolean;
}

export function StoreHeader({ 
  storeName, 
  storeLogo, 
  soldCount, 
  cartCount, 
  onBack, 
  onCartClick, 
  onSearch,
  initialSearchQuery,
  storeBackground, 
  isVerified 
}: StoreHeaderProps) {
  const [isSearching, setIsSearching] = React.useState(!!initialSearchQuery);
  const [searchVal, setSearchVal] = React.useState(initialSearchQuery || "");

  const handleSearchToggle = () => {
    if (isSearching) {
      setIsSearching(false);
      setSearchVal("");
      if (onSearch) onSearch("");
    } else {
      setIsSearching(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchVal(val);
    if (onSearch) onSearch(val);
  };

  return (
    <div 
      className="text-white pt-10 pb-6 px-4 relative overflow-hidden transition-all duration-500"
      style={{ 
        backgroundColor: storeBackground ? 'transparent' : '#001D35',
        backgroundImage: storeBackground ? `url(${storeBackground})` : 'url(/images/store-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center -30px'
      }}
    >
      {/* Search and Icons Row */}
      <div className="flex items-center justify-between mb-6 h-9">
        {!isSearching ? (
          <>
            <ChevronLeft className="w-6 h-6 cursor-pointer active:scale-90 transition-transform" onClick={onBack} />
            <div className="flex items-center gap-4">
              <Search className="w-6 h-6 cursor-pointer active:scale-95" onClick={handleSearchToggle} />
              <button className="flex items-center justify-center active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 5v4c-7 0-10 2.5-11 10 2.5-3.5 6-5 11-5v4l7-6.5L14 5z"/>
                </svg>
              </button>
              <button 
                id="cart-icon"
                className="relative active:scale-95"
                onClick={() => onCartClick ? onCartClick() : null}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FE2C55] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center gap-2 animate-in slide-in-from-right duration-300">
            <div className="flex-1 flex items-center h-9 bg-white/20 backdrop-blur-md rounded-full px-3 border border-white/30">
              <Search className="w-4 h-4 text-white/70 mr-2" />
              <input 
                autoFocus
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchVal}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-white placeholder-white/60 font-medium"
              />
            </div>
            <button 
              onClick={handleSearchToggle}
              className="text-[14px] font-bold text-white px-1 whitespace-nowrap active:opacity-70"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Integrated Store Identity & Banner Card */}
      <div className="bg-white rounded-2xl flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#F1F1F2] mt-2 relative z-10 overflow-hidden">
        {/* Top: Identity Info */}
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[54px] h-[54px] rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-[#F8F8F8] flex items-center justify-center">
                {storeLogo ? (
                  <img src={storeLogo} alt={storeName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#FE2C55]/10 flex items-center justify-center">
                    <span className="text-[#FE2C55] font-black text-xl">{storeName?.charAt(0) || "S"}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <h1 className="text-[#161823] font-black text-[16px] leading-tight">{storeName || "Nome da Loja"}</h1>
                  {isVerified && (
                    <img src="/VERIFICADO.png" className="w-[14px] h-[14px] object-contain shrink-0" alt="Verificado" />
                  )}
                </div>
                <p className="text-[#8A8B91] text-[12px] font-medium">{formatSoldCount(soldCount)} vendido(s)</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 min-w-[100px]">
              <button className="bg-[#FE2C55] text-white px-4 py-1.5 rounded-full text-[13px] font-black active:scale-95 transition-transform">
                Seguir
              </button>
              <button className="bg-[#F8F8F8] text-[#161823] px-4 py-1.5 rounded-full text-[13px] font-black active:scale-95 transition-transform border border-[#E1E1E2]">
                Mensagem
              </button>
            </div>
        </div>


      </div>
    </div>
  );
}
