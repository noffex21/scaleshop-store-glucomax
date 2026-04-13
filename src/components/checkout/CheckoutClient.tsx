"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useRef } from "react";
import { useFlashSaleTimer } from "@/hooks/useFlashSaleTimer";
import { CheckoutLayout } from "@/components/layouts/CheckoutLayout";
import { TikTokLoader } from "@/components/ui/tiktok-loader";
import { useCart } from "@/contexts/CartContext";

import { INJECTED_API_URL, INJECTED_STORE_ID, INJECTED_SUBDOMAIN, IS_HEADLESS } from "@/lib/config";

interface Address {
   fullName: string;
   phone: string;
   email: string;
   cep: string;
   addressLine: string;
   number: string;
   complement: string;
   neighborhood: string;
   city: string;
   state: string;
   isDefault: boolean;
}

interface CheckoutClientProps {
  storeData: any;
  subdomain: string | null;
  kitParam: string | null;
}

export function CheckoutClient({ storeData, subdomain, kitParam }: CheckoutClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cart, total, updateQuantity } = useCart();
    
    // Capturar dados do Produto e Variações da URL
    const urlProductId = searchParams.get("p");
    const urlColor = searchParams.get("color");
    const urlSize = searchParams.get("size");

    const productData = useMemo(() => {
       if (!urlProductId || !storeData?.storeProducts) return storeData;
       return storeData.storeProducts.find((p: any) => String(p.id) === String(urlProductId)) || storeData;
    }, [urlProductId, storeData]);
    
    // Lógica de Kit e Dados (Baseada no produto real resolvido)
    const selectedKit = kitParam ? parseInt(kitParam, 10) as 1 | 2 | 3 : 1;
    const kitIdStr = selectedKit.toString();
    const kitData = productData?.kits?.[kitIdStr] || (productData?.kits ? Object.values(productData.kits)[0] : null);
    const isDirectKitLink = !!kitParam;

    const { currentPrice, originalPrice, discountAmount, savingAmount, formattedPrice } = useMemo(() => {
      const cPrice = cart.length > 0 ? total : (isDirectKitLink && kitData ? (kitData.price || 0) : 0);
      const oPrice = cart.length > 0 
          ? cart.reduce((acc, item) => acc + (item.originalPrice || (item.price * 1.5)) * (item.quantity || 1), 0)
          : (isDirectKitLink && kitData ? (kitData.originalPrice || ((kitData?.price || 0) * 2.5)) : 0);
      
      const dAmount = oPrice > 0 ? oPrice - cPrice : 0;
      const sAmount = dAmount > 0 ? dAmount + 14.50 : 0; 
      const fPrice = cPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      return {
        currentPrice: cPrice,
        originalPrice: oPrice,
        discountAmount: dAmount,
        savingAmount: sAmount,
        formattedPrice: fPrice
      };
    }, [cart, total, kitData, isDirectKitLink]);

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showAddressList, setShowAddressList] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [address, setAddress] = useState<Address>({
       fullName: "",
       phone: "",
       email: "",
       cep: "",
       addressLine: "",
       number: "",
       complement: "",
       neighborhood: "",
       city: "",
       state: "",
       isDefault: false
    });

    const timeLeft = useFlashSaleTimer();

    // Auto-add from URL if cart is empty on mount (Direct link / Ads)
    const { addToCart } = useCart();
    
    useEffect(() => {
      // Chave única para este produto/kit/cor/tamanho para evitar re-adições
      const pId = urlProductId || productData?.id || "default";
      const autoAddKey = `hasAutoAdded_${pId}_${kitIdStr}_${urlColor || 'no'}_${urlSize || 'no'}`;
      const sessionFlag = sessionStorage.getItem(autoAddKey);
      const hasRealProduct = !!urlProductId || (storeData && !storeData.storeProducts);

      if (isClient && cart.length === 0 && isDirectKitLink && kitData && !sessionFlag && hasRealProduct) {
         // Determinar cor e tamanho da URL
         const color = urlColor || undefined;
         const size = urlSize || undefined;
         
         addToCart(productData, kitIdStr, { color, size });
         sessionStorage.setItem(autoAddKey, "true");
      }
    }, [isClient, cart.length, isDirectKitLink, kitData, addToCart, productData, kitIdStr, urlColor, urlSize, urlProductId, storeData]);

    useEffect(() => {
       setIsClient(true);
       const savedAddress = localStorage.getItem("tiktokCloneAddress");
       if (savedAddress) {
          try {
             const parsed = JSON.parse(savedAddress);
             if (parsed && typeof parsed === 'object') {
                setAddress(prev => ({ ...prev, ...parsed }));
             }
          } catch (e) {
             console.error("Error parsing saved address", e);
          }
       }
    }, []);

    // Salva o endereço sempre que mudar, mas apenas após montado
    useEffect(() => {
       if (isClient) {
          localStorage.setItem("tiktokCloneAddress", JSON.stringify(address));
       }
    }, [address, isClient]);

    const isAddressValid =
       address &&
       (address.fullName?.length || 0) > 2 &&
       (address.phone?.length || 0) > 10 &&
       (address.cep?.length || 0) === 9 &&
       (address.addressLine?.length || 0) > 2 &&
       (address.number?.length || 0) > 0 &&
       (address.email?.length || 0) > 5;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       let value = e.target.value.replace(/\D/g, '');
       if (value.length > 11) value = value.slice(0, 11);

       if (value.length > 2) {
          value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
       }
       if (value.length > 9) {
          value = `${value.slice(0, 10)}-${value.slice(10)}`;
       }
       setAddress(prev => ({ ...prev, phone: value }));
    };

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
       let value = e.target.value.replace(/\D/g, '');
       if (value.length > 8) value = value.slice(0, 8);

       if (value.length > 5) {
          value = `${value.slice(0, 5)}-${value.slice(5)}`;
       }

       setAddress(prev => ({ ...prev, cep: value }));

       if (value.replace(/\D/g, '').length === 8) {
          try {
             const response = await fetch(`https://viacep.com.br/ws/${value.replace(/\D/g, '')}/json/`);
             const data = await response.json();
             if (!data.erro) {
                setAddress(prev => ({
                   ...prev,
                   addressLine: data.logradouro || prev.addressLine,
                   neighborhood: data.bairro || prev.neighborhood,
                   city: data.localidade || prev.city,
                   state: data.uf || prev.state
                }));
             }
          } catch (error) {
             console.error("Erro ao buscar CEP", error);
          }
       }
    };

    const handlePlaceOrder = async () => {
       if (!isAddressValid) {
          setShowAddressForm(true);
          return;
       }

        setIsLoading(true);
         try {
            const isNetlify = typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');
            let apiUrl = INJECTED_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://scaleoficial.site";
            
            if (IS_HEADLESS && isNetlify && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
              apiUrl = "";
            }

            const currentSubdomain = INJECTED_SUBDOMAIN || subdomain;

          const response = await fetch(`${apiUrl}/api/pix/`, {
             method: 'POST',
             headers: { 
                'Content-Type': 'application/json',
                'X-Scale-Shop-Api-Key': INJECTED_STORE_ID || ''
             },
             body: JSON.stringify({
                amount: currentPrice,
                kitId: selectedKit,
                subdomain: currentSubdomain,
                variation: {
                   color: urlColor,
                   size: urlSize
                },
                customer: {
                   name: address.fullName,
                   email: address.email,
                   phone: address.phone
                }
             })
          });

          const data = await response.json();

          if (response.ok && data.pix_code) {
             const subParam = currentSubdomain ? `&subdomain=${currentSubdomain}` : '';
             router.push(`/pix?kit=${selectedKit}&code=${encodeURIComponent(data.pix_code)}&id=${data.transaction_id}&amount=${currentPrice}${subParam}`);
             // Do not set isLoading(false) here so the loader stays visible until Next.js destroys the page
          } else {
             alert(data.error || "Erro ao gerar PIX. Verifique os dados.");
             setIsLoading(false);
          }
       } catch (error) {
          alert("Erro de conexão com o servidor.");
          setIsLoading(false);
       }
    };

    const maskPhone = (phone: string) => {
       if (!phone) return "";
       const cleaned = phone.replace(/\D/g, "");
       if (cleaned.length < 4) return phone;
       const ddd = cleaned.substring(0, 2);
       const last2 = cleaned.slice(-2);
       return `(+55)${ddd}*******${last2}`;
    };

     return (
        <>
          {isLoading && <TikTokLoader fullScreen />}
          <CheckoutLayout 
            storeData={storeData}
            kitData={kitData}
            selectedKit={selectedKit}
            cartItems={cart}
            cartTotal={total}
            timeLeft={timeLeft}
            formattedPrice={total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            originalPrice={originalPrice}
            discountAmount={discountAmount}
            savingAmount={savingAmount}
            isLoading={isLoading}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => {
              // Funil: Checkout → Produto → Loja
              if (urlProductId) {
                const path = subdomain 
                  ? `/p/${urlProductId}?subdomain=${subdomain}` 
                  : `/p/${urlProductId}`;
                router.push(path);
              } else {
                const path = subdomain ? `/loja?subdomain=${subdomain}` : `/loja`;
                router.push(path);
              }
            }}
            address={address}
            isAddressValid={isAddressValid}
             isClient={isClient}
             isDirectKitLink={isDirectKitLink}
             setShowAddressList={setShowAddressList}
            maskPhone={maskPhone}
            updateQuantity={updateQuantity}
            isPreview={false}
            // Overlay props
            showAddressList={showAddressList}
            showAddressForm={showAddressForm}
            setShowAddressForm={setShowAddressForm}
            setAddress={setAddress}
            handlePhoneChange={handlePhoneChange}
            handleCepChange={handleCepChange}
          />
        </>
     );
}
