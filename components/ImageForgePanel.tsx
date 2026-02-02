
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PanelMode, KernelConfig, PresetCategory, ExtractionResult } from '../types.ts';
import { refineTextPrompt, synthesizeForgeImage } from '../services/geminiService.ts';
import { HYPERX_SIGNATURE_FORGE } from '../constants.ts';
import { GenerationBar, PresetCarousel, SparkleIcon, ForgeIcon, AdjustmentsIcon } from './PanelShared.tsx';
import { CanvasStage } from './CanvasStage.tsx';

interface ImageForgePanelProps {
  initialData?: any;
  onSaveToHistory?: (data: any) => void;
  kernelConfig: KernelConfig;
  integrity?: number;
  uiRefined?: boolean;
  onModeSwitch: (mode: PanelMode, data?: any) => void;
  globalDna?: ExtractionResult | null;
  hasProKey: boolean;
  onAuth: () => void;
}

export const ImageForgePanel: React.FC<ImageForgePanelProps> = ({ 
  initialData,
  onSaveToHistory,
  kernelConfig, 
  integrity, 
  globalDna,
  hasProKey,
  onAuth
}) => {
  const [prompt, setPrompt] = useState(""); 
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || null);
  const [resultUrl, setResultUrl] = useState<string | null>(initialData?.generatedOutput || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [forgeStatus, setForgeStatus] = useState("IDLE");
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);
  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);

  const PRESETS = useMemo(() => {
    return [
      HYPERX_SIGNATURE_FORGE,
      { 
        title: "Standard Library", 
        items: [
          { id: "f1", name: "Cinematic Landscape", description: "Hyper-realistic wide angle landscape with dramatic atmospheric lighting" },
          { id: "f2", name: "Cyberpunk Portrait", description: "Close-up portrait with neon highlights and futuristic mechanical accents" }
        ] 
      }
    ];
  }, []);

  const handleSelectPreset = useCallback((id: string) => {
    setActivePresetId(id);
    const item = PRESETS.flatMap(c => c.items).find(i => i.id === id);
    if (item) {
      setPrompt(item.description);
      if ((item as any).dna) setDna((item as any).dna);
    }
  }, [PRESETS]);

  const handleGenerate = async () => {
    if (!hasProKey) { onAuth(); return; }
    let effectivePrompt = prompt.trim() || PRESETS[1].items[0].description;
    setIsProcessing(true);
    setForgeStatus("SYNTHESIZING_LATTICE...");
    try {
      const result = await synthesizeForgeImage(effectivePrompt, aspectRatio, uploadedImage || undefined, kernelConfig, dna || undefined);
      setResultUrl(result);
      setForgeStatus("FORGE_COMPLETE");
      onSaveToHistory?.({
        name: prompt.substring(0, 30) || "Forge Synthesis",
        type: PanelMode.IMAGE_FORGE,
        generatedOutput: result,
        description: effectivePrompt
      });
    } catch (e) {
      setForgeStatus("FORGE_FAILED");
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="flex flex-col h-full bg-brandNeutral font-sans overflow-y-auto">
      <main className="flex-1 flex flex-col py-4">
        {!hasProKey && (
          <div className="absolute inset-0 z-[150] bg-brandCharcoal/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white border-4 border-brandRed p-10 text-center shadow-2xl rounded-sm">
              <h2 className="text-2xl font-black italic uppercase text-brandCharcoal tracking-tighter mb-4">Authorization_Required</h2>
              <p className="text-[10px] font-bold text-brandCharcoal/60 uppercase tracking-widest leading-loose mb-8">You must select a paid API key to access high-fidelity Pro Forge models.</p>
              <button onClick={onAuth} className="w-full py-4 bg-brandRed text-white font-black uppercase tracking-widest hover:brightness-110">Select_Pro_Key</button>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block mt-4 text-[8px] font-black uppercase text-brandRed underline tracking-widest">Billing Documentation</a>
            </div>
          </div>
        )}

        <CanvasStage
          uploadedImage={uploadedImage}
          generatedOutput={resultUrl}
          isProcessing={isProcessing}
          devourerStatus={forgeStatus}
          isValidationError={forgeStatus.includes("FAILED")}
          onClear={() => { setResultUrl(null); setUploadedImage(null); setForgeStatus("IDLE"); setPrompt(""); setActivePresetId(null); }}
          onGenerate={handleGenerate}
          onFileUpload={f => {
            const r = new FileReader();
            r.onload = e => setUploadedImage(e.target?.result as string);
            r.readAsDataURL(f);
          }}
          mode={PanelMode.IMAGE_FORGE}
          integrity={integrity}
        />

        <div className="hx-container">
          <GenerationBar
            prompt={prompt}
            setPrompt={setPrompt}
            onGenerate={handleGenerate}
            isProcessing={isProcessing}
            placeholder="Describe subject for visual synthesis..."
            additionalControls={
              <div className="flex gap-2">
                {["1:1", "16:9"].map(r => (
                  <button key={r} onClick={() => setAspectRatio(r)} className={`px-2 py-1 text-[9px] font-black border rounded-sm ${aspectRatio === r ? 'bg-brandRed text-white border-brandRed' : 'text-brandCharcoal/30 border-brandCharcoal/10'}`}>{r}</button>
                ))}
              </div>
            }
          />

           <PresetCarousel presets={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} />
        </div>
      </main>
    </div>
  );
};
