'use client';

import React from 'react';

interface KillSwitchProps {
  error: string;
  message?: string;
  status?: number;
}

export const KillSwitch: React.FC<KillSwitchProps> = ({ error, message, status }) => {
  const getErrorMessage = () => {
    switch (error) {
      case 'LICENSE_INVALID':
        return 'Chave de licença inválida ou domínio não autorizado.';
      case 'LICENSE_MISSING':
        return 'Chave de API (SCALE_SHOP_API_KEY) não encontrada.';
      case 'DOMAIN_NOT_AUTHORIZED':
        return 'O domínio desta loja não está autorizado no painel.';
      case 'LICENSE_SUSPENDED':
        return 'O acesso a esta loja foi suspenso pelo administrador.';
      case 'CONNECTION_ERROR':
        return 'Não foi possível conectar ao servidor de licenciamento.';
      default:
        return 'Erro de validação de segurança.';
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black p-6 text-center z-[9999]">
      <div className="max-w-md w-full p-8 rounded-[40px] border border-white/10 bg-zinc-900 shadow-2xl backdrop-blur-3xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-2xl">
          🚫
        </div>
        
        <h1 className="text-2xl font-black mb-2 text-white uppercase tracking-tighter italic">
          Acesso <span className="text-red-500">Restrito</span>
        </h1>
        
        <p className="text-zinc-400 text-sm mb-6">
          {getErrorMessage()}
        </p>

        {message && (
          <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-[10px] font-mono text-red-400 text-left mb-6 break-all max-h-32 overflow-auto">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-white text-black py-4 rounded-full font-bold hover:bg-zinc-200 transition-all active:scale-95"
          >
            Tentar Novamente
          </button>
          
          <a 
            href="https://scaleoficial.site/support" 
            className="text-zinc-500 text-xs hover:text-white transition-colors"
          >
            Contatar Suporte {status && `(Status: ${status})`}
          </a>
        </div>

        <p className="text-[9px] text-zinc-700 uppercase tracking-[0.2em] mt-8 font-medium">
          Scale Shop Security Framework &copy; 2025
        </p>
      </div>
    </div>
  );
};
