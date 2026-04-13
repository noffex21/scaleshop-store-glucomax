"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Zap, ShieldCheck, Rocket, ArrowRight, BarChart3, 
  Globe as GlobeIcon, CheckCircle2, TrendingUp, Smartphone, 
  Layers, Lock, Mail, Instagram, Twitter, Facebook, Home
} from "lucide-react";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { motion } from "framer-motion";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";

import { useStoreData } from "@/hooks/useStoreData";
import { StoreLandingLayout } from "@/components/layouts/StoreLandingLayout";
import { StoreFullLayout } from "@/components/layouts/StoreFullLayout";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { useState } from "react";
import { TikTokLoader } from "@/components/ui/tiktok-loader";

export default function LandingPage() {
  const { storeData, loading, error, isHeadless } = useStoreData();
  const router = useRouter();
  const [selectedKit, setSelectedKit] = useState<number>(1);
  const [modalAction, setModalAction] = useState<"cart" | "buy" | "select" | null>(null);
  const [runCartAnimation, setRunCartAnimation] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [storeView, setStoreView] = useState<"store" | "product">("store");
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  // API Key Gate state
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null);
  const [gateChecked, setGateChecked] = useState(false);

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const isMainSaaS = typeof window !== 'undefined' && window.location.port === '3000';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || (isMainSaaS ? "" : (isLocal ? "http://localhost:3000" : "https://scaleoficial.site"));

  useEffect(() => {
    const stored = localStorage.getItem("scale_shop_api_key");
    setSavedApiKey(stored);
    setGateChecked(true);
    
    // Otimização para Vercel: Fazer o prefetch da rota de checkout em background
    // assim que a página inicial carregar. Isso reduz a latência do router.push.
    router.prefetch('/checkout');
  }, [router]);

  const handleKeyValidated = (key: string) => {
    setSavedApiKey(key);
    // Force reload to trigger useStoreData with the new key
    window.location.reload();
  };

  // Redirect to store when headless mode is active and data is loaded
  useEffect(() => {
    if (isHeadless && storeData) {
      router.push('/loja');
    }
  }, [isHeadless, storeData, router]);

  // Aguarda a verificação do gate antes de renderizar
  if (!gateChecked) {
    return <TikTokLoader fullScreen />;
  }

  // Modo headless: precisa de API key OU dados já injetados (Baked Data)
  // Se não há chave salva E os dados atuais são apenas o placeholder: mostra o gate
  const isDataInjected = storeData && !(storeData as any).isPlaceholder;

  if (isHeadless && !savedApiKey && !loading && !isDataInjected) {
    return (
      <ApiKeyGate
        onKeyValidated={handleKeyValidated}
        apiUrl={apiUrl}
      />
    );
  }

  // Se tem API key mas ocorreu erro — chave inválida ou expirada
  if (isHeadless && error === "LICENSE_INVALID") {
    // Limpa a chave inválida do localStorage para permitir nova tentativa
    if (typeof window !== "undefined") {
      localStorage.removeItem("scale_shop_api_key");
    }
    return (
      <ApiKeyGate
        onKeyValidated={handleKeyValidated}
        apiUrl={apiUrl}
      />
    );
  }

  if (loading) {
    return <TikTokLoader fullScreen />;
  }

  // Gate de API Key redundante para segurança em deploys Netlify
  const isNetlifyStoreDeploy = typeof window !== "undefined" &&
    window.location.hostname.includes("netlify.app") &&
    !process.env.NEXT_PUBLIC_SCALE_SHOP_API_KEY;

  if (isNetlifyStoreDeploy && !savedApiKey && !storeData && !loading) {
    return (
      <ApiKeyGate
        onKeyValidated={handleKeyValidated}
        apiUrl={apiUrl}
      />
    );
  }

  if (isHeadless && storeData) {
    return <TikTokLoader fullScreen />;
  }

  // Caso contrário, renderiza a landing page normal do SaaS
  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'Solução', url: '#solucao', icon: Layers },
    { name: 'Vantagens', url: '#venda', icon: Zap },
    { name: 'Planos', url: '#precos', icon: BarChart3 }
  ];

  const plans = [
    {
      name: "Starter",
      price: "197",
      period: "/mês",
      stores: "3",
      features: [
        "3 lojas simultâneas",
        "3 créditos de deploy",
        "Subdomínios personalizados",
        "Páginas de Alta Conversão",
        "Design TikTok Ultra-Fiel"
      ],
      recommended: false,
      cta: "Escolher Starter",
      link: "https://go.perfectpay.com.br/PPU38CQ9BU2"
    },
    {
      name: "Business Pro",
      price: "497",
      period: "/mês",
      stores: "10",
      features: [
        "10 lojas simultâneas",
        "10 créditos de deploy",
        "Painel de Gestão Integrado",
        "Suporte Prioritário 24/7",
        "Painel de Analytics Avançado"
      ],
      recommended: true,
      cta: "Escalar Agora",
      link: "https://go.perfectpay.com.br/PPU38CQ9BS5"
    },
    {
      name: "Enterprise",
      price: "997",
      period: "/mês",
      stores: "50",
      features: [
        "50 lojas simultâneas",
        "50 créditos de deploy",
        "Infraestrutura Dedicada",
        "Gerente de Sucesso Exclusivo",
        "Suporte VIP 24h"
      ],
      recommended: false,
      cta: "Assinar Enterprise",
      link: "https://go.perfectpay.com.br/PPU38CQ9BS7"
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Taxa de Conversão Exponencial",
      desc: "Nossos templates são matematicamente desenhados para reduzir o atrito. Use o layout que os usuários já amam e confiam no TikTok."
    },
    {
      icon: Layers,
      title: "Escala em Tempo Recorde",
      desc: "Crie, replique e publique novas lojas em menos de 2 minutos. Teste produtos com a velocidade da luz e encontre seu winner."
    },
    {
      icon: Smartphone,
      title: "Mobile-First de Elite",
      desc: "98% do tráfego do TikTok vem do celular. Sua loja será a mais rápida e fluida que seus clientes já acessaram."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#ff0050] selection:text-white overflow-x-hidden">
      
      {/* NEW TUBELIGHT NAVBAR */}
      <NavBar items={navItems} />

      {/* REFINED BRAND HEADER (Floating Logo & Auth) */}
      <nav className="fixed top-0 left-0 right-0 z-[40] pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#ff0050] to-[#ee1d52] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#ff0050]/40">
              <Zap className="text-white w-5 h-5 sm:w-7 sm:h-7 fill-white" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic">Scale<span className="text-[#ff0050]">Shop</span></span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/login" 
              className="px-3 py-2 sm:px-6 sm:py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-white/60 hover:text-white transition-all backdrop-blur-md"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2.5 sm:px-8 sm:py-3.5 rounded-xl bg-gradient-to-br from-[#ff0050] to-[#ee1d52] text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-white transition-all hover:shadow-[0_0_20px_rgba(255,0,80,0.4)] hover:scale-105 active:scale-95 shadow-lg shadow-[#ff0050]/20"
            >
              Registro
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* HERO SECTION - THE VENDING MACHINE */}
        <section className="relative px-6 pt-24 pb-32 overflow-hidden">
          {/* Background Aura */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#ff0050]/15 rounded-full blur-[160px] -z-10" />
          
          <div 
            className="absolute top-0 right-0 bottom-0 left-0 z-0 flex items-center justify-center lg:justify-end opacity-20 pointer-events-none mix-blend-screen"
            style={{ maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)" }}
          >
            <RotatingEarth width={1000} height={1000} className="w-full h-full lg:translate-x-1/4" />
          </div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-[#ff0050] mb-8">
                <div className="w-2 h-2 rounded-full bg-[#ff0050] animate-pulse" />
                Plataforma de Escala Global
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
                A Máquina de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0050] via-[#ee1d52] to-[#ff0050]">Vendas</span> que o Algoritmo Ama.
              </h1>
              <p className="text-xl text-white/50 max-w-xl mb-12 leading-relaxed font-medium">
                Crie lojas de alta fidelidade visual em minutos. Transforme a atenção do TikTok Shop em faturamento real com nossa infraestrutura de escala proprietária.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Link href="/register" className="w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-10 bg-[#ff0050] hover:bg-[#ee1d52] rounded-2xl flex items-center justify-center gap-3 text-base sm:text-lg font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-[#ff0050]/30 whitespace-nowrap">
                  DOMINAR O MERCADO AGORA
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <div className="flex -space-x-3 items-center">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-zinc-800" />
                  ))}
                  <span className="ml-5 text-sm font-bold text-white/40">+842 players escalando agora</span>
                </div>
              </div>
            </div>

            {/* Visual Teaser Area - REALISTIC PHONE MOCKUP */}
            <div className="relative group hidden lg:block animate-in fade-in zoom-in-95 duration-1000 delay-300">
               {/* Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-br from-[#ff0050]/20 to-transparent rounded-[60px] blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />
               
               {/* Phone Frame */}
               <div className="relative mx-auto w-[320px] h-[640px] bg-zinc-900 rounded-[50px] border-[8px] border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-white/10">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20" />
                  
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-black flex flex-col pt-12 p-4">
                     {/* ScaleShop App Branding in Phone */}
                     <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-2">
                           <Zap className="w-5 h-5 text-[#ff0050] fill-[#ff0050]" />
                           <span className="text-xs font-black tracking-tighter uppercase italic">ScaleShop</span>
                        </div>
                        <div className="flex gap-1">
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <div className="w-1 h-1 rounded-full bg-white/40" />
                        </div>
                     </div>

                     {/* Notification Stack */}
                     <div className="space-y-3 relative">
                        {[
                          { time: "Agora mesmo", value: "197,00", user: "André S." },
                          { time: "Há 2 min", value: "497,90", user: "Marcos V." },
                          { time: "Há 5 min", value: "97,00", user: "Loja VIP" },
                          { time: "Há 12 min", value: "1.290,00", user: "Escala 7D" },
                        ].map((notif, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10, filter: "blur(10px)", scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                            whileHover={{ 
                              scale: 1.05, 
                              backgroundColor: "rgba(255, 255, 255, 0.08)",
                              borderColor: "rgba(255, 0, 80, 0.4)",
                              boxShadow: "0 10px 40px -10px rgba(255, 0, 80, 0.3)" 
                            }}
                            viewport={{ once: true }}
                            transition={{ 
                              type: "spring",
                              stiffness: 100,
                              damping: 15,
                              delay: 0.4 + (i * 0.15) 
                            }}
                            className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-[0_8px_32px_0_rgba(255,0,80,0.1)] ring-1 ring-white/5 cursor-pointer transition-colors duration-300"
                          >
                             <div className="w-10 h-10 bg-[#ff0050] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#ff0050]/20">
                                <Zap className="w-5 h-5 text-white fill-white" />
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-center mb-0.5">
                                   <span className="text-[10px] font-black uppercase tracking-widest text-[#ff0050]">Venda Aprovada</span>
                                   <span className="text-[9px] text-white/30 font-bold">{notif.time}</span>
                                </div>
                                <div className="text-[13px] font-black tracking-tight">
                                   R$ {notif.value} <span className="text-white/40 font-medium ml-1">por {notif.user}</span>
                                </div>
                             </div>
                          </motion.div>
                        ))}

                        {/* Floating Success Indicator */}
                        <motion.div 
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                          className="absolute -right-8 top-1/2 bg-green-500/10 border border-green-500/20 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl"
                        >
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">+ 124% ROI</span>
                        </motion.div>
                     </div>

                     {/* Stats Chart Mock */}
                     <div className="mt-auto mb-4 bg-white/[0.03] border border-white/5 rounded-3xl p-5 h-40 flex flex-col justify-end gap-4 overflow-hidden relative">
                        <div className="absolute top-4 left-5">
                           <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Receita Hoje</div>
                           <div className="text-xl font-black tracking-tighter text-white">R$ 14.820,40</div>
                        </div>
                        <div className="flex items-end gap-1 h-12">
                           {[40, 70, 45, 90, 65, 80, 100, 85, 95, 75, 40, 60].map((h, i) => (
                              <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 1 + (i * 0.05), duration: 0.5 }}
                                className="flex-1 bg-gradient-to-t from-[#ff0050] to-[#ee1d52] rounded-t-sm opacity-60"
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Decorative Element */}
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ff0050]/20 rounded-full blur-[80px] -z-10" />
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION - WHY CHOOSE SCALE SHOP */}
        <section id="venda" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Por que os grandes players <span className="text-[#ff0050]">não usam</span> plataformas genéricas?</h2>
              <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium">Porque cada segundo de latência e cada elemento visual "diferente" do esperado matam a sua conversão. Nós resolvemos isso.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="p-10 rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-[#ff0050]/30 transition-all duration-500 hover:-translate-y-2">
                  <div className="w-14 h-14 bg-[#ff0050]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#ff0050]/20">
                    <benefit.icon className="w-7 h-7 text-[#ff0050]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-white/40 leading-relaxed font-medium">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID - BUSINESS TOOLS */}
        <section id="solucao" className="py-32 px-6 bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
             <div className="grid lg:grid-cols-2 gap-24 items-center">
                <div className="order-2 lg:order-1 relative">
                    <div className="grid grid-cols-2 gap-6">
                       {[
                         { icon: GlobeIcon, label: "Domínios VIP", color: "text-blue-400" },
                         { icon: ShieldCheck, label: "Checkout Seguro", color: "text-green-400" },
                         { icon: BarChart3, label: "Dados Reais", color: "text-[#ff0050]" },
                         { icon: Rocket, label: "Escala Ninja", color: "text-purple-400" }
                       ].map((item, i) => (
                         <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-end gap-4 hover:bg-white/10 transition-colors">
                            <item.icon className={`w-10 h-10 ${item.color}`} />
                            <span className="font-bold tracking-tight">{item.label}</span>
                         </div>
                       ))}
                    </div>
                </div>

                <div className="order-1 lg:order-2">
                   <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">O ecossistema completo para quem joga o <span className="text-[#ff0050]">jogo grande.</span></h2>
                   <div className="space-y-8">
                      {[
                        { title: "Gestão Unificada", text: "Gerencie 10, 20 ou 50 lojas a partir de um único painel de controle mestre." },
                        { title: "Segurança de Dados de Elite", text: "Sua infraestrutura protegida com criptografia de ponta e redundância total." },
                        { title: "Analytics de Conversão", text: "Visualize onde os clientes estão saindo e otimize seu lucro por clique." }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-5">
                           <div className="mt-1 flex-shrink-0">
                              <CheckCircle2 className="w-6 h-6 text-[#ff0050]" />
                           </div>
                           <div>
                              <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                              <p className="text-white/40 font-medium text-[15px]">{item.text}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* PRICING PLANS - PROFESSIONAL FOCUS */}
        <section id="precos" className="py-40 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Pronto para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0050] to-[#ee1d52]">Escalar?</span></h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">Invista na ferramenta que vai multiplicar sua lucratividade diária.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {plans.map((plan, i) => (
                <div 
                  key={i} 
                  className={`p-12 rounded-[48px] border-2 transition-all duration-500 relative flex flex-col h-full bg-[#111] ${
                    plan.recommended 
                    ? "border-[#ff0050] shadow-3xl shadow-[#ff0050]/20 scale-105 z-10" 
                    : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="mb-10">
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${plan.recommended ? 'bg-[#ff0050] text-white' : 'bg-white/5 text-white/40'}`}>
                      {plan.name}
                    </span>
                    <div className="flex items-end gap-1 mt-6">
                      <span className="text-5xl font-black tracking-tight">R$ {plan.price}</span>
                      <span className="text-white/30 font-bold mb-1.5">{plan.period}</span>
                    </div>
                    <p className="text-sm text-white/30 font-medium mt-2">Pague apenas pelo que escalar.</p>
                  </div>

                  <div className="flex-1 space-y-5 mb-12">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <CheckCircle2 className={`w-5 h-5 ${plan.recommended ? "text-[#ff0050]" : "text-white/20"}`} />
                        <span className="text-sm font-bold text-white/70">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link 
                    href={plan.link || "/register"}
                    target="_blank"
                    className={`h-16 rounded-2xl flex items-center justify-center font-black text-sm uppercase tracking-widest transition-all ${
                      plan.recommended 
                      ? "bg-[#ff0050] text-white hover:bg-[#ee1d52] shadow-xl shadow-[#ff0050]/20" 
                      : "bg-white text-black hover:bg-white/90"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ - REMOVENDO OBJEÇÕES */}
        <section className="py-32 px-6">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-black text-center mb-20 uppercase tracking-tight">Perguntas Frequentes</h2>
              <div className="space-y-6">
                 {[
                   { q: "As lojas são realmente idênticas ao original?", a: "Sim. Nossos engenheiros de design recriaram cada elemento visual, animação e comportamento do TikTok Shop original para garantir fidelidade total." },
                   { q: "Posso usar meu próprio domínio?", a: "Com certeza. Você pode vincular seus próprios domínios diretamente ao nosso painel para rodar seu tráfego pago com autoridade." },
                   { q: "Preciso de um desenvolvedor?", a: "Não. A Scale Shop é uma solução 'click-and-go'. Você configura tudo visualmente pelo nosso painel administrativo em segundos." },
                   { q: "É seguro rodar milhares de pedidos?", a: "Nossa infraestrutura foi desenhada para suportar picos extremos de tráfego sem queda de performance ou erro no checkout." }
                 ].map((item, i) => (
                   <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5">
                      <h4 className="text-lg font-bold mb-3">{item.q}</h4>
                      <p className="text-white/40 font-medium leading-relaxed">{item.a}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-40 px-6 text-center relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff0050]/20 rounded-full blur-[120px] -z-10" />
           <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85]">O próximo nível da sua escala começa <span className="text-[#ff0050]">aqui.</span></h2>
              <p className="text-xl text-white/50 mb-12 font-medium">Junte-se à elite do dropshipping e pare de perder vendas por design amador.</p>
              <Link href="/register" className="inline-flex h-20 px-16 bg-[#ff0050] hover:bg-[#ee1d52] text-white rounded-[32px] items-center justify-center gap-4 text-2xl font-black transition-all hover:scale-[1.05] active:scale-[0.98] shadow-3xl shadow-[#ff0050]/30 outline outline-4 outline-[#ff0050]/20">
                 CRIAR MINHA CONTA AGORA
                 <Zap className="w-6 h-6 fill-white" />
              </Link>
           </div>
        </section>

        {/* ULTRA-PREMIUM HOVER FOOTER */}
        <footer className="bg-[#0a0a0a] relative h-fit rounded-[64px] overflow-hidden mx-6 mb-12 border border-white/5">
          <div className="max-w-7xl mx-auto p-14 lg:p-24 z-40 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 pb-16">
              {/* Brand section */}
              <div className="flex flex-col space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ff0050] to-[#ee1d52] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff0050]/20">
                    <Zap className="text-white w-6 h-6 fill-white" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter uppercase italic">Scale<span className="text-[#ff0050]">Shop</span></span>
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-medium max-w-xs">
                  A infraestrutura definitiva para operações que não aceitam nada menos que o topo da escala no TikTok.
                </p>
                <div className="flex gap-4">
                  {[Instagram, Twitter, Facebook].map((Icon, i) => (
                    <a key={i} href="#" className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[#ff0050] transition-all group border border-white/5">
                       <Icon className="w-5 h-5 text-white/30 group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer Links */}
              {[
                {
                  title: "Plataforma",
                  links: [
                    { label: "Funcionalidades", href: "#" },
                    { label: "Templates VIP", href: "#" },
                    { label: "Gestão Multi-Loja", href: "#" },
                    { label: "Checkout Seguro", href: "#", pulse: true },
                  ],
                },
                {
                  title: "Recursos",
                  links: [
                    { label: "Suporte 24/7", href: "#" },
                    { label: "Blog de Escala", href: "#" },
                    { label: "Documentação", href: "#" },
                    { label: "API para Devs", href: "#" },
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label} className="relative w-fit group">
                        <a
                          href={link.href}
                          className="text-sm font-bold text-white/40 group-hover:text-[#ff0050] transition-colors"
                        >
                          {link.label}
                        </a>
                        {link.pulse && (
                          <span className="absolute -top-1 -right-4 w-2 h-2 rounded-full bg-[#ff0050] animate-pulse"></span>
                        )}
                        <div className="absolute -bottom-1 left-0 w-0 h-px bg-[#ff0050] group-hover:w-full transition-all duration-300" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Contact section */}
              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">
                  Contato
                </h4>
                <ul className="space-y-5">
                   <li className="flex items-center space-x-3 group">
                      <div className="w-8 h-8 rounded-lg bg-[#ff0050]/10 flex items-center justify-center">
                        <Mail size={16} className="text-[#ff0050]" />
                      </div>
                      <a href="mailto:contato@scaleshop.com" className="text-sm font-bold text-white/40 hover:text-white transition-colors">contato@scaleshop.com</a>
                   </li>
                   <li className="flex items-center space-x-3 group">
                      <div className="w-8 h-8 rounded-lg bg-[#ff0050]/10 flex items-center justify-center">
                        <GlobeIcon size={16} className="text-[#ff0050]" />
                      </div>
                      <span className="text-sm font-bold text-white/40">São Paulo, Brasil</span>
                   </li>
                   <li className="pt-4 flex items-center gap-4 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                      <ShieldCheck className="w-8 h-8 text-white" />
                      <Lock className="w-8 h-8 text-white" />
                   </li>
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
                &copy; {new Date().getFullYear()} ScaleShop Enterprise. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacidade</Link>
                <Link href="/legal/terms" className="hover:text-white transition-colors">Termos</Link>
                <Link href="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
                <Link href="/legal/disclaimer" className="hover:text-white transition-colors text-[#ff0050]">Aviso Legal</Link>
              </div>
            </div>
          </div>

          {/* Text hover effect - GIANT SCALESHOP LOGO */}
          <div className="lg:flex hidden h-[22rem] -mt-32 -mb-20 pointer-events-none">
            <TextHoverEffect text="SCALESHOP" className="z-10 opacity-40 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>

          <FooterBackgroundGradient />
        </footer>
      </main>
    </div>
  );
}
