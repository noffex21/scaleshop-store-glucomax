"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { MoveRight, Sparkles } from "lucide-react";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  layer: number;
}

function createBeam(width: number, height: number, layer: number): Beam {
  const angle = -35 + Math.random() * 10;
  const baseSpeed = 0.2 + layer * 0.2;
  const baseOpacity = 0.08 + layer * 0.05;
  const baseWidth = 10 + layer * 5;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    width: baseWidth,
    length: height * 2.5,
    angle,
    speed: baseSpeed + Math.random() * 0.2,
    opacity: baseOpacity + Math.random() * 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.015,
    layer,
  };
}

export const PremiumHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const [titleNumber, setTitleNumber] = useState(0);

  const LAYERS = 3;
  const BEAMS_PER_LAYER = 8;

  const aiTitles = ["ScaleShop", "Modern Stores", "High Conversion", "Scale Aggressive", "Automation"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const noiseCanvas = noiseRef.current;
    if (!canvas || !noiseCanvas) return;
    const ctx = canvas.getContext("2d");
    const nCtx = noiseCanvas.getContext("2d");
    if (!ctx || !nCtx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      noiseCanvas.width = window.innerWidth * dpr;
      noiseCanvas.height = window.innerHeight * dpr;
      noiseCanvas.style.width = `${window.innerWidth}px`;
      noiseCanvas.style.height = `${window.innerHeight}px`;
      nCtx.setTransform(1, 0, 0, 1, 0, 0);
      nCtx.scale(dpr, dpr);

      beamsRef.current = [];
      for (let layer = 1; layer <= LAYERS; layer++) {
        for (let i = 0; i < BEAMS_PER_LAYER; i++) {
          beamsRef.current.push(createBeam(window.innerWidth, window.innerHeight, layer));
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const generateNoise = () => {
      const imgData = nCtx.createImageData(noiseCanvas.width, noiseCanvas.height);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255;
        imgData.data[i] = v;
        imgData.data[i + 1] = v;
        imgData.data[i + 2] = v;
        imgData.data[i + 3] = 12;
      }
      nCtx.putImageData(imgData, 0, 0);
    };

    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, beam.y);
      ctx.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity = Math.min(1, beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.4));
      const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);
      
      // TikTok Brand Colors for beams
      gradient.addColorStop(0, `rgba(255, 0, 80, 0)`);
      gradient.addColorStop(0.2, `rgba(255, 0, 80, ${pulsingOpacity * 0.3})`);
      gradient.addColorStop(0.5, `rgba(255, 0, 80, ${pulsingOpacity * 0.6})`);
      gradient.addColorStop(0.8, `rgba(0, 242, 234, ${pulsingOpacity * 0.3})`); // Cyber Cyan
      gradient.addColorStop(1, `rgba(0, 242, 234, 0)`);

      ctx.fillStyle = gradient;
      ctx.filter = `blur(${2 + beam.layer * 2}px)`;
      ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      ctx.restore();
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#050505");
      gradient.addColorStop(1, "#111111");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      beamsRef.current.forEach((beam) => {
        beam.y -= beam.speed * (beam.layer / LAYERS + 0.5);
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -50) {
          beam.y = window.innerHeight + 50;
          beam.x = Math.random() * window.innerWidth;
        }
        drawBeam(beam);
      });

      generateNoise();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleNumber((prev) => (prev + 1) % aiTitles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-[#050505]">
      <canvas ref={noiseRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Rotating Earth Background */}
      <div className="absolute inset-0 z-[15] flex items-center justify-center lg:justify-end opacity-40 pointer-events-none overflow-hidden mix-blend-screen mask-image:linear-gradient(to_bottom,transparent,black,transparent)">
        <RotatingEarth className="w-[800px] lg:w-[1000px] h-[800px] lg:h-[1000px] lg:translate-x-1/4" />
      </div>

      <div className="relative z-20 flex h-full w-full items-center justify-center px-6 text-center pointer-events-none">
        <div className="container mx-auto flex flex-col items-center gap-10 text-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="secondary" size="sm" className="gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-widest px-4 py-2 opacity-80 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-[#ff0050]" /> Escala Infinita com IA <MoveRight className="w-3 h-3" />
            </Button>
          </motion.div>

          <h1 className="text-4xl md:text-8xl max-w-4xl tracking-tighter font-black uppercase text-white leading-[0.9]">
            <span>Domine o</span><br/>
            <span className="relative flex w-full justify-center overflow-hidden h-[1.1em] py-1">
              {aiTitles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute text-transparent bg-clip-text bg-gradient-to-r from-[#ff0050] to-[#00f2ea]"
                  initial={{ opacity: 0, y: 100 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -100 : 100, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p 
            className="text-base md:text-xl leading-relaxed tracking-tight text-gray-400 max-w-2xl text-center font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
           A plataforma definitiva para criar lojas ScaleShop de alta conversão em segundos. 
           Design perfeito, automação inteligente e lucro máximo.
          </motion.p>

          <motion.div 
            className="flex flex-row gap-4 flex-wrap justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button size="lg" className="gap-4 group bg-[#ff0050] hover:bg-[#ff0050]/90 text-white font-black uppercase tracking-widest shadow-[0_0_40px_rgba(255,0,80,0.3)]">
              Começar Agora <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="gap-4 font-black uppercase tracking-widest border-white/10 hover:bg-white/5">
              Ver Demonstração
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-15" />
    </div>
  );
};
