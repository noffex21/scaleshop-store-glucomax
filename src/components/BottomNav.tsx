"use client";

import { MessageSquare, Store, ShoppingCart, Check, Package } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

// Pré-calculado: 10 pontos distribuídos em 360°
const PARTICLE_OFFSETS = [
  { x: 45, y: 0 },
  { x: 35, y: -32 },
  { x: 14, y: -43 },
  { x: -14, y: -43 },
  { x: -35, y: -32 },
  { x: -45, y: 0 },
  { x: -35, y: 32 },
  { x: -14, y: 43 },
  { x: 14, y: 43 },
  { x: 35, y: 32 },
];
const COLORS = ["#fe2c55", "#ff6b35", "#ffd166", "#06d6a0", "#118ab2", "#ff85a1", "#a8dadc", "#e63946", "#457b9d", "#f4a261"];

type AddState = "idle" | "adding" | "added";

export function BottomNav({ 
  selectedKit = 1,
  onAddToCart,
  onBuyNow,
  runCartAnimation,
  isInPreview = false,
  onStoreClick
}: { 
  selectedKit?: number,
  onAddToCart?: () => void,
  onBuyNow?: () => void,
  runCartAnimation?: number,
  isInPreview?: boolean,
  onStoreClick?: () => void
}) {
  const [addState, setAddState] = useState<AddState>("idle");
  const [showParticles, setShowParticles] = useState(false);
  const [showFlying, setShowFlying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (runCartAnimation && runCartAnimation > 0 && addState === "idle") {
      setAddState("adding");
      setShowParticles(true);
      setShowFlying(true);
  
      setTimeout(() => setShowParticles(false), 650);
      setTimeout(() => setShowFlying(false), 850);
      setTimeout(() => setAddState("added"), 500);
      setTimeout(() => {
        setAddState("idle"); 
      }, 1500);
    }
  }, [runCartAnimation]);

  const handleAddToCart = () => {
    onAddToCart?.();
  };

  const handleBuyNow = () => {
    onBuyNow?.();
  };

  return (
    <>
      <style>{`
        @keyframes flyToCart {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          55%  { transform: translate(60px, -100px) scale(0.6); opacity: 0.85; }
          100% { transform: translate(30px, -155px) scale(0.1); opacity: 0; }
        }
        @keyframes particle-0  { to { transform: translate(45px, 0px)   scale(0); opacity: 0; } }
        @keyframes particle-1  { to { transform: translate(35px, -32px) scale(0); opacity: 0; } }
        @keyframes particle-2  { to { transform: translate(14px, -43px) scale(0); opacity: 0; } }
        @keyframes particle-3  { to { transform: translate(-14px,-43px) scale(0); opacity: 0; } }
        @keyframes particle-4  { to { transform: translate(-35px,-32px) scale(0); opacity: 0; } }
        @keyframes particle-5  { to { transform: translate(-45px, 0px)  scale(0); opacity: 0; } }
        @keyframes particle-6  { to { transform: translate(-35px, 32px) scale(0); opacity: 0; } }
        @keyframes particle-7  { to { transform: translate(-14px, 43px) scale(0); opacity: 0; } }
        @keyframes particle-8  { to { transform: translate(14px,  43px) scale(0); opacity: 0; } }
        @keyframes particle-9  { to { transform: translate(35px,  32px) scale(0); opacity: 0; } }
        @keyframes cartBadgePop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes btnSuccess {
          0%   { background-color: rgb(231 229 228); }
          50%  { background-color: rgb(209 250 229); }
          100% { background-color: rgb(236 253 245); }
        }
      `}</style>

      {/* Flying package */}
      {showFlying && (
        <div
          className={`${isInPreview ? "absolute" : "fixed"} z-[200] pointer-events-none`}
          style={{
            bottom: "48px",
            left: isInPreview ? "calc(50% - 120px)" : "calc(50% - 120px)", 
            animation: "flyToCart 0.85s cubic-bezier(0.33, 1, 0.68, 1) forwards",
          }}
        >
          <Package className="w-5 h-5 text-[#fe2c55] drop-shadow-md" />
        </div>
      )}

      {/* Burst particles */}
      {showParticles && (
        <div
          className={`${isInPreview ? "absolute" : "fixed"} pointer-events-none z-[200]`}
          style={{ bottom: "54px", left: isInPreview ? "calc(50% - 115px)" : "calc(50% - 115px)" }}
        >
          {PARTICLE_OFFSETS.map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: i % 3 === 0 ? "10px" : "7px",
                height: i % 3 === 0 ? "10px" : "7px",
                backgroundColor: COLORS[i],
                animation: `particle-${i} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                animationDelay: `${i * 15}ms`,
              }}
            />
          ))}
        </div>
      )}


      {/* Bottom Bar */}
      <div className={`${isInPreview ? "absolute" : "fixed"} bottom-0 left-0 right-0 z-50 mx-auto max-w-[480px] bg-white border-t border-gray-100 flex items-center px-4 py-3 pb-[34px] gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.01)]`}>
        <div className="flex gap-4 items-center pl-1">
          <button 
            onClick={() => {
              if (onStoreClick) {
                onStoreClick();
              } else {
                const params = new URLSearchParams(window.location.search);
                const currentSubdomain = params.get("subdomain");
                router.push(currentSubdomain ? `/loja?subdomain=${currentSubdomain}` : "/loja");
              }
            }}
            className="flex flex-col items-center justify-center gap-1 text-[#161823]"
          >
            <Store className="h-[20px] w-[20px] stroke-[1.5]" />
            <span className="text-[11px] font-medium">Loja</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-1 text-[#161823]">
            <MessageSquare className="h-[20px] w-[20px] stroke-[1.5]" />
            <span className="text-[11px] font-medium">Chat</span>
          </button>
        </div>

        <div className="flex-1 flex gap-2 w-full">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={addState !== "idle"}
            className="flex-1 flex flex-col justify-center items-center h-[42px] bg-[#f1f1f2] text-[#161823] rounded-[4px] active:scale-[0.97] transition-all"
          >
            <span className="font-semibold text-[14px]">Adicionar ao carrinho</span>
          </button>

          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="flex-[1.2] bg-tiktok-gradient flex flex-col justify-center items-center text-white h-[42px] rounded-[4px] active:scale-[0.98] transition-all shadow-sm"
          >
            <span className="font-semibold text-[14px]">Comprar agora</span>
            <span className="text-[10px] font-medium opacity-90 -mt-0.5">Frete grátis</span>
          </button>
        </div>
      </div>
    </>
  );
}
