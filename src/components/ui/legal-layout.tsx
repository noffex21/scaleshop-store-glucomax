"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Zap, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, subtitle, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#ff0050] selection:text-white overflow-x-hidden">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ff0050] to-[#ee1d52] rounded-lg flex items-center justify-center shadow-lg shadow-[#ff0050]/20">
              <ChevronLeft className="text-white w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-sm font-black tracking-widest uppercase text-white/40 group-hover:text-white transition-colors">Voltar</span>
          </Link>

          <div className="flex items-center gap-2">
            <Zap className="text-[#ff0050] w-5 h-5 fill-[#ff0050]" />
            <span className="text-lg font-black tracking-tighter uppercase italic">Scale<span className="text-[#ff0050]">Shop</span></span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Hero Header */}
          <div className="mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff0050]/10 border border-[#ff0050]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#ff0050] mb-6"
            >
              <ShieldAlert className="w-3 h-3" />
              Documentação Legal
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-6"
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/50 font-medium"
              >
                {subtitle}
              </motion.p>
            )}
            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mt-12" />
          </div>

          {/* Content Area */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-10"
          >
            {children}
          </motion.div>

          {/* Footer of legal page */}
          <div className="mt-20 pt-12 border-t border-white/5 text-center">
            <p className="text-xs font-bold text-white/20 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} ScaleShop Enterprise. Última atualização: Março de 2026.
            </p>
          </div>
        </article>
      </main>

      {/* Background Aura */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#ff0050]/5 rounded-full blur-[160px] -z-10 pointer-events-none" />
    </div>
  );
}
