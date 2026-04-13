/**
 * Helper para buscar dados da loja na API do Scale Shop.
 * Este arquivo deve ser usado principalmente no servidor (Server Components).
 */
export async function getStoreData() {
  const apiKey = process.env.NEXT_PUBLIC_SCALE_SHOP_API_KEY || process.env.SCALE_SHOP_API_KEY;
  
  // Em produção, apontamos para a API central. Em desenvolvimento, usamos localhost se não houver URL configurada.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://scaleoficial.site';

  if (!apiKey) {
    return { error: 'LICENSE_MISSING', status: 401 };
  }

  try {
    const res = await fetch(`${apiUrl}/api/v1/store-data`, {
      method: 'GET',
      headers: {
        'X-Scale-Shop-Api-Key': apiKey,
        // Em SSR, passamos o Host ou Origin para validação de domínio
        'X-Original-Host': process.env.NEXT_PUBLIC_APP_URL || '',
      },
      next: { 
        revalidate: 3600, 
        tags: ['store-data'] 
      },
      cache: 'no-store'
    });

    if (res.status === 401 || res.status === 403) {
      return { error: 'LICENSE_INVALID', status: res.status };
    }

    if (!res.ok) {
      return { error: 'API_ERROR', status: res.status };
    }

    const data = await res.json();
    return { data, status: 200 };
  } catch (error) {
    console.error('[HeadlessAPI] Erro ao buscar dados da loja:', error);
    return { error: 'CONNECTION_ERROR', status: 500 };
  }
}
