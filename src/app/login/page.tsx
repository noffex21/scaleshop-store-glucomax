"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Mail, Lock, ArrowRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { BackgroundPaths } from "@/components/ui/background-paths";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (email.toLowerCase() === "wendell.vidalrep@gmail.com") {
        router.push("/admin/supreme");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <BackgroundPaths title="Scale Shop">
      <div className="flex flex-col items-center justify-center p-6 font-sans relative">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="absolute top-2 left-2 p-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95 group z-50"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        
        <div className="max-w-[400px] w-full relative z-10 pt-12">
          <Link href="/" className="flex items-center justify-center gap-2 mb-12 group">
            <div className="w-12 h-12 bg-[#ff0050] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ff0050]/20 group-hover:scale-110 transition-transform duration-300">
              <Zap className="text-white w-7 h-7 fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Scale <span className="text-[#ff0050]">Shop</span></span>
          </Link>

          <div className="bg-white/[0.03] border border-white/10 rounded-[32px] p-8 backdrop-blur-xl shadow-2xl">
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Bem-vindo de volta.</h1>
            <p className="text-white/50 text-sm font-medium mb-8">Insira suas credenciais para acessar sua conta.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-white/40 uppercase tracking-widest mb-2 ml-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 text-[15px] font-medium focus:outline-none focus:border-[#ff0050] transition-colors placeholder:text-white/10 autofill:shadow-[0_0_0_1000px_#0a0a0a_inset] [color-scheme:dark] text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-white/40 uppercase tracking-widest mb-2 ml-1">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-12 text-[15px] font-medium focus:outline-none focus:border-[#ff0050] transition-colors placeholder:text-white/10 autofill:shadow-[0_0_0_1000px_#0a0a0a_inset] [color-scheme:dark] text-white"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-[#ff0050] text-xs font-semibold px-1">{error}</p>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-[#ff0050] hover:bg-[#ee1d52] text-white rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] mt-4 shadow-xl shadow-[#ff0050]/20 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar na Conta"}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-center text-sm text-white/40 font-medium">
                Não tem uma conta? <Link href="/register" className="text-white hover:text-[#ff0050] transition-colors">Registre-se gratuitamente.</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundPaths>
  );
}
