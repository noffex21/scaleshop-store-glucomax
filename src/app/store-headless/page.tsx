import { getStoreData } from "@/lib/headless-api";
import { StoreHeadlessClient } from "./StoreHeadlessClient";
import { KillSwitch } from "@/components/security/KillSwitch";

export const metadata = {
  title: 'Carregando Loja...',
  description: 'Aguarde enquanto configuramos sua experiência.',
};

export default async function HeadlessStorePage() {
  const { data, error, status } = await getStoreData();
  
  if (error || !data) {
    console.error('[HeadlessPage] Erro ao carregar dados:', error, status);
    
    // Tratamento estrito de licenciamento
    const errorType = (error === 'LICENSE_INVALID' || error === 'LICENSE_MISSING') 
      ? error 
      : 'API_ERROR';

    return <KillSwitch error={errorType as any} />;
  }

  // Se a API retornar sucesso, renderizamos a loja normalmente
  return <StoreHeadlessClient data={data} />;
}
