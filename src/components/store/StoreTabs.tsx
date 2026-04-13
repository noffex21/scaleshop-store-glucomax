import React from "react";

type StoreTab = "home" | "products" | "categories";

interface StoreTabsProps {
  activeTab: StoreTab;
  onTabChange: (tab: StoreTab) => void;
  showCategories?: boolean;
}

export function StoreTabs({ activeTab, onTabChange, showCategories = true }: StoreTabsProps) {
  const tabs = [
    { id: "home", label: "Página inicial" },
    { id: "products", label: "Produtos" },
    ...(showCategories ? [{ id: "categories", label: "Categorias" }] : [])
  ];

  return (
    <div className="flex border-b border-[#F1F1F2] bg-white sticky top-0 z-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as StoreTab)}
          className={`flex-1 py-4 text-[15px] font-bold transition-all relative ${
            activeTab === tab.id ? "text-[#161823]" : "text-[#8A8B91] opacity-60"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[#161823]" />
          )}
        </button>
      ))}
    </div>
  );
}
