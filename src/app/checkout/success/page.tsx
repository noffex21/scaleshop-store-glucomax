"use client";

import { CheckCircle2, ChevronRight, Home, Package } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { PRODUCT_DATA } from "@/config/productData";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kitId = searchParams.get("kit") || "1";
  const [orderNumber, setOrderNumber] = useState("");
  const [storeData, setStoreData] = useState<any>(PRODUCT_DATA);
  const subdomain = searchParams.get("subdomain");

  useEffect(() => {
    const fetchStore = async () => {
      // Se o supabase não estiver inicializado ou não houver URL, usa os dados locais (injetados)
      if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
      
      try {
        let query = supabase.from("stores").select("data");
        
        if (subdomain) {
          query = query.eq("subdomain", subdomain);
        } else if (typeof window !== 'undefined') {
          const currentHost = window.location.hostname;
          query = query.eq("custom_domain", currentHost);
        }

        const { data, error } = await query.single();
        if (!error && data) {
          setStoreData({ ...PRODUCT_DATA, ...data.data });
        }
      } catch (err) {
        console.warn("Supabase fetch skip:", err);
      }
    };
    fetchStore();
  }, [subdomain]);

  // Use storeData instead of PRODUCT_DATA directly
  const kitData = (storeData.kits as any)[kitId] || Object.values(storeData.kits)[0];
  const currentPrice = kitData?.price || 97.90;
  const formattedPrice = currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    // Generate a random order number
    const random = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(`TTK-${random}`);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f8] font-sans max-w-[480px] mx-auto overflow-x-hidden relative">
      <div className="flex-1 flex flex-col items-center px-6 pt-16 pb-32">
        {/* Animated Checkmark */}
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-green-500/10 mb-8 animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-[#00c9a7] rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white stroke-[2.5]" />
           </div>
        </div>

        <h1 className="text-[28px] font-extrabold text-[#161823] mb-2 tracking-tight text-center">
          Pagamento confirmado!
        </h1>
        <p className="text-[15px] text-gray-500 text-center leading-[1.6] mb-10 max-w-[320px]">
          Seu pedido <span className="font-bold text-[#161823]">{orderNumber}</span> foi recebido e já está em processamento.
        </p>

        {/* Order Card */}
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30_rgb(0,0,0,0.03)] p-6 mb-6 border border-gray-50">
           <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                   <img src={storeData.carouselImages?.[0] || (storeData.kits as Record<string, any>)[kitId]?.image || storeData.kits["1"]?.image} alt="Produto" className="w-full h-full object-cover" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#161823] line-clamp-1">{storeData.name}</span>
                  <span className="text-[12px] text-gray-400 mt-0.5">{(storeData.kits as Record<string, any>)[kitId]?.name || storeData.kits["1"]?.name}</span>
               </div>
           </div>

           <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
              <div className="flex justify-between items-center text-[14px]">
                 <span className="text-gray-500">Valor pago</span>
                 <span className="text-[#161823] font-bold">R$ {formattedPrice}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                 <span className="text-gray-500">Forma de pagamento</span>
                 <span className="text-[#161823] font-bold uppercase tracking-tight">PIX</span>
              </div>
           </div>
        </div>

        {/* Shipping Status Simulation */}
        <div className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 mb-10 border border-gray-50 flex items-center gap-4">
           <div className="w-10 h-10 bg-[#fe2c55]/5 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-[#fe2c55]" />
           </div>
           <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#161823]">Aguardando envio</span>
              <span className="text-[12px] text-gray-400">Estimativa de entrega: 3-5 dias úteis</span>
           </div>
        </div>

        {/* Footer Text */}
        <p className="text-[13px] text-gray-400 text-center leading-relaxed">
           Você receberá atualizações do rastreio no seu <br/>e-mail cadastrado em breve.
        </p>
      </div>

      {/* Sticky Bottom Buttons */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-50 px-5 pt-3 pb-8 z-[100] flex flex-col gap-3">
        <button 
          onClick={() => router.push(subdomain ? `/loja?subdomain=${subdomain}` : '/')}
          className="w-full bg-[#fe2c55] text-white py-4 rounded-[4px] font-bold text-[16px] transition-all active:scale-[0.98] shadow-lg shadow-[#fe2c55]/10"
        >
          Continuar comprando
        </button>
        <button 
          onClick={() => router.push(subdomain ? `/loja?subdomain=${subdomain}` : '/')}
          className="w-full bg-[#f1f1f2] text-[#161823] py-3.5 rounded-[4px] font-bold text-[15px] transition-all active:scale-[0.98]"
        >
          Ver detalhes do pedido
        </button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f8f8] max-w-[480px] mx-auto" />}>
      <SuccessContent />
    </Suspense>
  );
}
