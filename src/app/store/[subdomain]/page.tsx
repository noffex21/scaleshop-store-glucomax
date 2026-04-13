"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PRODUCT_DATA } from "@/config/productData";
import { use } from "react";
import { StoreLandingLayout } from "@/components/layouts/StoreLandingLayout";
import { StoreFullLayout } from "@/components/layouts/StoreFullLayout";

export default function StoreSubdomainPage({ params }: { params: Promise<{ subdomain: string }> }) {
  const resolvedParams = use(params);
  const subdomain = resolvedParams.subdomain;
  const router = useRouter();
  
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKit, setSelectedKit] = useState<number>(1);
  const [modalAction, setModalAction] = useState<"cart" | "buy" | "select" | null>(null);
  const [runCartAnimation, setRunCartAnimation] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchStore = async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("data")
        .eq("subdomain", subdomain)
        .maybeSingle();

      if (!error && data) {
        // Merge with full PRODUCT_DATA structure to ensure all keys exist
        setStoreData({ ...PRODUCT_DATA, ...data.data });
        
        // Track Visit
        const { data: storeInfo } = await supabase.from('stores').select('id').eq('subdomain', subdomain).maybeSingle();
        if (storeInfo) {
          supabase.from('visits').insert([{ store_id: storeInfo.id, subdomain: subdomain }]).then();
        }
      } else {
        // Fallback or 404
        setStoreData(null);
      }
      setLoading(false);
    };

    fetchStore();
  }, [subdomain]);

  const handleConfirmAction = () => {
    if (modalAction === "buy") {
      router.push(`/checkout?kit=${selectedKit}&subdomain=${subdomain}`);
    } else if (modalAction === "cart") {
      setRunCartAnimation(prev => prev + 1);
      setCartCount(prev => prev + 1);
    }
    setModalAction(null);
  };

  const handleCartClick = () => {
    router.push(`/checkout?kit=${selectedKit}&subdomain=${subdomain}`);
  };

  const handleBuyNow = () => {
    if (cartCount > 0) {
      handleCartClick();
    } else {
      setModalAction("buy");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${storeData?.productName} | TikTok Shop 🎵`,
      text: `🔥 Olha o que eu encontrei na TikTok Shop: ${storeData?.productName}! Tá com um desconto absurdo e frete grátis hoje. 😱 Dá uma olhada antes que acabe!\n\n`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n🔗 ${shareData.url}`);
        alert("Link de oferta copiado! Envie para seus amigos. 🚀");
      }
    } catch (err) {
      console.log("Erro ao compartilhar", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#ff0050] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!storeData) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">Loja não encontrada</h1>
      <p className="text-gray-500">O endereço que você tentou acessar não está vinculado a nenhuma loja ativa.</p>
    </div>
  );

  const handleProductClick = (product: any) => {
    router.push(`/p/${encodeURIComponent(product.id)}?subdomain=${subdomain}`);
  };

  const handleBuyNowFromStore = (product: any) => {
    // Para simplificar, leva ao checkout do produto ou para a página dele
    router.push(`/p/${encodeURIComponent(product.id)}?subdomain=${subdomain}`);
  };

  return (
    <StoreFullLayout 
      data={storeData} 
      onProductClick={handleProductClick} 
      onBuyNow={handleBuyNowFromStore}
    />
  );
}
