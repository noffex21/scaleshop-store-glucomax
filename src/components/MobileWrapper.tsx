"use client";

import React from "react";

export function MobileWrapper({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`min-h-screen bg-stone-200 text-[#161823] flex flex-col items-center ${className}`}>
      <div className="w-full max-w-[480px] min-h-screen bg-white relative shadow-2xl flex flex-col">
        {children}
      </div>
    </div>
  );
}
