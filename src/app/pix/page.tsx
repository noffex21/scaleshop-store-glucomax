"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStoreData } from "@/hooks/useStoreData";
import { PixClient } from "@/components/checkout/PixClient";
import { TikTokLoader } from "@/components/ui/tiktok-loader";

const DEFAULT_PIX_CODE = "00020101021226870014br.gov.bcb.pix013669b0a32e-027d-f54d-510eabd7520400005303986540535.995802BR5925CHEF%20GOLD%20OFICIAL6009SAO%20PAULO62070503***6304D1B2";

function PixContent() {
  const searchParams = useSearchParams();
  const kitId = searchParams.get("kit") || "1";
  const subdomain = searchParams.get("subdomain") || null;
  const urlCode = searchParams.get("code") || null;
  const transactionId = searchParams.get("id") || null;
  const amount = searchParams.get("amount") || null;

  const { storeData, loading } = useStoreData();

  if (loading || !storeData) {
    return <TikTokLoader fullScreen />;
  }

  const pixCode = urlCode || DEFAULT_PIX_CODE;

  return (
    <PixClient 
      storeData={storeData}
      kitId={kitId}
      subdomain={subdomain || storeData.subdomain || null}
      pixCode={pixCode}
      transactionId={transactionId}
      amount={amount}
    />
  );
}

export default function PixPage() {
  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={<TikTokLoader fullScreen />}>
        <PixContent />
      </Suspense>
    </div>
  );
}
