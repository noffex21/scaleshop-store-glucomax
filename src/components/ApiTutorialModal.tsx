'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Github, Globe, CheckCircle2, Key, ShieldCheck, 
  Terminal, ExternalLink, ChevronRight, ChevronLeft,
  Settings, Lock, Zap, Server, Rocket, HelpCircle,
  Gem, Heart, Shield, Boxes, Layers, Box
} from 'lucide-react';

interface ApiTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiTutorialModal({ isOpen, onClose }: ApiTutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Boas-vindas ao Império",
      subtitle: "Preparação para a Escala",
      icon: <Gem className="w-8 h-8 text-[#ff0050]" />,
      content: (
        <div className="space-y-6 text-center py-4">
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-[#ff0050]/20 blur-2xl rounded-full" />
             <Rocket className="w-20 h-20 text-[#ff0050] relative z-10 animate-bounce" />
          </div>
          <div className="space-y-3">
             <h3 className="text-2xl font-black italic uppercase tracking-tighter">Motor de Automação</h3>
             <p className="text-white/40 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                Você está prestes a configurar os protocolos que transformam o ScaleShop em uma máquina de vendas automática. Siga cada etapa com atenção cirúrgica.
             </p>
          </div>
          <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4 text-left">
             <Shield className="w-6 h-6 text-[#ff0050]/50" />
             <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-normal">
                Suas chaves serão criptografadas e armazenadas em ambiente seguro de nível bancário.
             </p>
          </div>
        </div>
      )
    },
    {
      title: "GitHub: Fase 01 & 02",
      subtitle: "Criação e Identidade",
      icon: <Github className="w-6 h-6 text-white" />,
      content: (
        <div className="space-y-5">
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-4">
             <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#ff0050] text-black font-black flex items-center justify-center text-xs">01</span>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Criando o Motor Base</h4>
             </div>
             <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                Vá em <b>Settings {' > '} Developer Settings {' > '} GitHub Apps</b>. Clique em <b>New GitHub App</b>.
                Nome: <b>Scale Shop Automator [Nome Único]</b>.
             </p>
          </div>
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-4">
             <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#ff0050] text-black font-black flex items-center justify-center text-xs">02</span>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">URLs do Protocolo</h4>
             </div>
             <div className="space-y-2">
                <div className="flex flex-col gap-1 p-3 bg-black/40 rounded-xl border border-white/5">
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Homepage URL</span>
                   <code className="text-[10px] text-[#ff0050] font-black">https://scaleoficial.site</code>
                </div>
                <div className="flex flex-col gap-1 p-3 bg-black/40 rounded-xl border border-white/5">
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Callback URL</span>
                   <code className="text-[10px] text-[#ff0050] font-black">https://scaleoficial.site/api/auth/callback/github</code>
                </div>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "GitHub: Fase 03 & 04",
      subtitle: "Permissões de Elite",
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      content: (
        <div className="space-y-5">
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-4">
             <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#ff0050] text-black font-black flex items-center justify-center text-xs">03</span>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Poder do Repositório</h4>
             </div>
             <p className="text-[11px] text-white/30 leading-relaxed">
                Configure as permissões: <br/>
                <b>Administration, Contents, Commit statuses, Deploy keys</b> = <span className="text-white font-black">Read & Write</span>. <br/>
                <b>Metadata</b> = <span className="text-white/60 font-black">Read-only</span>.
             </p>
          </div>
          <div className="p-6 bg-[#ff0050]/5 border border-[#ff0050]/20 rounded-[32px] space-y-3">
             <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#ff0050] text-black font-black flex items-center justify-center text-xs">04</span>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Webhook Blindado</h4>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                   <X className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-tight">
                   DESMARQUE a caixinha <b>Active</b> no Webhook. Isso é vital!
                </p>
             </div>
          </div>
        </div>
      )
    },
    {
      title: "GitHub: Fase 05 & 06",
      subtitle: "Criação de Chaves",
      icon: <Key className="w-6 h-6 text-white" />,
      content: (
        <div className="space-y-5">
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-4">
             <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#ff0050] text-black font-black flex items-center justify-center text-xs">05</span>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Propriedade</h4>
             </div>
             <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                "Where can this App be installed?" = Selecione <b>Only on this account</b>. <br/>
                Clique em <b>Create GitHub App</b>.
             </p>
          </div>
          <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-4">
             <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#ff0050] text-black font-black flex items-center justify-center text-xs">06</span>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Segredos de Estado</h4>
             </div>
             <ul className="text-[10px] text-white/40 space-y-2 uppercase font-black tracking-widest">
                <li className="flex items-center gap-2">
                   <CheckCircle2 className="w-3 h-3 text-green-500" /> Copie o Client ID
                </li>
                <li className="flex items-center gap-2">
                   <CheckCircle2 className="w-3 h-3 text-green-500" /> Gere o Client Secret
                </li>
                <li className="flex items-center gap-2">
                   <CheckCircle2 className="w-3 h-3 text-green-500" /> Gere a Private Key (.pem)
                </li>
             </ul>
          </div>
        </div>
      )
    },
    {
      title: "GitHub: Fase 07",
      subtitle: "Instalação Final",
      icon: <Layers className="w-6 h-6 text-[#ff0050]" />,
      content: (
        <div className="space-y-6">
          <div className="relative p-8 bg-gradient-to-br from-[#ff0050]/20 to-transparent border border-[#ff0050]/20 rounded-[40px] overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff0050]/10 blur-3xl rounded-full" />
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#ff0050] flex items-center justify-center text-black">
                   <Box className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">Instalação Crítica</h4>
             </div>
             <p className="text-[11px] text-white/70 font-medium leading-relaxed mb-6">
                No menu lateral do seu App, vá em <b>Install App</b>. <br/>
                Instale no seu perfil e escolha <b>Only select repositories</b>. <br/>
                <span className="text-white font-black underline underline-offset-4 decoration-[#ff0050]">Selecione o repositório mestre do seu site.</span>
             </p>
             <div className="flex items-center gap-2 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                <Zap className="w-3 h-3 text-[#ff0050]" />
                Sem isso, o erro 404 será inevitável.
             </div>
          </div>
        </div>
      )
    },
    {
      title: "Protocolo Netlify",
      subtitle: "A Nuvem de Elite",
      icon: <Globe className="w-6 h-6 text-[#00ADBB]" />,
      content: (
        <div className="space-y-5">
          <div className="p-7 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#00ADBB]/10 flex items-center justify-center">
                   <ExternalLink className="w-5 h-5 text-[#00ADBB]" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[#00ADBB]">OAuth Application</h4>
             </div>
             <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                Vá em <b>User Settings {' > '} Applications</b> no Netlify. <br/>
                Clique em <b>New OAuth App</b>.
             </p>
          </div>
          <div className="p-7 bg-[#00ADBB]/5 border border-[#00ADBB]/20 rounded-[32px] space-y-4">
             <div className="flex flex-col gap-2">
                <span className="text-[8px] font-black text-[#00ADBB]/40 uppercase tracking-widest">Redirect URI Crítico</span>
                <code className="text-[10px] text-white font-black p-3 bg-black/40 rounded-xl border border-[#00ADBB]/20">
                   https://scaleoficial.site/api/auth/netlify/callback
                </code>
             </div>
             <p className="text-[10px] text-white/30 font-medium uppercase tracking-tight italic">
                Copie o Client ID e Secret imediatamente após salvar.
             </p>
          </div>
        </div>
      )
    },
    {
      title: "Protocolo Vercel",
      subtitle: "Nuvem de Alta Performance",
      icon: <svg viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor"/></svg>,
      content: (
        <div className="space-y-5">
          <div className="p-7 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                   <Settings className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">Vercel API Token</h4>
             </div>
             <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                Vá em <b>Vercel Settings {' > '} Tokens</b>. <br/>
                Clique em <b>Create</b>, dê um nome e escolha <b>Full Access</b>.
             </p>
          </div>
          <div className="p-7 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
             <div className="flex flex-col gap-2">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Onde Inserir</span>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-tight">
                   Copie o Token gerado e cole no campo <b>Vercel API Token</b> na aba de Chaves de API do seu Dashboard.
                </p>
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black text-[#ff0050] uppercase tracking-[0.3em]">
                <Rocket className="w-3 h-3" />
                Dê prioridade à Vercel se desejar deploys instantâneos.
             </div>
          </div>
        </div>
      )
    },
    {
       title: "Operação Ativada",
       subtitle: "Pronto para Dominar",
       icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
       content: (
         <div className="space-y-8 text-center py-6">
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
               <div className="w-24 h-24 rounded-[40px] bg-green-500/10 border border-green-500/30 flex items-center justify-center relative z-10">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
               </div>
            </div>
            <div className="space-y-4">
               <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Tudo Pronto!</h3>
               <p className="text-white/40 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                  Agora insira as chaves na aba <b>Acesso & API</b> e salve. Sua infraestrutura de elite está pronta para captar cada PLIN de lucro.
               </p>
            </div>
            <div className="flex justify-center gap-2">
               {[1,2,3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
               ))}
            </div>
         </div>
       )
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-[540px] bg-[#050505] border border-white/10 rounded-[48px] overflow-hidden shadow-[0_0_100px_-20px_rgba(255,0,80,0.2)]"
        >
          {/* Progress Indicator */}
          <div className="absolute top-0 inset-x-0 flex gap-1 p-3">
            {steps.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${idx <= currentStep ? (currentStep === steps.length - 1 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-[#ff0050] shadow-[0_0_10px_#ff0050]') : 'bg-white/5'}`}
              />
            ))}
          </div>

          {/* Header */}
          <div className="pt-16 px-10 pb-8 flex items-center justify-between relative overflow-hidden">
             {/* Decorative Background Glow */}
             <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff0050]/5 blur-[80px] rounded-full -mr-24 -mt-24 pointer-events-none" />
             
             <div className="flex flex-col gap-1.5 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white">
                      {steps[currentStep].icon}
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-[0.2em] italic">
                         {steps[currentStep].title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#ff0050]" />
                         <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">
                            {steps[currentStep].subtitle}
                         </span>
                      </div>
                   </div>
                </div>
             </div>
             
             <button 
                onClick={onClose}
                className="p-3 hover:bg-white/5 rounded-full transition-colors relative z-10 group"
             >
                <X className="w-6 h-6 text-white/20 group-hover:text-white transition-colors" />
             </button>
          </div>

          {/* Content Body */}
          <div className="px-10 py-4 min-h-[380px] flex flex-col justify-center relative">
             <AnimatePresence mode="wait">
                <motion.div
                   key={currentStep}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
                >
                   {steps[currentStep].content}
                </motion.div>
             </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="p-10 flex items-center justify-between gap-6 bg-white/[0.02] border-t border-white/5">
             <button 
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex items-center gap-3 text-[11px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-white disabled:opacity-0 transition-all"
             >
                <ChevronLeft className="w-5 h-5" /> Anterior
             </button>
             
             <button 
                onClick={() => {
                   if (currentStep === steps.length - 1) {
                      onClose();
                   } else {
                      setCurrentStep(prev => prev + 1);
                   }
                }}
                className={`flex items-center gap-4 px-12 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 active:scale-95 group shadow-2xl ${
                   currentStep === steps.length - 1 
                   ? 'bg-green-500 text-black hover:bg-green-400 shadow-green-500/20' 
                   : 'bg-white text-black hover:bg-[#ff0050] hover:text-white shadow-white/5'
                }`}
             >
                {currentStep === steps.length - 1 ? 'Concluir' : 'Próxima Fase'}
                {currentStep !== steps.length - 1 && <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />}
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
