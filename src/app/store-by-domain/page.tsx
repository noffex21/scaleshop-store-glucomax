/**
 * /store-by-domain/page.tsx
 *
 * This page is rendered when an external custom domain hits the SaaS server.
 * The middleware rewrites *.customdomain.com → /store-by-domain
 * We read the Host header to look up which store has that custom_domain.
 */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PRODUCT_DATA } from "@/config/productData";
import { StoreLandingLayout } from "@/components/layouts/StoreLandingLayout";
import { StoreFullLayout } from "@/components/layouts/StoreFullLayout";
import { supabase } from "@/lib/supabase";

export default function StoreByDomainPage() {
  const router = useRouter();
  const [storeData, setStoreData] = useState<any>(null);
  const [storeSubdomain, setStoreSubdomain] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [selectedKit, setSelectedKit] = useState<number>(1);
  const [modalAction, setModalAction] = useState<"cart" | "buy" | "select" | null>(null);
  const [runCartAnimation, setRunCartAnimation] = useState(0);

  useEffect(() => {
    const fetchStore = async () => {
      // The current host is the custom domain (e.g. meuproduto.com.br)
      const currentHost = window.location.hostname;

      const { data, error } = await supabase
        .from("stores")
        .select("data, subdomain")
        .eq("custom_domain", currentHost)
        .single();

      if (!error && data) {
        setStoreData({ ...PRODUCT_DATA, ...data.data });
        setStoreSubdomain(data.subdomain);

        // Track Visit
        supabase
          .from("visits")
          .insert([{ store_id: (data as any).id, subdomain: data.subdomain }])
          .then(({ error: vError }: any) => {
            if (vError) console.error("Error tracking visit:", vError);
          });
      } else {
        setStoreData(null);
      }
      setLoading(false);
    };
    fetchStore();
  }, []);

  const handleConfirmAction = () => {
    const query = `kit=${selectedKit}&subdomain=${storeSubdomain}`;
    
    if (modalAction === "buy") {
      router.push(`/checkout?${query}`);
    } else if (modalAction === "cart") {
      setRunCartAnimation(prev => prev + 1);
      setTimeout(() => {
        router.push(`/checkout?${query}`);
      }, 600);
    }
    setModalAction(null);
  };


  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#ff0050] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!storeData) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">Loja não encontrada</h1>
      <p className="text-gray-500">
        Este domínio não está associado a nenhuma loja ativa.<br />
        Se você é o proprietário, acesse o painel e configure seu domínio personalizado.
      </p>
    </div>
  );

  const handleProductClick = (product: any) => {
    router.push(`/p/${encodeURIComponent(product.id)}?subdomain=${storeSubdomain}`);
  };

  const handleBuyNowFromStore = (product: any) => {
    router.push(`/p/${encodeURIComponent(product.id)}?subdomain=${storeSubdomain}`);
  };

  return (
    <StoreFullLayout 
      data={storeData} 
      onProductClick={handleProductClick} 
      onBuyNow={handleBuyNowFromStore}
    />
  );
}
