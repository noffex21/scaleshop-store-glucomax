import React from "react";

interface StoreBannerProps {
  banner?: {
    text: string;
    subtext: string;
    buttonText: string;
    bgColor: string;
    textColor: string;
  };
}

export function StoreBanner({ banner }: StoreBannerProps) {
  const currentBanner = banner || {
    text: "Cupom de envio",
    subtext: "em pedidos acima de R$ 109",
    buttonText: "Resgatar",
    bgColor: "#E6F9F9",
    textColor: "#00B2B2"
  };

  return (
    <div className="px-4 py-3">
      <div 
        className="border rounded-xl p-3 flex items-center justify-between"
        style={{ 
          backgroundColor: currentBanner.bgColor, 
          borderColor: `${currentBanner.textColor}33` 
        }}
      >
        <div className="flex flex-col">
          <span 
            className="font-bold text-[14px]"
            style={{ color: currentBanner.textColor }}
          >
            {currentBanner.text}
          </span>
          <span className="text-[#5C5E66] text-[12px]">{currentBanner.subtext}</span>
        </div>
        <button 
          className="text-white px-4 py-1 rounded-md text-[13px] font-bold"
          style={{ backgroundColor: currentBanner.textColor }}
        >
          {currentBanner.buttonText}
        </button>
      </div>
    </div>
  );
}
