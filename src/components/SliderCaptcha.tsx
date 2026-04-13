"use client";

import { useEffect, useState } from "react";
import { X, ChevronRight, Check } from "lucide-react";

interface SliderCaptchaProps {
  onSuccess: () => void;
  onClose?: () => void;
  hideClose?: boolean;
}

export function SliderCaptcha({ onSuccess, onClose, hideClose = false }: SliderCaptchaProps) {
  const [targetX, setTargetX] = useState(150);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerWidth = 280;
  const containerHeight = 155;
  const pieceSize = 45;
  const pieceTop = 50;
  const maxSlider = 232;

  useEffect(() => {
    const randomX = Math.floor(Math.random() * (maxSlider - 60)) + 60;
    setTargetX(randomX);
  }, []);

  const handlePointerUp = () => {
    if (isSuccess) return;
    setIsDragging(false);

    if (Math.abs(sliderValue - targetX) < 10) {
      setSliderValue(targetX); 
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 700);
    } else {
      setIsError(true);
      setTimeout(() => {
        setSliderValue(0);
        setIsError(false);
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 flex items-center justify-center p-4 animate-in fade-in max-w-[480px] mx-auto">
      <div className="bg-white rounded-xl w-full max-w-[320px] flex flex-col items-center p-5 pt-6 relative shadow-2xl">
        {!hideClose && onClose && (
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
        
        <h2 className="text-[16px] font-bold text-[#161823] mb-1">Verificação de Segurança</h2>
        <p className="text-[13px] text-gray-500 mb-5 text-center leading-tight">Deslize a peça para encaixar no espaço em branco e confirmar que não é um robô.</p>

        <div className="relative rounded overflow-hidden shadow-sm bg-gray-100" style={{ width: containerWidth, height: containerHeight }}>
          <img src="https://picsum.photos/id/29/400/250" alt="Captcha Background" className="w-full h-full object-cover opacity-90" />
          
          <div 
            className="absolute bg-black/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] rounded-[3px]"
            style={{ 
              left: targetX, 
              top: pieceTop, 
              width: pieceSize, 
              height: pieceSize,
            }}
          />

          <div 
            className={`absolute rounded-[3px] overflow-hidden border-2 flex items-center justify-center bg-white shadow-lg z-10 box-border`}
            style={{
              left: sliderValue,
              top: pieceTop,
              width: pieceSize,
              height: pieceSize,
              borderColor: isSuccess ? '#1aa68f' : isError ? '#fe2c55' : 'white',
              boxShadow: isSuccess ? '0 0 15px rgba(26,166,143,0.5)' : undefined,
              transition: isDragging ? 'none' : 'left 0.3s ease-out, border-color 0.2s'
            }}
          >
            <img 
              src="https://picsum.photos/id/29/400/250" 
              className="max-w-none absolute top-[-2px] left-[-2px]" 
              style={{
                width: containerWidth,
                height: containerHeight,
                transform: `translate(-${targetX}px, -${pieceTop}px)`
              }}
            />
          </div>
          
          {isSuccess && (
             <div className="absolute inset-0 bg-white/40 flex items-center justify-center transition-all animate-in fade-in z-20">
                <div className="bg-[#1aa68f] text-white rounded-full p-2.5 shadow-xl scale-in animate-in">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
             </div>
          )}
        </div>

        <div className="w-full mt-6 relative h-11 bg-gray-50 rounded-full flex items-center px-1 border border-gray-200 touch-none">
          <div className="absolute left-0 top-0 bottom-0 bg-[#1aa68f]/10 rounded-full transition-all touch-none" style={{ width: `${(sliderValue / maxSlider) * 100}%`, transitionDuration: isDragging ? '0s' : '0.3s' }} />
          
          <span className="absolute w-full text-center text-[13px] text-gray-500 font-medium pointer-events-none touch-none">
            {isSuccess ? 'Verificado com sucesso' : 'Deslize a peça para direita'}
          </span>
          
          <input 
            type="range"
            min="0"
            max={maxSlider}
            value={sliderValue}
            onChange={(e) => {
              if (isSuccess) return;
              setSliderValue(Number(e.target.value));
            }}
            onPointerDown={() => !isSuccess && setIsDragging(true)}
            onPointerUp={handlePointerUp}
            onTouchStart={() => !isSuccess && setIsDragging(true)}
            onTouchEnd={handlePointerUp}
            className={`w-full z-10 appearance-none bg-transparent opacity-0 cursor-ew-resize h-full touch-none ${isSuccess ? 'pointer-events-none' : ''}`}
          />

          <div 
            className={`absolute left-1 top-1 bottom-1 w-[34px] rounded-full shadow-sm border flex items-center justify-center pointer-events-none z-20 bg-white`}
            style={{ 
              transform: `translateX(${sliderValue}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              borderColor: isSuccess ? '#1aa68f' : isError ? '#fe2c55' : '#e5e7eb',
              color: isSuccess ? '#1aa68f' : isError ? '#fe2c55' : '#9ca3af'
            }}
          >
            {isSuccess ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </div>

      </div>
    </div>
  );
}
