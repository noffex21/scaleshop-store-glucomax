"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStoreData } from "@/hooks/useStoreData";
import { StoreLandingLayout } from "@/components/layouts/StoreLandingLayout";
import { TikTokLoader } from "@/components/ui/tiktok-loader";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { storeData, loading, error, isHeadless } = useStoreData();
  const { cart, addToCart, cartCount: globalCartCount } = useCart();
  const router = useRouter();

  // States
  const [selectedKit, setSelectedKit] = useState<number>(1);
  const [modalAction, setModalAction] = useState<"cart" | "buy" | "select" | null>(null);
  const [runCartAnimation, setRunCartAnimation] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Constants & Data
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isMainSaaS = typeof window !== 'undefined' && window.location.port === '3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || (isMainSaaS ? "" : (isLocal ? "http://localhost:3000" : "https://scaleoficial.site"));

  const parsedId = Array.isArray(id) ? id[0] : id;
  const decodedId = parsedId ? decodeURIComponent(parsedId as string) : undefined;

  const product = storeData?.storeProducts?.find((p: any) => 
    String(p.id) === String(parsedId) || 
    String(p.id) === String(decodedId) ||
    String(p.id) === String(parsedId).replace(/\//g, '') ||
    String(p.id) === String(decodedId).replace(/\//g, '')
  ) || (storeData && !loading ? storeData : null);

  // Effects
  useEffect(() => {
    if (product) {
       if (product.enableColor && product.colors?.length > 0 && !selectedColor) {
          setSelectedColor(product.colors[0].name);
       }
       if (product.enableSize && product.sizes?.length > 0 && !selectedSize) {
          setSelectedSize(product.sizes[0]);
       }
    }
  }, [product, selectedColor, selectedSize]);

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

  if (!storeData || !product) return null;
  
  const getCheckoutUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const currentSubdomain = params.get("subdomain") || storeData.subdomain || '';
    let url = `/checkout?p=${product.id}&kit=${selectedKit}&subdomain=${currentSubdomain}`;
    if (selectedColor) url += `&color=${encodeURIComponent(selectedColor)}`;
    if (selectedSize) url += `&size=${encodeURIComponent(selectedSize)}`;
    return url;
  };

  const hasVariations = () => {
    if (!product) return false;
    const kitsCount = Object.keys(product.kits || {}).length;
    const hasColors = product.enableColor && product.colors?.length > 0;
    const hasSizes = product.enableSize && product.sizes?.length > 0;
    return kitsCount > 1 || hasColors || hasSizes;
  };

  const handleConfirmAction = (action: "cart" | "buy") => {
    const kitId = selectedKit.toString();
    const variation = {
       color: selectedColor || undefined,
       size: selectedSize || undefined
    };

    // Always ensure the item is in the cart, but only increment quantity for "Add to Cart" action
    addToCart(product, kitId, variation, { increment: action !== "buy" });
    
    if (action === "buy") {
      setIsNavigating(true);
      router.push(getCheckoutUrl());
    } else if (action === "cart") {
      setRunCartAnimation(prev => prev + 1);
    }
    setModalAction(null);
  };

  const handleConfirm = () => {
    if (modalAction) {
      handleConfirmAction(modalAction as "cart" | "buy");
    }
  };

  const handleAddToCart = () => {
    if (hasVariations()) {
      setModalAction("cart");
    } else {
      handleConfirmAction("cart");
    }
  };

  const handleBuyNow = () => {
    // Se já tiver itens no carrinho, vai direto para o checkout
    if (cart.length > 0) {
      setIsNavigating(true);
      router.push(getCheckoutUrl());
      return;
    }
    // Se não houver variações, adiciona e vai direto
    if (!hasVariations()) {
      handleConfirmAction("buy");
    } else {
      setModalAction("buy");
    }
  };

  const handleCartClick = () => {
    setIsNavigating(true);
    router.push(getCheckoutUrl());
  };

  const handleShare = async () => {
    const shareData = {
      title: `${product.name || storeData.productName} | TikTok Shop 🎵`,
      text: `🔥 Olha o que eu encontrei na TikTok Shop: ${product.name || storeData.productName}! Tá com um desconto absurdo e frete grátis hoje. 😱 Dá uma olhada antes que acabe!\n\n`,
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

  const handleBack = () => {
    setIsNavigating(true);
    const params = new URLSearchParams(window.location.search);
    const currentSubdomain = params.get("subdomain");
    router.push(currentSubdomain ? `/loja?subdomain=${currentSubdomain}` : "/loja");
  };

  const handleProductClick = (productObj: any) => {
    setIsNavigating(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    const params = new URLSearchParams(window.location.search);
    const currentSubdomain = params.get("subdomain");
    const encodedId = encodeURIComponent(productObj.id);
    const path = currentSubdomain 
      ? `/p/${encodedId}?subdomain=${currentSubdomain}`
      : `/p/${encodedId}`;
    router.push(path);
  };

  return (
    <>
      {isNavigating && <TikTokLoader fullScreen />}
      <StoreLandingLayout
        data={{ ...storeData, ...product, productName: product.name, storeSoldCount: storeData.soldCount, storeGlobalReviewCount: storeData.storeReviewCount }}
        selectedKit={selectedKit}
        setSelectedKit={setSelectedKit}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        modalAction={modalAction}
        setModalAction={setModalAction}
        onConfirmAction={handleConfirm}
        runCartAnimation={runCartAnimation}
        cartCount={globalCartCount}
        onAddToCart={handleAddToCart}
        onCartClick={handleCartClick}
        onBuyNowClick={handleBuyNow}
        onShareClick={handleShare}
        onBack={handleBack}
        onProductClick={handleProductClick}
      />
    </>
  );
}
