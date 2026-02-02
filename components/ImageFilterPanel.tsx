
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { PanelMode, KernelConfig, PresetCategory } from '../types.ts';
import { FILTERS_PRESETS, HYPERX_SIGNATURE_FILTER } from '../constants.ts';
import { FilterHUD, GenerationBar, PresetCarousel, SparkleIcon } from './PanelShared.tsx';
import { CanvasStage } from './CanvasStage.tsx';
import { editImageWithAesthetic } from '../services/geminiService.ts';

interface ImageFilterPanelProps {
  onSaveToHistory?: (data: any) => void;
  kernelConfig: KernelConfig;
  integrity?: number;
  uiRefined?: boolean;
  onModeSwitch: (mode: PanelMode, data?: any) => void;
}

const applyFiltersToImage = (imageUrl: string, b: number, c: number, s: number, f: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      if (ctx) {
        ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) ${f}`;
        ctx.drawImage(img, 0, 0); resolve(canvas.toDataURL('image/png'));
      } else resolve(imageUrl);
    };
    img.src = imageUrl;
  });
};

export const ImageFilterPanel: React.FC<ImageFilterPanelProps> = ({ onSaveToHistory, integrity, uiRefined, kernelConfig, onModeSwitch }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [filterStatus, setFilterStatus] = useState("IDLE");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  const PRESETS = useMemo(() => {
    let base = [...FILTERS_PRESETS];
    if (base.length > 1) {
      base.splice(1, 0, HYPERX_SIGNATURE_FILTER);
    } else {
      base.push(HYPERX_SIGNATURE_FILTER);
    }
    return base;
  }, []);

  const handleApplyFilter = useCallback(async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setFilterStatus("APPLYING_TRANSFORMATION...");
    try {
      const activeFilter = PRESETS.flatMap(c => c.items).find(f => f.id === activeFilterId);
      const fCss = activeFilter?.filter || '';
      const result = await applyFiltersToImage(uploadedImage, brightness, contrast, saturation, fCss);
      setFilteredImage(result);
      setFilterStatus("TRANSFORMATION_COMPLETE");
    } catch (e) {
      setFilterStatus("TRANSFORMATION_FAILED");
    } finally { setIsProcessing(false); }
  }, [uploadedImage, brightness, contrast, saturation, activeFilterId, PRESETS]);

  const handleNeuralForge = useCallback(async () => {
    if (!uploadedImage) return;
    const activeFilter = PRESETS.flatMap(c => c.items).find(f => f.id === activeFilterId);
    if (!activeFilter) return;

    setIsForging(true);
    setIsProcessing(true);
    setFilterStatus("NEURAL_FORGING_SPECTRUM...");
    try {
      const result = await editImageWithAesthetic(uploadedImage, activeFilter.description, kernelConfig);
      setFilteredImage(result);
      setFilterStatus("NEURAL_FORGE_COMPLETE");
      
      onSaveToHistory?.({
        id: `filter-${Date.now()}`,
        name: `FORGED: ${activeFilter.name}`,
        type: PanelMode.FILTERS,
        generatedOutput: result,
        description: `Neural forge with ${activeFilter.name} aesthetic.`,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (e) {
      setFilterStatus("FORGE_FAILED");
    } finally {
      setIsForging(false);
      setIsProcessing(false);
    }
  }, [uploadedImage, activeFilterId, kernelConfig, onSaveToHistory, PRESETS]);

  return (
    <div className="flex flex-col h-full bg-brandNeutral font-sans overflow-y-auto custom-scrollbar">
      <main className="flex-1 flex flex-col py-4">
        <CanvasStage
          uploadedImage={uploadedImage}
          generatedOutput={filteredImage}
          isProcessing={isProcessing}
          devourerStatus={filterStatus}
          isValidationError={false}
          uiRefined={uiRefined}
          onClear={() => {
            setUploadedImage(null);
            setFilteredImage(null);
            setActiveFilterId(null);
            setFilterStatus("IDLE");
          }}
          onGenerate={handleApplyFilter}
          onFileUpload={(f) => {
            const r = new FileReader(); r.onload = (e) => {
                const base64 = e.target?.result as string;
                setUploadedImage(base64);
                setFilteredImage(base64);
                setFilterStatus("BUFFER_LOADED");
            }; 
            r.readAsDataURL(f);
          }}
          mode={PanelMode.FILTERS}
          integrity={integrity}
        />

        <div className="hx-container">
          <GenerationBar
            onGenerate={handleApplyFilter}
            isProcessing={isProcessing}
            refineButton={
              <button
                onClick={handleNeuralForge}
                disabled={!uploadedImage || !activeFilterId || isProcessing}
                className={`flex items-center gap-2 px-3 py-1.5 transition-all text-[9px] font-black uppercase rounded border
                  ${(uploadedImage && activeFilterId) 
                    ? 'border-brandRed text-brandRed hover:bg-brandRed hover:text-white' 
                    : 'border-brandCharcoal/10 text-brandCharcoal/20 cursor-not-allowed'}`}
                title="Neural Forge (Gemini Powered Enhancement)"
              >
                <SparkleIcon className={isForging ? 'animate-spin' : ''} />
                Neural_Forge
              </button>
            }
            additionalControls={
              <div className="flex-1 flex items-center gap-4 py-2">
                {[
                  { label: 'B', val: brightness, set: setBrightness },
                  { label: 'C', val: contrast, set: setContrast },
                  { label: 'S', val: saturation, set: setSaturation }
                ].map(s => (
                  <div key={s.label} className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[7px] font-black text-brandCharcoal/40 tracking-widest">{s.label}</span>
                      <span className="text-[7px] font-mono text-brandRed">{s.val}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      value={s.val} 
                      onChange={e => s.set(parseInt(e.target.value))} 
                      className="w-full h-1 bg-brandCharcoal/10 rounded-full appearance-none accent-brandRed cursor-pointer" 
                    />
                  </div>
                ))}
              </div>
            }
          />

          <PresetCarousel presets={PRESETS} activeId={activeFilterId} onSelect={setActiveFilterId} mode={PanelMode.FILTERS} />
        </div>
      </main>
    </div>
  );
};
