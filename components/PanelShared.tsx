
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { LogEntry, KernelConfig, PresetCategory, PanelMode, CloudArchiveEntry, CloudRepairSummary, CloudRefineSummary, PanelPersona, ExtractionResult } from '../types.ts';

// ============================================================================
// OMEGA SYSTEM HUD COMPONENTS (CORE EXPORTS)
// ============================================================================

export const DevourerHUD: React.FC<{mode: PanelMode, devourerStatus: string, generatedOutput?: string | null}> = memo(({ mode, devourerStatus }) => (
  <div className="absolute top-6 left-6 z-[65] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-none">
    <div className="w-8 h-8 flex items-center justify-center bg-brandCharcoal border-2 border-brandRed text-brandNeutral text-[10px] font-black italic shadow-xl rounded-sm">
      {mode === PanelMode.VECTOR ? 'V' : mode === PanelMode.TYPOGRAPHY ? 'T' : mode === PanelMode.MONOGRAM ? 'M' : mode === PanelMode.IMAGE_FORGE ? 'F' : 'H'}
    </div>
    <div className="flex flex-col bg-brandCharcoal/80 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 border border-white/5 rounded-sm shadow-2xl">
      <span className="text-[7px] font-black uppercase text-brandRed leading-none mb-0.5 tracking-[0.2em] italic">SYNSYS_STATE</span>
      <span className={`text-[9px] font-black uppercase tracking-widest ${devourerStatus.includes('STARVING') ? 'text-white/60' : 'text-green-500 animate-pulse'}`}>{devourerStatus}</span>
    </div>
  </div>
));

export const ReconHUD: React.FC<{reconStatus: string, uploadedImage?: string | null}> = memo(({ reconStatus }) => (
  <div className="absolute top-6 left-6 z-[65] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-none">
    <div className="w-8 h-8 bg-brandCharcoal border-2 border-brandRed text-brandNeutral flex items-center justify-center text-[10px] font-black italic shadow-xl rounded-sm">E</div>
    <div className="flex flex-col bg-brandCharcoal/80 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 border border-white/5 rounded-sm shadow-2xl">
      <span className="text-[7px] font-black uppercase text-brandRed leading-none mb-0.5 tracking-[0.2em] italic">RECON_STATE</span>
      <span className="text-[9px] font-black uppercase tracking-widest text-brandYellowDark animate-pulse">{reconStatus}</span>
    </div>
  </div>
));

export const FilterHUD: React.FC<{filterStatus: string, uploadedImage?: string | null}> = memo(({ filterStatus }) => (
  <div className="absolute top-6 left-6 z-[65] flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 pointer-events-none">
    <div className="w-8 h-8 bg-brandCharcoal border-2 border-brandRed text-brandNeutral flex items-center justify-center text-[10px] font-black italic shadow-xl rounded-sm">I</div>
    <div className="flex flex-col bg-brandCharcoal/80 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1 border border-white/5 rounded-sm shadow-2xl">
      <span className="text-[7px] font-black uppercase text-brandRed leading-none mb-0.5 tracking-[0.2em] italic">FILTER_STATE</span>
      <span className="text-[9px] font-black uppercase tracking-widest text-brandYellowDark animate-pulse">{filterStatus}</span>
    </div>
  </div>
));

export const CanvasFloatingControls: React.FC<{onClear: () => void, onUndo: () => void, onRedo: () => void, onDownload?: () => void, onToggleGrid?: () => void, showGrid?: boolean, onToggleCamera?: () => void, isCameraActive?: boolean}> = memo(({ onClear, onDownload, onToggleGrid, showGrid, onToggleCamera, isCameraActive }) => (
  <div className="absolute bottom-6 right-6 z-[70] flex flex-col gap-2">
    {onDownload && <button onClick={onDownload} className="w-9 h-9 flex items-center justify-center bg-brandCharcoal dark:bg-zinc-800 border border-white/10 text-brandYellow hover:text-white hover:bg-brandCharcoal/100 hover:border-brandYellow transition-all rounded-sm shadow-xl" title="Export Manifest"><DownloadIcon className="w-4 h-4" /></button>}
    {onToggleGrid && <button onClick={onToggleGrid} className={`w-9 h-9 flex items-center justify-center bg-brandCharcoal dark:bg-zinc-800 border transition-all rounded-sm shadow-xl ${showGrid ? 'text-brandRed border-brandRed' : 'text-white/60 border-white/10 hover:text-white hover:bg-brandCharcoal/100'}`} title="Grid Lattice Overlay"><GridIcon className="w-4 h-4" /></button>}
    {onToggleCamera && <button onClick={onToggleCamera} className={`w-9 h-9 flex items-center justify-center bg-brandCharcoal dark:bg-zinc-800 border transition-all rounded-sm shadow-xl ${isCameraActive ? 'text-brandYellow border-brandYellow' : 'text-white/60 border-white/10 hover:text-white hover:bg-brandCharcoal/100'}`} title="Optical Buffer Input"><CameraIcon className="w-4 h-4" /></button>}
    <button onClick={onClear} className="w-9 h-9 flex items-center justify-center bg-brandCharcoal dark:bg-zinc-800 border border-white/10 text-brandRed/60 hover:text-white hover:bg-brandRed hover:border-brandRed transition-all rounded-sm shadow-xl" title="Purge Buffer"><TrashIcon className="w-4 h-4" /></button>
  </div>
));

// ============================================================================
// SHARED ICONS (MEMOIZED)
// ============================================================================

export const TrashIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 01 2-2h4a2 2 0 01 2 2v2"/>
  </svg>
));

export const CameraIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
));

export const UploadIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5-5 5 5m-5-5v12"/></svg>
));

export const AdjustmentsIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>
  </svg>
));

export const DownloadIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
));

export const VectorIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2L2 22h20L12 2z"/>
  </svg>
));

export const TypographyIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
  </svg>
));

export const MonogramIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <path d="M9 15V9l3 3 3-3v6" />
  </svg>
));

export const ExtractorIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M11 20H4a2 2 0 01-2-2V6a2 2 0 012-2h7M17 7l5 5-5 5M12 12h9"/>
  </svg>
));

export const ForgeIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M2 3h4L9 12l-3 9H2l3-9L2 3zM22 3h-4l-3 9 3 9h4l-3-9 3-9zM12 21V3"/>
  </svg>
));

export const FilterIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 1v22M17 5l-5-4-5 4M17 19l-5 4-5-4M2 12h20"/>
  </svg>
));

export const GridIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M3 3h18v18H3zM12 3v18M3 12h18"/>
  </svg>
));

export const StarIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2L2 22h20L12 2z"/>
  </svg>
));

export const SparkleIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </svg>
));

export const BoxIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
));

export const LeafIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M2 22s12-5 15-11a5 5 0 00-10-1 15 15 0 00-5 12zM12 10.6V22"/>
  </svg>
));

export const ShapesIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
));

export const PulseIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
));

export const SunIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
));

export const MoonIcon = memo((props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
));

// ============================================================================
// STRUCTURAL LAYOUT COMPONENTS
// ============================================================================

export const ThemeToggle: React.FC<{isDarkMode: boolean, onToggle: () => void}> = memo(({ isDarkMode, onToggle }) => (
  <button 
    onClick={onToggle} 
    className={`w-9 h-9 flex items-center justify-center rounded-sm transition-all border group shadow-lg backdrop-blur-md
      ${isDarkMode 
        ? 'bg-black/40 border-brandYellow/50 hover:bg-black/60 hover:border-brandYellow' 
        : 'bg-white/80 border-brandCharcoal/20 hover:bg-white hover:border-brandCharcoal'
      }
    `}
    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
  >
    {isDarkMode ? (
      <SunIcon className="w-4 h-4 text-brandYellow group-hover:scale-110 transition-transform duration-300" />
    ) : (
      <MoonIcon className="w-4 h-4 text-brandCharcoal group-hover:scale-110 transition-transform duration-300" />
    )}
  </button>
));

interface PanelHeaderProps {
  title: string;
  onBack?: () => void;
  onStartRepair?: () => void;
  onStartRefine?: () => void;
  integrity?: number;
}

export const PanelHeader: React.FC<PanelHeaderProps> = memo(({ 
  title, 
  onBack, 
  onStartRepair, 
  onStartRefine, 
  integrity,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[var(--header-h)] bg-brandCharcoal dark:bg-[#18181b] dark:border-white/10 flex z-[100] border-b border-white/5 shadow-2xl backdrop-blur-xl bg-opacity-95">
      <div className="hx-container flex-row items-center justify-between h-full py-0">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-3 h-3">
               <div className="absolute inset-0 bg-brandRed rounded-full animate-ping opacity-20"></div>
               <div className="relative w-3 h-3 bg-brandRed rounded-full shadow-[0_0_8px_rgba(253,30,74,0.8)]"></div>
            </div>
            <div className="font-black text-sm tracking-[0.3em] text-brandNeutral dark:text-white uppercase italic group-hover:text-brandYellow transition-colors duration-300">
              {title}
            </div>
          </button>
        </div>

        <div className="flex items-center gap-6">
          {typeof integrity === 'number' && (
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[7px] font-black uppercase text-white/30 tracking-widest leading-none mb-1">Stability_Core</span>
              <div className={`text-[10px] font-black uppercase italic ${integrity < 100 ? 'text-brandRed animate-pulse' : 'text-green-400'}`}>
                {integrity}%_OK
              </div>
            </div>
          )}
          <div className="flex gap-2">
             {onStartRepair && (
               <button onClick={onStartRepair} className="w-9 h-9 flex items-center justify-center border border-white/10 bg-white/5 text-brandNeutral dark:text-white hover:border-brandRed hover:text-brandRed transition-all rounded-sm group" title="Kernel Repair">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-12 transition-transform"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
               </button>
             )}
             {onStartRefine && (
               <button onClick={onStartRefine} className="w-9 h-9 flex items-center justify-center border border-white/10 bg-white/5 text-brandNeutral dark:text-white hover:border-brandYellow hover:text-brandYellow transition-all rounded-sm group" title="UI Refinement">
                 <StarIcon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" /> 
               </button>
             )}
          </div>
        </div>
      </div>
    </header>
  );
});

export const GenerationBar: React.FC<{onGenerate: () => void, isProcessing: boolean, prompt?: string, setPrompt?: (v: string) => void, placeholder?: string, refineButton?: React.ReactNode, additionalControls?: React.ReactNode}> = memo(({ 
  onGenerate, 
  isProcessing, 
  prompt, 
  setPrompt, 
  placeholder, 
  refineButton,
  additionalControls
}) => {
  const showPromptInput = prompt !== undefined && setPrompt !== undefined;

  return (
    <div className="input-box-fixed flex flex-col gap-4 p-5 lg:p-7 bg-brandNeutral/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-brandCharcoal/10 dark:border-white/10 shadow-2xl rounded-sm">
      <div className="relative w-full group">
        <div className="flex flex-col sm:flex-row items-stretch gap-0 border-2 border-brandCharcoal dark:border-zinc-700 bg-white dark:bg-black shadow-[10px_10px_0px_0px_rgba(45,45,47,0.08)] dark:shadow-none focus-within:shadow-[10px_10px_0px_0px_rgba(253,30,74,0.1)] transition-all duration-300 rounded-sm">
          {showPromptInput && (
            <input
              type="text"
              value={prompt || ''}
              onChange={e => setPrompt && setPrompt(e.target.value)}
              placeholder={placeholder || "Enter constraints..."}
              className="flex-1 px-5 py-4 text-sm font-bold bg-transparent text-brandCharcoal dark:text-white placeholder:text-brandCharcoalSoft focus:outline-none min-w-0"
            />
          )}
          {!showPromptInput && !additionalControls && (
             <div className="flex-1 px-5 py-4 text-[11px] font-black uppercase text-brandCharcoalSoft italic flex items-center tracking-widest">
                MANUAL_CONTROL_PROTOCOL_ACTIVE
             </div>
          )}
          
          {additionalControls && (
            <div className="flex-1 flex items-center justify-center px-5 bg-brandCharcoal/[0.03] dark:bg-white/5 border-t sm:border-t-0 sm:border-l border-brandCharcoal/10 dark:border-white/10 overflow-x-auto no-scrollbar py-2 sm:py-0">
              {additionalControls}
            </div>
          )}

          <div className="flex items-center justify-center px-3 bg-brandCharcoal/[0.03] dark:bg-white/5 border-t sm:border-t-0 sm:border-l border-brandCharcoal/10 dark:border-white/10 shrink-0 py-2 sm:py-0">
            {refineButton}
          </div>
        </div>
      </div>

      <button
        onClick={(e) => { e.preventDefault(); onGenerate(); }}
        disabled={isProcessing}
        className={`w-full py-5 font-black uppercase text-xs sm:text-base italic tracking-[0.35em] transition-all relative overflow-hidden group rounded-sm shadow-xl
          ${isProcessing 
            ? 'bg-brandCharcoal dark:bg-zinc-800 text-brandYellow cursor-wait' 
            : 'bg-brandRed text-brandNeutral hover:bg-brandCharcoal dark:hover:bg-zinc-800 hover:text-brandRed active:translate-y-1 active:shadow-none'}
        `}
      >
        <span className="relative z-10">{isProcessing ? 'CALIBRATING_SYNSYS...' : 'EXECUTE_OMEGA_SYNTHESIS'}</span>
        {!isProcessing && <div className="absolute inset-0 bg-brandYellow translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
      </button>
    </div>
  );
});

export const CategoryBlock: React.FC<{title: string, isFeatured?: boolean}> = memo(({ title }) => {
  const isSignature = title.includes('SIGNATURE');
  return (
    <div className={`shrink-0 flex items-center px-3 py-2 min-h-[40px] min-w-[100px] rounded-sm transition-all
      bg-brandCharcoal dark:bg-zinc-800 text-white border-l-2 ${isSignature ? 'border-brandRed' : 'border-brandYellow/30'}
    `}>
       <div className="flex flex-col w-full">
          <span className="text-[6px] font-black uppercase tracking-widest text-brandYellow opacity-90 mb-0.5">
             {isSignature ? 'PRO_LATTICE' : 'BASAL_DNA'}
          </span>
          <span className="text-[8px] font-black uppercase tracking-tighter break-words line-clamp-2 overflow-hidden drop-shadow-sm">
             {title}
          </span>
       </div>
    </div>
  );
});

export const AppControlsBar: React.FC<any> = memo(({
  recentWorks,
  savedPresets,
  cloudArchives,
  clearCloudArchives,
  onLoadCloudArchive,
  onLoadDNA,
  showLiveFeed,
  onToggleFeed,
  activeDna,
  onClearDna,
  isSaving,
  onForceSave,
  activeMode,
  onSwitchMode
}) => {
  const [showRecent, setShowRecent] = useState(false);
  const [showArchives, setShowArchives] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const totalCloudArchives = cloudArchives.length;

  const handleLoad = useCallback((e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    onLoadDNA(item);
    setShowRecent(false);
    setShowPresets(false);
    setShowArchives(false);
  }, [onLoadDNA]);

  const handleArchiveClick = useCallback((e: React.MouseEvent, archive: CloudArchiveEntry) => {
    e.preventDefault();
    e.stopPropagation();
    onLoadCloudArchive(archive);
    setShowArchives(false); // Close panel after loading
  }, [onLoadCloudArchive]);

  const renderHistoryItem = (item: any) => (
    <div key={item.id} className="history-item flex items-center justify-between group p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0 transition-colors" onClick={(e) => handleLoad(e, item)}>
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-9 h-9 shrink-0 bg-white/10 flex items-center justify-center text-[11px] font-black italic border border-white/10 group-hover:bg-brandRed group-hover:text-white transition-all rounded-sm">
          {item.type?.[0].toUpperCase() || 'DNA'}
        </div>
        <div className="history-info min-w-0 truncate">
          <span className="history-word truncate block text-[11px] font-bold text-white group-hover:text-brandYellow transition-colors uppercase tracking-tight">{item.name || item.type?.toUpperCase() || 'UNTITLED_BUFFER'}</span>
          <span className="text-[7px] text-white/40 uppercase font-black tracking-widest">{item.timestamp || 'REALTIME_STREAM'}</span>
        </div>
      </div>
      <button onClick={(e) => handleLoad(e, item)} className="shrink-0 px-3 py-1.5 bg-white/5 border border-white/10 text-[9px] font-black text-white/60 hover:bg-brandYellow hover:text-brandCharcoal hover:text-opacity-100 hover:border-brandYellow transition-all uppercase rounded-sm">Inject</button>
    </div>
  );

  const renderArchiveItem = (item: CloudArchiveEntry) => {
    const isRepair = item.type === 'RepairReport';
    const reportScore = isRepair ? (item as CloudRepairSummary).systemStabilityScore : (item as CloudRefineSummary).visualScore;
    const scoreColor = reportScore && reportScore < 50 ? 'text-brandRed' : reportScore && reportScore < 80 ? 'text-brandYellowDark' : 'text-green-500';

    return (
      <div key={item.id} className="history-item flex items-center justify-between group p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-b-0 transition-colors" onClick={(e) => handleArchiveClick(e, item)}>
        <div className="flex items-center gap-4 min-w-0">
          <div className={`w-9 h-9 shrink-0 bg-white/10 flex items-center justify-center text-[11px] font-black italic border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all rounded-sm ${isRepair ? 'text-green-400' : 'text-blue-400'}`}>
            {isRepair ? 'FIX' : 'UI'}
          </div>
          <div className="history-info min-w-0 truncate">
            <span className="history-word truncate block text-[11px] font-bold text-white group-hover:text-brandYellow transition-colors uppercase tracking-tight">
              {isRepair ? 'Lattice_Patch_Protocol' : 'UI_Optimization_Sync'}
            </span>
            <span className="text-[7px] text-white/40 uppercase font-black tracking-widest">
              {new Date(item.timestamp).toLocaleTimeString()} • <span className={scoreColor}>{isRepair ? `STABILITY: ${reportScore}%` : `VISUAL: ${reportScore}%`}</span>
            </span>
          </div>
        </div>
        <div className="text-[8px] font-black text-blue-500/50 uppercase italic shrink-0 tracking-widest">STORED_VAULT</div>
      </div>
    );
  };

  const modes = [
    { id: PanelMode.VECTOR, label: 'VECTOR', Icon: VectorIcon },
    { id: PanelMode.TYPOGRAPHY, label: 'TYPO', Icon: TypographyIcon },
    { id: PanelMode.MONOGRAM, label: 'MONO', Icon: MonogramIcon },
    { id: PanelMode.EXTRACTOR, label: 'EXTRACT', Icon: ExtractorIcon },
    { id: PanelMode.IMAGE_FORGE, label: 'FORGE', Icon: ForgeIcon },
    { id: PanelMode.FILTERS, label: 'FILTERS', Icon: FilterIcon }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[var(--app-controls-bar-h)] bg-brandCharcoal dark:bg-[#18181b] dark:border-white/10 flex flex-col sm:flex-row z-[120] border-t border-white/5 shadow-2xl backdrop-blur-xl bg-opacity-95 overflow-hidden">
      <div className="hx-container flex-col sm:flex-row h-full py-0 gap-0">
        {/* Group 1: Modes */}
        <div className="flex-none flex items-center gap-2 py-2 border-b sm:border-b-0 sm:border-r border-white/5 overflow-x-auto no-scrollbar pr-6">
          {onSwitchMode && modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onSwitchMode(m.id)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-2 rounded-sm border whitespace-nowrap ${
                activeMode === m.id 
                  ? 'bg-brandRed text-white border-brandRed shadow-[0_0_15px_rgba(253,30,74,0.3)]' 
                  : 'text-white/40 border-transparent hover:text-white/80 hover:bg-white/5'
              }`}
            >
              <m.Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="inline">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Group 2: Library & State */}
        <div className="flex-1 flex items-center justify-between min-w-0 pl-6 h-full">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button onClick={() => { setShowRecent(!showRecent); setShowPresets(false); setShowArchives(false); }} className={`relative px-4 py-2 border transition-all flex items-center gap-2.5 text-[10px] font-black uppercase whitespace-nowrap rounded-sm ${showRecent ? 'bg-brandRed border-brandRed text-white shadow-[0_0_12px_rgba(253,30,74,0.3)]' : 'bg-brandCharcoal dark:bg-white/5 border-white/10 text-brandNeutral dark:text-white hover:bg-white/5'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              History {recentWorks.length > 0 && <span className="w-4 h-4 text-[9px] flex items-center justify-center bg-white text-brandCharcoal rounded-full ml-1 font-black">{recentWorks.length}</span>}
            </button>
            <button onClick={() => { setShowPresets(!showPresets); setShowRecent(false); setShowArchives(false); }} className={`px-4 py-2 border transition-all flex items-center gap-2.5 text-[10px] font-black uppercase whitespace-nowrap rounded-sm ${showPresets ? 'bg-brandYellow border-brandYellow text-brandCharcoal shadow-[0_0_12px_rgba(250,189,13,0.3)]' : 'bg-brandCharcoal dark:bg-white/5 border-white/10 text-brandNeutral dark:text-white hover:bg-white/5'}`}>
              <StarIcon className="w-4 h-4" />
              Presets {savedPresets.length > 0 && <span className="w-4 h-4 text-[9px] flex items-center justify-center bg-brandCharcoal text-brandYellow rounded-full ml-1 font-black">{savedPresets.length}</span>}
            </button>
            <button onClick={() => { setShowArchives(!showArchives); setShowRecent(false); setShowPresets(false); }} className={`relative px-4 py-2 border transition-all flex items-center gap-2.5 text-[10px] font-black uppercase whitespace-nowrap rounded-sm ${showArchives ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'bg-brandCharcoal dark:bg-white/5 border-white/10 text-brandNeutral dark:text-white hover:bg-white/5'}`}>
              <BoxIcon className="w-4 h-4" />
              Archives {totalCloudArchives > 0 && <span className="w-4 h-4 text-[9px] flex items-center justify-center bg-brandCharcoal text-blue-400 rounded-full ml-1 font-black">{totalCloudArchives}</span>}
            </button>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-3 pr-4 border-r border-white/5">
               <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isSaving ? 'bg-brandYellow animate-ping' : 'bg-green-500'}`}></div>
                 <span className={`text-[8px] font-black uppercase tracking-widest hidden lg:inline ${isSaving ? 'text-brandYellow' : 'text-white/40'}`}>
                   {isSaving ? 'SYNCING...' : 'OK'}
                 </span>
               </div>
               <button 
                 onClick={onForceSave}
                 disabled={isSaving}
                 className="px-2 py-1 bg-brandRed/5 border border-brandRed/20 text-brandRed text-[8px] font-black uppercase hover:bg-brandRed hover:text-white transition-all rounded-sm italic tracking-widest"
               >
                 COMMIT
               </button>
            </div>
            
            <button onClick={onToggleFeed} className={`px-3 py-2 border transition-all flex items-center gap-2.5 text-[10px] font-black uppercase rounded-sm ${showLiveFeed ? 'bg-brandRed border-brandRed text-white shadow-[0_0_12px_rgba(253,30,74,0.3)]' : 'bg-brandCharcoal dark:bg-white/5 border-white/10 text-brandNeutral dark:text-white hover:bg-white/5'}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${showLiveFeed ? 'bg-white animate-pulse' : 'bg-brandNeutral/20'}`}></div>
              <span className="hidden xs:inline">Feed</span>
            </button>
          </div>
        </div>
      </div>

      {showRecent && (
        <div className="absolute bottom-[calc(100%+8px)] left-6 w-80 bg-brandCharcoal dark:bg-zinc-900 border-2 border-brandRed shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 max-h-96 overflow-y-auto custom-scrollbar z-[130] animate-in slide-in-from-bottom-4 duration-300 rounded-sm">
          <div className="flex justify-between items-center mb-3 px-3 py-1 border-b border-brandRed/20">
             <h4 className="text-[10px] font-black uppercase text-brandRed tracking-[0.2em] italic">Buffer_Cache</h4>
             <span className="text-[8px] font-bold text-white/30">{recentWorks.length}/15</span>
          </div>
          {recentWorks.length === 0 ? <p className="text-[10px] p-6 text-white/20 uppercase font-black text-center tracking-widest">Lattice_Empty</p> : recentWorks.map(renderHistoryItem)}
        </div>
      )}
      
      {showPresets && (
        <div className="absolute bottom-[calc(100%+8px)] left-6 w-80 bg-brandCharcoal dark:bg-zinc-900 border-2 border-brandYellow shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 max-h-96 overflow-y-auto custom-scrollbar z-[130] animate-in slide-in-from-bottom-4 duration-300 rounded-sm">
          <div className="flex justify-between items-center mb-3 px-3 py-1 border-b border-brandYellow/20">
             <h4 className="text-[10px] font-black uppercase text-brandYellow tracking-[0.2em] italic">Style_Archives</h4>
          </div>
          {savedPresets.length === 0 ? <p className="text-[10px] p-6 text-white/20 uppercase font-black text-center tracking-widest">No_Presets_Buffered</p> : savedPresets.map(renderHistoryItem)}
        </div>
      )}

      {showArchives && (
        <div className="absolute bottom-[calc(100%+8px)] left-6 w-80 bg-brandCharcoal dark:bg-zinc-900 border-2 border-blue-600 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 max-h-96 overflow-y-auto custom-scrollbar z-[130] animate-in slide-in-from-bottom-4 duration-300 rounded-sm">
          <div className="flex justify-between items-center mb-3 px-3 py-1 border-b border-blue-600/20">
             <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em] italic">Cloud_Vault_Manifest</h4>
             <button onClick={clearCloudArchives} className="text-[8px] font-bold text-white/30 hover:text-brandRed transition-colors uppercase">CLEAR_ALL</button>
          </div>
          {cloudArchives.length === 0 ? <p className="text-[10px] p-6 text-white/20 uppercase font-black text-center tracking-widest">Vault_Empty</p> : cloudArchives.map(renderArchiveItem)}
        </div>
      )}
    </div>
  );
});

export const LiveKernelFeed: React.FC<{logs: LogEntry[], onClose: () => void}> = memo(({ logs, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [logs]);
  return (
    <div className="fixed bottom-[var(--app-controls-bar-h)] right-6 w-80 h-72 bg-brandCharcoal dark:bg-zinc-900 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[140] flex flex-col rounded-sm overflow-hidden animate-in slide-in-from-right-8 duration-500">
      <div className="flex justify-between items-center p-4 border-b border-brandRed bg-brandCharcoal dark:bg-zinc-900 backdrop-blur-md">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-brandRed rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black uppercase text-brandRed tracking-[0.2em] italic">Kernel_Stream</span>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-[14px] uppercase text-white/30 hover:text-white transition-colors">×</button>
      </div>
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-2 text-[9px] font-mono custom-scrollbar bg-brandCharcoal/50 dark:bg-black/50">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/10 italic">Awaiting kernel signal...</div>
        ) : logs.map((log) => (
          <div key={log.id} className="flex gap-3 leading-relaxed border-l border-white/5 pl-3">
            <span className="shrink-0 text-white/20">[{log.timestamp}]</span>
            <span className={`${log.type === 'error' ? 'text-brandRed' : log.type === 'warning' ? 'text-brandYellow' : 'text-green-400'}`}>{log.message}</span>
          </div>
        ))}
      </div>
      <div className="h-1 bg-brandRed/20">
         <div className="h-full bg-brandRed animate-shimmer" style={{ width: '40%' }}></div>
      </div>
    </div>
  );
});

export const PresetCard: React.FC<any> = memo(({ name, description, isActive, onClick, icon }) => (
  <button 
    onClick={onClick} 
    className={`relative flex flex-col gap-0.5 text-left transition-all duration-300 border-l-2 rounded-sm group overflow-hidden
      ${isActive 
        ? 'p-3 border-brandRed bg-brandRed/10 shadow-[0_8px_20px_rgba(253,30,74,0.15)] ring-1 ring-brandRed/20 min-h-[60px]' 
        : 'p-1.5 border-black/5 dark:border-white/5 bg-white/5 hover:bg-white/10 hover:border-brandYellowDark/50 min-h-[34px]'
      }
    `}
  >
    <div className={`flex items-center gap-2 transition-all duration-300 ${isActive ? 'translate-y-0' : 'translate-y-0.5'}`}>
      {icon && (
        <div className={`shrink-0 transition-colors ${isActive ? 'text-brandRed' : 'text-brandCharcoal group-hover:text-brandRed dark:text-white'}`}>
          {React.cloneElement(icon as React.ReactElement, { className: isActive ? 'w-3 h-3' : 'w-2 h-2' })}
        </div>
      )}
      <h4 className={`font-black uppercase tracking-tight transition-all duration-300 ${isActive ? 'text-[10px] text-brandRed' : 'text-[8.5px] text-brandCharcoal group-hover:text-brandRed dark:text-white truncate flex-1'}`}>
        {name}
      </h4>
    </div>
    
    <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
      <div className="overflow-hidden">
        <p className="text-[8px] font-bold leading-tight text-brandCharcoal dark:text-white/80 italic border-l-2 border-brandRed/40 pl-2 pr-1 max-w-full break-words">
          {description}
        </p>
      </div>
    </div>
    
    {isActive && (
      <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-brandRed rounded-full shadow-[0_0_8px_#FD1E4A] animate-pulse" />
    )}
  </button>
));

export const PresetCarousel: React.FC<any> = memo(({ presets, activeId, onSelect, getIcon }) => {
  const shieldGestures = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="lg:hidden shrink-0 bg-brandCharcoal/5 dark:bg-white/5 backdrop-blur-md border-t-2 border-brandRed flex flex-col p-4 rounded-sm mb-4"
      onTouchStart={shieldGestures}
      onTouchMove={shieldGestures}
      onTouchEnd={shieldGestures}
    >
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-[8px] font-black uppercase text-brandYellowDark tracking-[0.4em] italic border-l-2 border-brandYellowDark pl-2">AESTHETIC_DNA_MATRIX</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-brandRed animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-brandYellowDark opacity-50" />
        </div>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto no-scrollbar gap-2 items-start px-1 pb-1">
          {presets.map((cat: any, cIdx: number) => (
            <React.Fragment key={`${cat.title}-${cIdx}`}>
              <CategoryBlock title={cat.title} />
              {cat.items.map((item: any) => (
                <div key={item.id} className={`${activeId === item.id ? 'min-w-[180px]' : 'min-w-[110px]'} shrink-0 transition-all duration-500`}>
                  <PresetCard 
                    name={item.name} 
                    description={item.description} 
                    isActive={activeId === item.id} 
                    onClick={() => onSelect(item.id)}
                    icon={getIcon?.(cat.title)}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
          <div className="min-w-[16px] shrink-0" />
        </div>
      </div>
    </div>
  );
});