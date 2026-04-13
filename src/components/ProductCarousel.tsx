"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { PRODUCT_DATA } from "@/config/productData";

export function ProductCarousel({ data = PRODUCT_DATA }: { data?: any }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Mídia
  const slides = data.carouselImages || []; 

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  return (
    <>
      <div className="relative bg-white rounded-[14px] overflow-hidden shadow-sm w-full">
        <div className="overflow-hidden w-full aspect-[4/5]" ref={emblaRef}>
          <div className="flex touch-pan-y h-full">
            {slides.map((src: string, index: number) => (
              <div 
                className="min-w-0 flex-[0_0_100%] h-full relative cursor-zoom-in group bg-white" 
                key={index}
                onClick={() => setFullscreenImage(src)}
              >
                {src && (
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Indicador de página do TikTok (canto inferior direito) */}
        <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[12px] font-medium px-2 py-0.5 rounded-full z-10 pointer-events-none tracking-wide">
          {selectedIndex + 1}/{slides.length}
        </div>
      </div>

      {/* Fullscreen Image Overlay */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center cursor-zoom-out animate-in fade-in bg-black/95"
          onClick={() => setFullscreenImage(null)}
        >
          <img 
            src={fullscreenImage} 
            alt="Fullscreen Product" 
            className="w-full max-w-[480px] max-h-[90vh] object-contain transition-transform duration-300" 
          />
        </div>
      )}
    </>
  );
}
