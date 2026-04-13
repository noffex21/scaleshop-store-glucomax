"use client";

import { useState, useEffect } from "react";
import { Zap, Key, Eye, EyeOff, Loader2, AlertCircle, Database, ChevronDown, ChevronUp, Save } from "lucide-react";

interface ApiKeyGateProps {
  onKeyValidated: (key: string) => void;
  apiUrl: string;
}

export function ApiKeyGate({ onKeyValidated, apiUrl }: ApiKeyGateProps) {
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Opções Avançadas (Supabase Keys)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customAnonKey, setCustomAnonKey] = useState("");
  const [customServiceKey, setCustomServiceKey] = useState("");

  useEffect(() => {
    // Carregar configurações salvas
    setCustomUrl(localStorage.getItem("scale_custom_supabase_url") || "");
    setCustomAnonKey(localStorage.getItem("scale_custom_supabase_key") || "");
    setCustomServiceKey(localStorage.getItem("scale_custom_supabase_service_key") || "");
  }, []);

  const saveAdvanced = () => {
    localStorage.setItem("scale_custom_supabase_url", customUrl.trim());
    localStorage.setItem("scale_custom_supabase_key", customAnonKey.trim());
    localStorage.setItem("scale_custom_supabase_service_key", customServiceKey.trim());
    alert("Configurações de banco salvas localmente!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/api/v1/store-data`, {
        method: "GET",
        headers: {
          "X-Scale-Shop-Api-Key": key.trim(),
          Accept: "application/json",
        },
        mode: "cors",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 404) {
           throw new Error(`Servidor de validação não encontrado em: ${apiUrl}. Verifique a configuração da loja.`);
        }
        throw new Error(
          data.error || "Chave inválida. Verifique e tente novamente."
        );
      }

      if (!data.success) {
         throw new Error(data.error || "Erro na validação.");
      }

      // Key is valid — persist in localStorage and notify parent
      localStorage.setItem("scale_shop_api_key", key.trim());
      onKeyValidated(key.trim());
    } catch (err: any) {
      console.error("[ApiKeyGate] Fetch error:", err);
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#fe2c55]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fe2c55]/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fe2c55]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#fe2c55] to-[#ee1d52] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#fe2c55]/30 mb-5">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <span className="text-xl font-black text-white uppercase italic tracking-tighter">
            Scale<span className="text-[#fe2c55]">Shop</span>
          </span>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mt-1">
            Powered by ScaleShop Elite
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Icon + Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#fe2c55]/10 rounded-xl flex items-center justify-center border border-[#fe2c55]/20">
              <Key className="w-5 h-5 text-[#fe2c55]" />
            </div>
            <div>
              <h1 className="text-[15px] font-black text-white leading-tight">
                Acesso à Loja
              </h1>
              <p className="text-[11px] text-white/40 font-medium">
                Insira sua chave de API
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Key input */}
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setError("");
                }}
                placeholder="sk_xxxxxxxxxxxxxxxx"
                autoComplete="off"
                spellCheck={false}
                className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 pr-12 text-[13px] font-mono text-white placeholder-white/20 outline-none transition-all ${
                  error
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/10 focus:border-[#fe2c55]/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="text-[11px] font-bold text-red-400">
                  {error}
                </span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="w-full h-12 bg-[#fe2c55] hover:bg-[#ee1d52] disabled:bg-[#fe2c55]/40 disabled:cursor-not-allowed text-white font-black text-[12px] uppercase tracking-[0.15em] rounded-2xl transition-all hover:shadow-lg hover:shadow-[#fe2c55]/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-white" />
                  Acessar Loja
                </>
              )}
            </button>
          </form>

          {/* Advanced Section */}
          <div className="mt-6 pt-6 border-t border-white/5">
                <button 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-[10px] font-bold text-white/20 hover:text-white/40 tracking-widest uppercase transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    Configuração de Banco
                  </div>
                  {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/30 uppercase ml-1">Supabase URL</label>
                        <input 
                          type="text" 
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          placeholder="https://xxx.supabase.co"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white outline-none focus:border-white/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/30 uppercase ml-1">Anon Key</label>
                        <input 
                          type="password" 
                          value={customAnonKey}
                          onChange={(e) => setCustomAnonKey(e.target.value)}
                          placeholder="eyJ..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white outline-none focus:border-white/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-white/30 uppercase ml-1">Service Role (Admin)</label>
                        <input 
                          type="password" 
                          value={customServiceKey}
                          onChange={(e) => setCustomServiceKey(e.target.value)}
                          placeholder="eyJ..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white outline-none focus:border-white/20"
                        />
                      </div>
                      <button 
                         onClick={saveAdvanced}
                         className="w-full h-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-bold text-white uppercase flex items-center justify-center gap-2 transition-all mt-2"
                      >
                         <Save className="w-3 h-3" />
                         Salvar Banco
                      </button>
                  </div>
                )}
          </div>

          {/* Footer hint */}
          <p className="text-center text-[10px] text-white/20 font-medium mt-5 leading-relaxed">
            Sua chave está disponível no painel ScaleShop
            <br />
            em{" "}
            <span className="text-white/40 font-bold">
              Configurações → API Key
            </span>
          </p>
        </div>


        {/* Bottom branding */}
        <p className="text-center text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] mt-6">
          © 2025 ScaleShop Enterprise
        </p>
      </div>
    </div>
  );
}
