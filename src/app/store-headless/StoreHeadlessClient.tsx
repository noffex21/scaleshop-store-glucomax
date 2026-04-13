"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreLandingLayout } from "@/components/layouts/StoreLandingLayout";
import { StoreFullLayout } from "@/components/layouts/StoreFullLayout";

export function StoreHeadlessClient({ data }: { data: any }) {
  const [selectedKit, setSelectedKit] = useState<number>(1);
  const [modalAction, setModalAction] = useState<"cart" | "buy" | "select" | null>(null);
  const [runCartAnimation, setRunCartAnimation] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  const handleConfirmAction = () => {
    const query = `kit=${selectedKit}&headless=true`;
    
    if (modalAction === "buy") {
      router.push(`/checkout?${query}`);
    } else if (modalAction === "cart") {
      // Animação e incremento do contador, sem redirecionar
      setRunCartAnimation(prev => prev + 1);
      setCartCount(prev => prev + 1);
    }
    setModalAction(null);
  };

  const handleCartClick = () => {
    const query = `kit=${selectedKit}&headless=true`;
    router.push(`/checkout?${query}`);
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
      title: `${data?.productName} | TikTok Shop 🎵`,
      text: `🔥 Olha o que eu encontrei na TikTok Shop: ${data?.productName}! Tá com um desconto absurdo e frete grátis hoje. 😱 Dá uma olhada antes que acabe!\n\n`,
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

  const handleProductClick = (product: any) => {
    router.push(`/p/${encodeURIComponent(product.id)}?headless=true`);
  };

  const handleBuyNowFromStore = (product: any) => {
    router.push(`/p/${encodeURIComponent(product.id)}?headless=true`);
  };

  return (
    <StoreFullLayout 
      data={data} 
      onProductClick={handleProductClick} 
      onBuyNow={handleBuyNowFromStore}
    />
  );
}
