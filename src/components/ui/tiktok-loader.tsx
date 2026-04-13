"use client";

import React from "react";

interface TikTokLoaderProps {
  fullScreen?: boolean;
  theme?: "light" | "dark";
}

export function TikTokLoader({ fullScreen = false, theme = "light" }: TikTokLoaderProps) {
  const blendClass = theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply";
  
  const loaderCore = (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <div 
        className={`absolute w-4 h-4 rounded-full bg-[#25F4EE] ${blendClass}`} 
        style={{ animation: 'tiktokBallLeft 1s infinite linear' }}
      />
      <div 
        className={`absolute w-4 h-4 rounded-full bg-[#FE2C55] ${blendClass}`} 
        style={{ animation: 'tiktokBallRight 1s infinite linear' }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes tiktokBallLeft {
          0% { transform: translateX(-12px) scale(0.9); z-index: 2; }
          25% { transform: translateX(0px) scale(1.1); z-index: 2; }
          50% { transform: translateX(12px) scale(0.9); z-index: 1; }
          75% { transform: translateX(0px) scale(0.7); z-index: 1; }
          100% { transform: translateX(-12px) scale(0.9); z-index: 2; }
        }
        @keyframes tiktokBallRight {
          0% { transform: translateX(12px) scale(0.9); z-index: 1; }
          25% { transform: translateX(0px) scale(0.7); z-index: 1; }
          50% { transform: translateX(-12px) scale(0.9); z-index: 2; }
          75% { transform: translateX(0px) scale(1.1); z-index: 2; }
          100% { transform: translateX(12px) scale(0.9); z-index: 1; }
        }
      `}} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#f5f5f5]">
        {loaderCore}
        <span className="mt-4 text-[14px] text-gray-500 font-medium tracking-tight">Carregando...</span>
      </div>
    );
  }

  return loaderCore;
}
