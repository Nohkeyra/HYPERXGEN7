import React, { useEffect, useRef, useState } from 'react';
import { PanelMode } from '../types.ts';

interface StartScreenProps {
  onSelectMode: (mode: PanelMode) => void;
  recentCount?: number;
  isDarkMode?: boolean;
}

const THEMES = [
  { color: "bg-brandYellow", textColor: "text-brandCharcoal" },
  { color: "bg-brandCharcoal dark:bg-zinc-800", textColor: "text-white" },
  { color: "bg-brandCharcoal dark:bg-zinc-800", textColor: "text-brandYellow" },
  { color: "bg-white dark:bg-zinc-900", textColor: "text-brandRed" },
  { color: "bg-brandRed", textColor: "text-white" },
  { color: "bg-brandCharcoal dark:bg-zinc-800", textColor: "text-brandRed" }
];

export const StartScreen: React.FC<StartScreenProps> = ({ onSelectMode, recentCount = 0, isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Shuffled themes on mount
  const [themes] = useState(() => {
    const shuffled = [...THEMES];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrame: number;
    let particles: { x: number, y: number, vx: number, vy: number, size: number, color: string }[] = [];
    const numParticles = 60; 
    
    const primaryColor = isDarkMode ? '#F4F4F5' : '#2D2D2F';
    const accentColor = '#FD1E4A';

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: numParticles }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        color: Math.random() > 0.85 ? accentColor : primaryColor
      }));
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; 
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.fillStyle = p.color; 
        ctx.globalAlpha = 0.15; 
        ctx.beginPath(); 
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); 
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          if (Math.abs(dx) < 160 && Math.abs(dy) < 160) {
             const dist = Math.sqrt(dx * dx + dy * dy);
             if (dist < 160) {
                ctx.beginPath(); 
                ctx.moveTo(p.x, p.y); 
                ctx.lineTo(p2.x, p2.y); 
                ctx.strokeStyle = accentColor; 
                ctx.globalAlpha = (1 - dist / 160) * 0.1; 
                ctx.lineWidth = 0.5; 
                ctx.stroke();
             }
          }
        }
      }
      animationFrame = requestAnimationFrame(draw);
    };
    init(); draw();
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', init); };
  }, [isDarkMode]);

  return (
    <div className="flex flex-col min-h-0 w-full bg-brandNeutral font-sans relative overflow-hidden transition-colors duration-300">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" />
      <div className="flex-1 overflow-y-auto no-scrollbar py-16">
        <div className="hx-container items-center justify-center text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brandRed via-brandYellow to-brandRed opacity-20" />
          
          <div className="flex flex-col items-center max-w-4xl w-full mb-16">
            <div className="relative inline-block mb-10">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-brandCharcoal dark:bg-zinc-800 border-[8px] sm:border-[12px] border-brandRed flex items-center justify-center mx-auto shadow-[16px_16px_0px_0px_#FD1E4A] hover:translate-x-1.5 hover:translate-y-1.5 transition-transform duration-500 cursor-pointer group rounded-sm">
                 <svg className="group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out" width="50" height="50" viewBox="0 0 240 240" fill="none" stroke="#FABD0D" strokeWidth="4"><path d="M120 20L150 100H230L165 150L190 230L120 180L50 230L75 150L10 100H90L120 20Z" fill="currentColor" /></svg>
              </div>
              <div className="absolute -bottom-3 -right-6 bg-brandYellow text-brandCharcoal text-[9px] font-black uppercase px-3 py-1.5 italic tracking-widest shadow-lg rounded-sm border-2 border-brandCharcoal">Engine_v4.8</div>
            </div>
            <h1 className="text-5xl xs:text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-brandCharcoal dark:text-white italic uppercase leading-[0.8] select-none mb-8">HYPER<span className="text-brandRed">X</span>GEN</h1>
            <div className="flex flex-wrap items-center justify-center gap-10">
               <div className="flex flex-col items-start border-l-2 border-brandRed pl-4">
                 <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-brandCharcoal/40 dark:text-white/40 leading-none mb-1">Architectural_Engine</p>
                 <span className="text-[9px] font-bold text-brandRed uppercase tracking-widest">LATTICE_SYNC_OK</span>
               </div>
               {recentCount > 0 && (
                 <div className="flex items-center gap-3 bg-brandCharcoal dark:bg-zinc-800 p-2 px-5 rounded-full border-2 border-brandRed/20 shadow-xl">
                   <div className="w-2.5 h-2.5 bg-brandRed rounded-full animate-ping"></div>
                   <span className="text-[10px] font-black text-brandNeutral dark:text-white uppercase tracking-[0.2em]">{recentCount} ACTIVE_NODES</span>
                 </div>
               )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-20">
            <ModeCard title="Vector" subtitle="Deterministic geometry" color={themes[0].color} textColor={themes[0].textColor} icon="📐" onClick={() => onSelectMode(PanelMode.VECTOR)} />
            <ModeCard title="Typo" subtitle="Wordmark architecture" color={themes[1].color} textColor={themes[1].textColor} icon="✍️" onClick={() => onSelectMode(PanelMode.TYPOGRAPHY)} />
            <ModeCard title="Mono" subtitle="Geometric seals" color={themes[2].color} textColor={themes[2].textColor} icon="Ⓜ️" onClick={() => onSelectMode(PanelMode.MONOGRAM)} />
            <ModeCard title="Extract" subtitle="Forensic deconstruction" color={themes[3].color} textColor={themes[3].textColor} icon="🧠" onClick={() => onSelectMode(PanelMode.EXTRACTOR)} />
            <ModeCard title="Forge" subtitle="Visual synthesis core" color={themes[4].color} textColor={themes[4].textColor} icon="⚡" onClick={() => onSelectMode(PanelMode.IMAGE_FORGE)} />
            <ModeCard title="Filters" subtitle="Lattice transformation" color={themes[5].color} textColor={themes[5].textColor} icon="🎞️" onClick={() => onSelectMode(PanelMode.FILTERS)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ModeCard = ({ title, subtitle, color, textColor = 'text-brandCharcoal', onClick, icon }: any) => (
  <button onClick={onClick} className={`relative group p-8 flex flex-col justify-between text-left transition-all duration-300 border-4 border-brandCharcoal dark:border-white/10 rounded-sm ${color} ${textColor} shadow-[16px_16px_0px_0px_#2D2D2F] dark:shadow-none hover:shadow-[24px_24px_0px_0px_#2D2D2F] dark:hover:shadow-[0px_0px_30px_rgba(255,255,255,0.1)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none h-48 sm:h-56`}>
    <div className="absolute top-6 right-6 text-5xl opacity-20 group-hover:scale-110 transition-transform">{icon}</div>
    <div className="space-y-2">
      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase italic tracking-tighter leading-none">{title}</h3>
      <div className="h-1 w-10 bg-brandCharcoal/20 dark:bg-white/20 group-hover:w-full transition-all duration-500" />
    </div>
    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{subtitle}</p>
  </button>
);