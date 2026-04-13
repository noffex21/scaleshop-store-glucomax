"use client";

import { ChevronLeft, Clock, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MobileWrapper } from "@/components/MobileWrapper";
import { INJECTED_API_URL, IS_HEADLESS } from "@/lib/config";

interface PixClientProps {
  storeData: any;
  kitId: string;
  subdomain: string | null;
  pixCode: string;
  transactionId: string | null;
  amount?: string | null;
}

export function PixClient({ storeData, kitId, subdomain, pixCode, transactionId, amount }: PixClientProps) {
  const router = useRouter();
  const kitData = (storeData.kits as any)[kitId] || Object.values(storeData.kits)[0];
  const currentPrice = amount ? parseFloat(amount) : kitData.price;
  const formattedPrice = currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); 
  const [copied, setCopied] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!transactionId || isPaid) return;

    const pollInterval = setInterval(async () => {
      try {
        const isNetlify = typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');
        let apiUrl = INJECTED_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://scaleoficial.site";
        
        if (IS_HEADLESS && isNetlify && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
          apiUrl = "";
        }

        const response = await fetch(`${apiUrl}/api/pix/?id=${transactionId}${subdomain ? `&subdomain=${subdomain}` : ''}`);
        const data = await response.json();
        
        if (data.isPaid) {
          setIsPaid(true);
          clearInterval(pollInterval);
          router.push(`/checkout/success?kit=${kitId}${subdomain ? `&subdomain=${subdomain}` : ''}`);
        }
      } catch (error) {
        console.error("Erro no polling de pagamento:", error);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [transactionId, isPaid, kitId, router, subdomain]);

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getExpiryDate = () => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const day = date.getDate();
    const month = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    const year = date.getFullYear();
    return `${time}, ${day} de ${month} ${year}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MobileWrapper>
      <div className="flex flex-col min-h-screen bg-white font-sans relative overflow-x-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#fe2c55]/10 blur-[80px] rounded-full z-0 opacity-80"></div>
        
        <div className="flex items-center px-4 py-4 relative z-10 border-b border-gray-50">
          <button onClick={() => {
            const path = subdomain ? `/checkout?subdomain=${subdomain}` : '/checkout';
            router.push(path);
          }} className="p-1 -ml-1 absolute left-4 z-20">
            <ChevronLeft className="w-6 h-6 text-[#161823]" />
          </button>
          <div className="w-full flex items-center justify-center">
            <span className="text-[13px] font-bold text-[#161823]">Código do pagamento</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col px-5 pt-6 pb-32 z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col">
              <h2 className="text-[22px] font-tiktok-black text-[#161823] leading-[1.1] tracking-tighter">
                Aguardando o pagamento
              </h2>
              <div className="text-[26px] font-tiktok-black text-[#161823] tracking-tighter">
                R$ {formattedPrice}
              </div>
            </div>
            <div className="w-[48px] h-[48px] bg-[#FF9501] rounded-full flex items-center justify-center shadow-lg shadow-[#FF9501]/20">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v8l5 4" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-8">
             <div className="flex items-center gap-2">
               <span className="text-[13px] text-gray-400 font-medium">Vence em</span>
               <div className="bg-[#F74D36] px-2 py-0.5 rounded-md flex items-center gap-1">
                 <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F74D36" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 6v6l4 3" />
                    </svg>
                 </div>
                 <span className="text-white text-[12px] font-bold tabular-nums">
                   {isMounted ? formatTimer(timeLeft) : "--:--:--"}
                 </span>
               </div>
             </div>
             <p className="text-[13px] text-gray-400 font-medium min-h-[1.25rem]">
               Prazo <span className="font-bold text-[#161823]">{isMounted ? getExpiryDate() : ""}</span>
             </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7 mb-10 border border-gray-50">
            <div className="flex items-center gap-2 mb-8">
               <div className="flex items-center gap-1">
                 <img src="/pix.png" alt="Pix" className="h-[14px]" />
                 <span className="text-[15px] font-bold text-[#161823] tracking-tighter">PIX</span>
               </div>
            </div>

            <div className="flex flex-col mb-8">
              <p className="text-[22px] font-bold text-[#161823] break-all line-clamp-2 leading-[1.2] tracking-tight">
                {pixCode}
              </p>
            </div>

            <button 
              onClick={handleCopy}
              className={`w-full py-[15px] rounded-[6px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${copied ? 'bg-green-500' : 'bg-[#fe2c55]'}`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-white stroke-[3]" />
                  <span className="text-white font-bold text-[16px]">Copiado!</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  <span className="text-white font-bold text-[16px]">Copiar</span>
                </>
              )}
            </button>
 
            <p className="mt-5 text-[13px] text-gray-500 font-medium leading-[1.6]">
              Para acessar esta página no app, abra <span className="font-bold text-gray-800">Loja &gt; Pedidos &gt; Sem pagamento &gt; Visualizar o código</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-[19px] font-extrabold text-[#161823] tracking-tight">Como fazer pagamentos com PIX?</h3>
            <p className="text-[14.5px] text-[#161823]/80 leading-relaxed font-medium">
              Copie o código de pagamento acima, selecione Pix no seu app de internet ou de banco e cole o código.
            </p>
            
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 px-5 pt-3 pb-8 z-[100] flex justify-center">
            <div className="w-full max-w-[480px]">
                <button className="w-full bg-[#f1f1f2] text-[#161823] py-4 rounded-[4px] font-bold text-[16px]">
                  Ver pedido
                </button>
            </div>
        </div>
      </div>
    </MobileWrapper>
  );
}
