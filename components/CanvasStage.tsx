
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CanvasFloatingControls, DevourerHUD, ReconHUD, FilterHUD } from './PanelShared.tsx';
import { PanelMode, ExtractionResult } from '../types.ts';

interface CanvasStageProps {
  uploadedImage: string | null;
  generatedOutput: string | null;
  isProcessing: boolean;
  devourerStatus: string;
  isValidationError: boolean;
  uiRefined?: boolean;
  onClear: () => void;
  onGenerate: () => void;
  onFileUpload: (file: File) => void;
  mode: PanelMode;
  onDownload?: () => void;
  integrity?: number;
  activeDna?: ExtractionResult | null;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  uploadedImage,
  generatedOutput,
  isProcessing,
  devourerStatus,
  isValidationError,
  uiRefined,
  onClear,
  onGenerate,
  onFileUpload,
  mode,
  integrity,
  activeDna
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = useCallback(() => {
    const dataUrl = generatedOutput || uploadedImage;
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    link.download = `HYPERXGEN_${mode.toUpperCase()}_${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedOutput, uploadedImage, mode]);

  const handleClick = (e: React.MouseEvent) => {
    // If it's a floating control click, don't trigger expansion/upload
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (uploadedImage || generatedOutput) {
      setIsExpanded(true);
    } else if (!isCameraActive) {
      fileInputRef.current?.click();
    }
  };

  const toggleCamera = async () => {
    if (isCameraActive) {
      if (cameraRef.current?.srcObject) {
        (cameraRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
          setIsCameraActive(true);
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
  };

  const captureFrame = () => {
    if (cameraRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = cameraRef.current.videoWidth;
        canvasRef.current.height = cameraRef.current.videoHeight;
        context.drawImage(cameraRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            onFileUpload(file);
            toggleCamera();
          });
      }
    }
  };

  const processFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  const renderHUD = () => {
    switch (mode) {
      case PanelMode.EXTRACTOR:
        return <ReconHUD reconStatus={devourerStatus} uploadedImage={uploadedImage} />;
      case PanelMode.FILTERS:
        return <FilterHUD filterStatus={devourerStatus} uploadedImage={uploadedImage} />;
      case PanelMode.IMAGE_FORGE:
      case PanelMode.VECTOR:
      case PanelMode.TYPOGRAPHY:
        return <DevourerHUD mode={mode} devourerStatus={devourerStatus} generatedOutput={generatedOutput} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-4">
      <div className="hx-container">
        <div
          className={`canvas-stage hyperx-canvas-box bg-brandCharcoal dark:bg-zinc-900 border-4 border-brandCharcoal dark:border-zinc-800 shadow-[16px_16px_0px_0px_rgba(45,45,47,0.2)] cursor-pointer group transition-all duration-500
            ${uiRefined ? 'shadow-[0_0_50px_rgba(253,30,74,0.15)] scale-[1.01]' : ''}
            ${showGrid ? 'grid-overlay' : ''}`} 
          onClick={handleClick}
        >
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={processFile} />
          <canvas ref={canvasRef} className="hidden" />
          
          <CanvasFloatingControls 
            onClear={onClear} 
            onUndo={() => {}} 
            onRedo={() => {}} 
            onDownload={(generatedOutput || uploadedImage) ? handleDownload : undefined}
            onToggleGrid={() => setShowGrid(!showGrid)}
            showGrid={showGrid}
            onToggleCamera={toggleCamera}
            isCameraActive={isCameraActive}
          />

          {renderHUD()}

          {/* DNA Watermark Indicator */}
          {activeDna && !isProcessing && (
            <div className="absolute top-4 right-4 z-[70] flex items-center gap-2 bg-brandCharcoal/60 dark:bg-zinc-900/60 backdrop-blur-md px-2.5 py-1 border border-brandRed/30 rounded-full animate-in fade-in slide-in-from-right-2 duration-700 no-swipe pointer-events-none">
              <div className="w-1.5 h-1.5 bg-brandRed rounded-full animate-pulse shadow-[0_0_5px_#FD1E4A]" />
              <span className="text-[7px] font-black uppercase text-brandNeutral/80 dark:text-white/80 tracking-widest leading-none">DNA_SYNC_ACTIVE</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-brandCharcoal/95 dark:bg-zinc-950/95 z-[60] flex flex-col items-center justify-center animate-fade-in p-4 text-center overflow-hidden">
              <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                <div className="absolute inset-0 border-4 border-brandRed border-t-transparent rounded-full animate-spin-slow shadow-[0_0_30px_rgba(253,30,74,0.4)]" />
                <div className="absolute inset-4 border-2 border-brandYellow/40 border-b-transparent rounded-full animate-spin-reverse-slow" />
                <div className="relative w-20 h-20 bg-brandCharcoal dark:bg-zinc-900 border border-white/10 flex flex-col items-center justify-center rounded-full shadow-inner">
                  <span className="text-brandRed text-2xl font-black italic tracking-tighter">
                    {mode === PanelMode.VECTOR ? 'V' : mode === PanelMode.TYPOGRAPHY ? 'T' : mode === PanelMode.EXTRACTOR ? 'E' : mode === PanelMode.IMAGE_FORGE ? 'F' : 'H'}
                  </span>
                </div>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brandRed to-transparent animate-scan" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brandRed animate-pulse">
                  {devourerStatus.includes("DEVOURING") ? "SYNTHESIZING_LATTICE" :
                   devourerStatus.includes("AUDITING") ? "DECODING_VISUAL_DNA" :
                   devourerStatus.includes("TRANSFORMATION") ? "RE-FORGING_PIXELS" :
                   "EXECUTING_KERNEL_CMD"}
                </span>
                <p className="text-[7px] text-brandNeutral/40 dark:text-white/20 mt-3 font-mono uppercase tracking-widest">
                  Integrity: {integrity || 100}%
                </p>
              </div>
            </div>
          )}

          <div className="w-full h-full flex items-center justify-center overflow-hidden p-0 relative">
            {isCameraActive && (
              <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
                <video ref={cameraRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); captureFrame(); }} 
                  className="absolute bottom-6 w-16 h-16 bg-white border-4 border-brandRed rounded-full shadow-2xl active:scale-95 transition-transform"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleCamera(); }} 
                  className="absolute top-6 right-6 px-3 py-1 bg-brandRed text-white text-[10px] font-black uppercase"
                >
                  Close
                </button>
              </div>
            )}

            {isValidationError ? (
              <div className="flex flex-col items-center text-center max-w-xs px-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 bg-brandRed/10 flex items-center justify-center rounded-full mb-3">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FD1E4A" strokeWidth="3"><path d="M12 8v4m0 4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/></svg>
                </div>
                <span className="text-brandRed font-black text-xl uppercase italic mb-1 tracking-tighter">NULL_SYNTHESIS</span>
                <button onClick={onGenerate} className="px-6 py-2 bg-brandCharcoal dark:bg-zinc-800 text-brandYellow text-[9px] font-black uppercase border-2 border-brandRed hover:bg-brandRed hover:text-white transition-all">
                  RE_SYNC
                </button>
              </div>
            ) : (generatedOutput || uploadedImage) ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={generatedOutput || uploadedImage || ''} 
                  className="w-full h-full object-contain animate-in zoom-in duration-700 select-none" 
                  alt="Synthesis Result" 
                />
                {generatedOutput && activeDna && (
                  <div className="absolute bottom-4 left-4 z-[70] flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-1000 pointer-events-none">
                    <div className="w-1 h-1 bg-brandRed rounded-full shadow-[0_0_5px_#FD1E4A]" />
                    <span className="text-[6px] font-black text-white/40 tracking-[0.3em] uppercase italic">DNA_VERIFIED</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="awaiting-buffer-input group/empty">
                <div className="w-16 h-16 border-2 border-dashed border-white/5 rounded-full flex items-center justify-center group-hover/empty:border-brandRed/20 transition-all duration-700">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20 group-hover/empty:text-brandRed/40 transition-all duration-700">
                     <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 mt-4 text-center">
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20 group-hover/empty:text-brandRed/60 transition-all">AWAITING_INPUT</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expand Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-2xl flex flex-col p-6 sm:p-10 animate-in fade-in duration-300"
          onClick={() => setIsExpanded(false)}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase text-brandRed tracking-[0.4em] mb-1">DETAILED_VISUAL_AUDIT</span>
              <h3 className="text-white font-black italic text-xl tracking-tighter uppercase">{mode} Synthesis Result</h3>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 text-white rounded-sm hover:bg-brandRed hover:border-brandRed transition-all"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center overflow-hidden border-2 border-white/5 rounded-sm bg-brandCharcoal/40">
            <img 
              src={generatedOutput || uploadedImage || ''} 
              className="max-w-full max-h-full object-contain animate-in zoom-in duration-500"
              alt="Expanded Preview"
            />
            {/* Expand HUD Data */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md p-4 border border-white/10 rounded-sm">
                <span className="text-[7px] font-black text-brandYellow uppercase tracking-widest block mb-2">METADATA_EXTRACT</span>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[9px] font-bold text-white/60">
                   <div className="flex flex-col"><span className="text-white/20 text-[6px]">FORMAT</span>PNG_64</div>
                   <div className="flex flex-col"><span className="text-white/20 text-[6px]">ENGINE</span>HYPERXGEN_V4.8</div>
                   <div className="flex flex-col"><span className="text-white/20 text-[6px]">STABILITY</span>{integrity || 100}%</div>
                   <div className="flex flex-col"><span className="text-white/20 text-[6px]">LATTICE</span>ACTIVE</div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDownload(); }}
                className="pointer-events-auto bg-brandRed text-white px-6 py-3 font-black uppercase text-[11px] italic tracking-widest rounded-sm hover:brightness-110 shadow-2xl flex items-center gap-3"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                DOWNLOAD_MANIFEST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
