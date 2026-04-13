"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStoreData } from "@/hooks/useStoreData";
import { StoreFullLayout } from "@/components/layouts/StoreFullLayout";
import { TikTokLoader } from "@/components/ui/tiktok-loader";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { useCart } from "@/contexts/CartContext";

function LojaContent() {
  const { storeData, loading, error, isHeadless } = useStoreData();
  const { cartCount, addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [isNavigating, setIsNavigating] = useState(false);
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isMainSaaS = typeof window !== 'undefined' && window.location.port === '3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || (isMainSaaS ? "" : (isLocal ? "http://localhost:3000" : "https://scaleoficial.site"));

  useEffect(() => {
    const stored = localStorage.getItem("scale_shop_api_key");
    setSavedApiKey(stored);
    setGateChecked(true);
  }, []);

  const handleKeyValidated = (key: string) => {
    setSavedApiKey(key);
    window.location.reload();
  };

  if (!gateChecked || loading) {
    return <TikTokLoader fullScreen />;
  }

  const isDataInjected = storeData && !(storeData as any).isPlaceholder;

  if (isHeadless && !savedApiKey && !isDataInjected) {
    return (
      <ApiKeyGate
        onKeyValidated={handleKeyValidated}
        apiUrl={apiUrl}
      />
    );
  }

  if (error === "LICENSE_INVALID") {
    if (typeof window !== "undefined") localStorage.removeItem("scale_shop_api_key");
    return <ApiKeyGate onKeyValidated={handleKeyValidated} apiUrl={apiUrl} />;
  }

  if (!storeData) return null;

  const handleProductClick = (product: any) => {
    setIsNavigating(true);
    const params = new URLSearchParams(window.location.search);
    const currentSubdomain = params.get("subdomain");
    const encodedId = encodeURIComponent(product.id);
    const path = currentSubdomain 
      ? `/p/${encodedId}?subdomain=${currentSubdomain}`
      : `/p/${encodedId}`;
    router.push(path);
  };

  const handleBuyNow = (product: any) => {
    setIsNavigating(true);
    addToCart(product);
    const params = new URLSearchParams(window.location.search);
    const currentSubdomain = params.get("subdomain");
    const path = currentSubdomain 
      ? `/checkout?subdomain=${currentSubdomain}`
      : `/checkout`;
    router.push(path);
  };

  const handleCartClick = () => {
    setIsNavigating(true);
    const params = new URLSearchParams(window.location.search);
    const currentSubdomain = params.get("subdomain");
    const path = currentSubdomain ? `/checkout?subdomain=${currentSubdomain}` : `/checkout`;
    router.push(path);
  };

  return (
    <>
      {isNavigating && <TikTokLoader fullScreen />}
      <StoreFullLayout 
        data={storeData} 
        onProductClick={handleProductClick} 
        onBuyNow={handleBuyNow}
        onCartClick={handleCartClick}
        searchQuery={searchQuery}
      />
    </>
  );
}

export default function LojaPage() {
  return (
    <React.Suspense fallback={<TikTokLoader fullScreen />}>
      <LojaContent />
    </React.Suspense>
  );
}
