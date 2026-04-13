"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStoreData } from "@/hooks/useStoreData";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { TikTokLoader } from "@/components/ui/tiktok-loader";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { INJECTED_API_URL } from "@/lib/config";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const kitParam = searchParams.get("kit");
  const subdomainParam = searchParams.get("subdomain") || null;
  
  const { storeData, loading, error, isHeadless } = useStoreData();
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
    return <ApiKeyGate onKeyValidated={handleKeyValidated} apiUrl={apiUrl} />;
  }

  if (error === "LICENSE_INVALID") {
    if (typeof window !== "undefined") localStorage.removeItem("scale_shop_api_key");
    return <ApiKeyGate onKeyValidated={handleKeyValidated} apiUrl={apiUrl} />;
  }

  if (!storeData) return null;

  // Find the correct product if coming from a specific product page
  const productId = searchParams.get("product");
  const product = productId 
    ? storeData.storeProducts?.find((p: any) => p.id == productId) 
    : null;

  // Merge product data into store data if we have a specific product
  const finalData = product 
    ? { ...storeData, ...product, productName: product.name }
    : storeData;

  return (
    <CheckoutClient 
      storeData={finalData} 
      subdomain={subdomainParam || storeData.subdomain || null} 
      kitParam={kitParam} 
    />
  );
}

export default function CheckoutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<TikTokLoader fullScreen />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
