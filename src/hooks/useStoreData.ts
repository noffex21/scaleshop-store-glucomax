import { useState, useEffect } from 'react';
import { PRODUCT_DATA } from '@/config/productData';
import { supabase } from '@/lib/supabase';
import { INJECTED_API_URL, IS_HEADLESS } from '@/lib/config';

export function useStoreData() {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHeadless, setIsHeadless] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // BYPASS: Se os dados injetados pelo automador já forem reais (não placeholder), usamos eles imediatamente.
        // Isso remove a necessidade do ApiKeyGate para o cliente final.
        if ((PRODUCT_DATA as any).isPlaceholder === false) {
          console.log("[useStoreData] Injected data detected (Headless Mode). Bypassing fetch.");
          setStoreData(PRODUCT_DATA);
          setIsHeadless(true);
          setLoading(false);
          return;
        }

        // Busca a chave: 1. Build-time (env) | 2. LocalStorage (Unblocked)
        const apiKey = process.env.NEXT_PUBLIC_SCALE_SHOP_API_KEY || 
                       (typeof window !== 'undefined' && localStorage.getItem('scale_shop_api_key'));
        
        const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const isMainSaaS = typeof window !== 'undefined' && (window.location.port === '3000' || window.location.hostname.includes('scaleoficial.site'));
        
        // Em produção (Netlify), sempre usamos a API central para buscar os dados em modo headless
        // a menos que seja o domínio principal do SaaS.
        const isNetlify = typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');
        const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
        
        const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const querySubdomain = urlParams?.get("subdomain");

        // Só força Headless se tiver API Key OU se for um domínio de preview/clonado SEM parâmetro de subdomínio
        const shouldBeHeadless = !!apiKey || ((isNetlify || isVercel) && !querySubdomain);

        let apiUrl = INJECTED_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://scaleoficial.site";

        // MODO PROXY: Usamos caminhos relativos apenas se estivermos em um ambiente que sabemos ter o proxy configurado (Netlify)
        // No Vercel, usaremos a URL absoluta por padrão para evitar 404 em lojas que ainda não foram redeployadas com vercel.json.
        const canUseProxy = typeof window !== 'undefined' && window.location.hostname.includes('netlify.app');

        if (IS_HEADLESS && canUseProxy && !isLocal) {
          apiUrl = ""; 
        }

        if (shouldBeHeadless && (apiKey || !querySubdomain)) {
          setIsHeadless(true);
          
          if (!apiKey) {
            setLoading(false);
            return; // Aguarda o ApiKeyGate no page.tsx
          }

          console.log("[Headless] Attempting to fetch store data with API Key...");
          
          const response = await fetch(`${apiUrl}/api/v1/store-data/`, {
            method: 'GET',
            headers: {
              "X-Scale-Shop-Api-Key": apiKey,
              "Accept": "application/json"
            },
            mode: 'cors'
          });

          if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401 || response.status === 403) {
                // Chave inválida ou faltando
                throw new Error("LICENSE_INVALID");
            }
            throw new Error(errorData.error || "Failed to fetch store data");
          }

          const result = await response.json();
          const finalData = { ...PRODUCT_DATA, ...result.data };
          
          // Gerar categorias dinâmicas se não existirem ou se solicitado
          if (finalData.storeProducts) {
            const categoriesMap = new Map();
            finalData.storeProducts.forEach((p: any) => {
              const catName = p.category || "Geral";
              if (!categoriesMap.has(catName)) {
                categoriesMap.set(catName, { 
                  id: catName.toLowerCase().replace(/\s+/g, '-'),
                  name: catName, 
                  count: 0,
                  image: p.image || p.carouselImages?.[0]
                });
              }
              categoriesMap.get(catName).count++;
            });
            
            // Se as categorias do DB estiverem vazias ou forem as do placeholder, usa as dinâmicas
            if (!finalData.categories || finalData.categories.length === 0 || finalData.isPlaceholder) {
              finalData.categories = Array.from(categoriesMap.values());
            }
          }

          setStoreData(finalData);
        } else {
          // MODO SAAS TRADICIONAL
          setIsHeadless(false);
          const currentHost = window.location.hostname;
          const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "scaleshop.click";
          
          let subdomain = querySubdomain || "";
          
          if (!subdomain && currentHost.endsWith(rootDomain)) {
            subdomain = currentHost.replace(`.${rootDomain}`, "").replace("www.", "");
          } else if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
            // Domínio customizado
            const { data, error: dbError } = await supabase
              .from("stores")
              .select("data, subdomain")
              .eq("custom_domain", currentHost)
              .maybeSingle();

            if (!dbError && data) {
              const finalData = { 
                ...PRODUCT_DATA, 
                ...data.data,
                subdomain: data.subdomain || subdomain
              };
              
              // Categorias dinâmicas
              if (finalData.storeProducts) {
                const categoriesMap = new Map();
                finalData.storeProducts.forEach((p: any) => {
                  const catName = p.category || "Geral";
                  if (!categoriesMap.has(catName)) {
                    categoriesMap.set(catName, { 
                      id: catName.toLowerCase().replace(/\s+/g, '-'),
                      name: catName, 
                      count: 0,
                      image: p.image || p.carouselImages?.[0]
                    });
                  }
                  categoriesMap.get(catName).count++;
                });
                if (!finalData.categories || finalData.categories.length === 0) {
                  finalData.categories = Array.from(categoriesMap.values());
                }
              }

              setStoreData(finalData);
              return;
            }
          }

          if (subdomain && subdomain !== rootDomain) {
            const { data, error: dbError } = await supabase
              .from("stores")
              .select("data, subdomain")
              .eq("subdomain", subdomain)
              .maybeSingle();

            if (!dbError && data) {
              const finalData = { 
                ...PRODUCT_DATA, 
                ...data.data,
                subdomain: subdomain
              };

              // Categorias dinâmicas
              if (finalData.storeProducts) {
                const categoriesMap = new Map();
                finalData.storeProducts.forEach((p: any) => {
                  const catName = p.category || "Geral";
                  if (!categoriesMap.has(catName)) {
                    categoriesMap.set(catName, { 
                      id: catName.toLowerCase().replace(/\s+/g, '-'),
                      name: catName, 
                      count: 0,
                      image: p.image || p.carouselImages?.[0]
                    });
                  }
                  categoriesMap.get(catName).count++;
                });
                if (!finalData.categories || finalData.categories.length === 0) {
                  finalData.categories = Array.from(categoriesMap.values());
                }
              }

              setStoreData(finalData);
              return;
            }
          }

          // Fallback: Dados locais
          setStoreData(PRODUCT_DATA);
        }
      } catch (err: any) {
        console.error("[useStoreData] Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { storeData, loading, error, isHeadless };
}
