
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, PresetItem, PresetCategory } from '../types.ts';
import { VECTOR_PRESETS, TYPOGRAPHY_PRESETS, MONOGRAM_PRESETS, HYPERX_SIGNATURE_VECTOR, HYPERX_SIGNATURE_TYPO, HYPERX_SIGNATURE_MONO } from '../constants.ts';
import { synthesizeVectorStyle, synthesizeTypoStyle, refineTextPrompt } from '../services/geminiService.ts';
import { 
  PresetCard, 
  GenerationBar, 
  PresetCarousel, 
  SparkleIcon, 
  BoxIcon, 
  LeafIcon, 
  ShapesIcon, 
  PulseIcon, 
  StarIcon, 
  ForgeIcon, 
  ExtractorIcon, 
  AdjustmentsIcon,
  MonogramIcon,
  CategoryBlock
} from './PanelShared.tsx';
import { CanvasStage } from './CanvasStage.tsx';

interface ArtPanelProps {
  mode: PanelMode;
  initialData?: any;
  kernelConfig: KernelConfig;
  integrity: number;
  uiRefined?: boolean;
  onSaveToHistory: (work: any) => void;
  onModeSwitch: (mode: PanelMode, data?: any) => void;
  savedPresets: any[];
  globalDna?: ExtractionResult | null;
}

export const ArtPanel: React.FC<ArtPanelProps> = ({
  mode,
  initialData,
  kernelConfig,
  integrity,
  uiRefined,
  onSaveToHistory,
  onModeSwitch,
  savedPresets = [],
  globalDna,
}) => {
  const PRESETS = useMemo(() => {
    let presetsToRender: PresetCategory[] = [];

    switch (mode) {
      case PanelMode.VECTOR:
        presetsToRender = [...VECTOR_PRESETS];
        presetsToRender.unshift(HYPERX_SIGNATURE_VECTOR);
        break;
      case PanelMode.TYPOGRAPHY:
        presetsToRender = [...TYPOGRAPHY_PRESETS];
        presetsToRender.unshift(HYPERX_SIGNATURE_TYPO);
        break;
      case PanelMode.MONOGRAM:
        presetsToRender = [...MONOGRAM_PRESETS];
        presetsToRender.unshift(HYPERX_SIGNATURE_MONO);
        break;
      default:
        presetsToRender = [];
    }

    if (Array.isArray(savedPresets) && savedPresets.length > 0) {
      const userPresets = savedPresets.filter(p => p && (p.type === mode || p.mode === mode));
      if (userPresets.length > 0) {
        const grouped: Record<string, PresetItem[]> = {};
        userPresets.forEach(p => {
          const catName = p.category || p.dna?.category || "VAULT_ARCHIVES";
          if (!grouped[catName]) grouped[catName] = [];
          grouped[catName].push({
            id: p.id || Math.random().toString(),
            name: p.name || p.dna?.name || "UNNAMED_DNA",
            description: p.description || p.dna?.description || "Extracted Style DNA",
            dna: p.dna,
            imageUrl: p.uploadedImage || p.imageUrl,
            type: p.type || p.mode
          });
        });
        const userCategories = Object.entries(grouped).map(([title, items]) => ({
          title: `USER_${title.toUpperCase()}`,
          items
        }));
        presetsToRender = [...userCategories, ...presetsToRender];
      }
    }

    return presetsToRender;
  }, [mode, savedPresets]);

  const getCategoryIcon = useCallback((title: string) => {
    const t = title.toLowerCase();
    if (t.includes('geometry')) return <BoxIcon className="w-3 h-3" />;
    if (t.includes('organic')) return <LeafIcon className="w-3 h-3" />;
    if (t.includes('pattern') || t.includes('abstract')) return <ShapesIcon className="w-3 h-3" />;
    if (t.includes('pulse') || t.includes('kinetic')) return <PulseIcon className="w-3 h-3" />;
    if (t.includes('illustrative')) return <StarIcon className="w-3 h-3" />;
    if (t.includes('forge') || t.includes('synthesis')) return <ForgeIcon className="w-3 h-3" />;
    if (t.includes('user') || t.includes('vault')) return <ExtractorIcon className="w-3 h-3" />;
    if (t.includes('signature')) return <SparkleIcon className="w-3 h-3" />;
    if (t.includes('monogram')) return <MonogramIcon className="w-3 h-3" />;
    return <AdjustmentsIcon className="w-3 h-3" />;
  }, []);

  const [activePresetId, setActivePresetId] = useState<string | null>(initialData?.id || null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.imageUrl || initialData?.uploadedImage || null);
  const [prompt, setPrompt] = useState(''); 
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(initialData?.generatedOutput || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefiningPrompt, setIsRefiningPrompt] = useState(false);
  const [devourerStatus, setDevourerStatus] = useState("STARVING");
  const [isValidationError, setIsValidationError] = useState(false);
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || globalDna || null);

  useEffect(() => {
    if (globalDna && !dna) {
      setDna(globalDna);
      setDevourerStatus("DNA_LINKED");
    }
  }, [globalDna, dna]);

  useEffect(() => {
    if (initialData) {
      if (initialData.isPresetLoad) setPrompt('');
      else if (initialData.description) setPrompt(initialData.description);
      if (initialData.imageUrl || initialData.uploadedImage) setUploadedImage(initialData.imageUrl || initialData.uploadedImage);
      if (initialData.dna) setDna(initialData.dna);
      if (initialData.generatedOutput) setGeneratedOutput(initialData.generatedOutput);
    }
  }, [initialData]);

  const handleSelectPreset = useCallback((id: string) => {
    setActivePresetId(id);
    const item = PRESETS.flatMap(c => c.items).find(i => i.id === id);
    if (item) {
      if ((item as any).dna) {
        setDna((item as any).dna);
        setDevourerStatus("DNA_LINKED");
      }
      if ((item as any).imageUrl) {
        setUploadedImage((item as any).imageUrl);
      }
      setPrompt('');
    }
  }, [PRESETS]);

  const handleGenerate = async () => {
    let effectivePrompt = prompt.trim() || "HYPER";
    setIsProcessing(true);
    setDevourerStatus(dna ? "DNA_STYLIZE_ACTIVE" : "DEVOURING_BUFFER");
    setIsValidationError(false);
    try {
      const synthFn = mode === PanelMode.VECTOR ? synthesizeVectorStyle : synthesizeTypoStyle;
      const result = await synthFn(effectivePrompt, uploadedImage || undefined, kernelConfig, dna || undefined);
      setGeneratedOutput(result);
      setDevourerStatus("LATTICE_ACTIVE");
      onSaveToHistory({
        id: `synth-${Date.now()}`,
        name: prompt.trim() ? prompt.substring(0, 30) : (dna?.name || "Neural Synthesis"),
        description: effectivePrompt,
        type: mode,
        generatedOutput: result,
        dna: dna || undefined,
        imageUrl: uploadedImage,
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (e) {
      setDevourerStatus("LATTICE_FAIL");
      setIsValidationError(true);
    } finally { setIsProcessing(false); }
  };

  const handleRefinePrompt = async () => {
    if (!prompt.trim()) return;
    setIsRefiningPrompt(true);
    try {
      const refined = await refineTextPrompt(prompt, mode, kernelConfig, dna || undefined);
      setPrompt(refined);
    } catch (e) {} finally { setIsRefiningPrompt(false); }
  };

  return (
    <div className="flex flex-col h-full bg-brandNeutral font-sans">
      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden lg:flex flex-col w-[300px] border-r border-brandCharcoal/5 bg-brandNeutral/80 backdrop-blur-md overflow-y-auto shrink-0 p-3 custom-scrollbar scroll-smooth">
          <div className="mb-4 pl-1">
             <h2 className="text-[8px] font-black uppercase tracking-[0.5em] text-brandCharcoal/20 flex items-center gap-2">
                <div className="w-2 h-2 border border-brandRed/40 rotate-45" />
                Lattice_Vault
             </h2>
          </div>
          <div className="flex flex-col gap-6">
            {PRESETS.map((cat, i) => (
              <div key={`${cat.title}-${i}`} className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="mb-2">
                  <CategoryBlock title={cat.title} />
                </div>
                <div className="grid grid-cols-2 gap-1.5 auto-rows-max">
                  {cat.items.map(item => (
                    <div key={item.id} className={`${activePresetId === item.id ? 'col-span-2' : 'col-span-1'} transition-all duration-500`}>
                      <PresetCard 
                        name={item.name} 
                        description={item.description} 
                        isActive={activePresetId === item.id} 
                        onClick={() => handleSelectPreset(item.id)}
                        icon={getCategoryIcon(cat.title)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="h-20" />
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-brandNeutral overflow-y-auto custom-scrollbar">
          <CanvasStage
            uploadedImage={uploadedImage}
            generatedOutput={generatedOutput}
            isProcessing={isProcessing || isRefiningPrompt}
            devourerStatus={dna ? `DNA_ANCHOR: ${dna.name.toUpperCase()}` : devourerStatus}
            isValidationError={isValidationError}
            uiRefined={uiRefined}
            onClear={() => { setUploadedImage(null); setGeneratedOutput(null); setDna(null); setActivePresetId(null); setPrompt(''); setDevourerStatus("STARVING"); }}
            onGenerate={handleGenerate}
            onFileUpload={(f) => {
              const r = new FileReader();
              r.onload = e => { setUploadedImage(e.target?.result as string); setDna(null); setActivePresetId(null); setPrompt(''); setDevourerStatus("BUFFER_LOADED"); };
              r.readAsDataURL(f);
            }}
            mode={mode}
            integrity={integrity}
            activeDna={dna}
          />
          
          <div className="hx-container mb-10">
            <GenerationBar
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isProcessing={isProcessing}
              placeholder={mode === PanelMode.VECTOR ? "Describe visual subject constraints..." : "Enter text for neural glyph splicing..."}
              refineButton={
                <button
                  onClick={handleRefinePrompt}
                  disabled={!prompt.trim() || isRefiningPrompt || isProcessing}
                  className={`flex items-center gap-2.5 px-4 py-2 transition-all text-[10px] font-black uppercase rounded-sm border-2 shadow-sm
                    ${prompt.trim() ? 'border-brandYellowDark text-brandYellowDark hover:bg-brandYellowDark hover:text-brandNeutral bg-white' : 'border-brandCharcoal/10 text-brandCharcoalSoft cursor-not-allowed'}`}
                >
                  <SparkleIcon className={isRefiningPrompt ? 'animate-spin' : ''} />
                  <span>{isRefiningPrompt ? 'Refine' : 'Refine'}</span>
                </button>
              }
            />

            <PresetCarousel presets={PRESETS} activeId={activePresetId} onSelect={handleSelectPreset} mode={mode} getIcon={getCategoryIcon} />
            
            {dna && (
              <div className="animate-in slide-in-from-bottom-8 duration-500">
                <div className="bg-brandCharcoal p-6 border-l-4 border-brandRed flex items-center justify-between shadow-2xl relative overflow-hidden group rounded-sm ring-1 ring-brandRed/20">
                    <div className="flex flex-col relative z-10">
                      <span className="text-[8px] font-black uppercase text-brandRed italic tracking-[0.4em] mb-1.5 leading-none">Global_Aesthetic_Lock</span>
                      <h4 className="text-base font-black uppercase text-white tracking-tighter italic">{dna.name}</h4>
                    </div>
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="flex gap-2">
                        {dna.palette.map((c, i) => (
                          <div key={i} className="w-5 h-5 border border-white/10 shadow-lg rounded-sm" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <button onClick={() => { setDna(null); setDevourerStatus("STARVING"); }} className="px-4 py-2 text-[9px] font-black uppercase bg-brandRed/10 text-brandRed hover:bg-brandRed hover:text-white transition-all rounded-sm tracking-widest">Detach</button>
                    </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-24 lg:hidden" />
        </main>
      </div>
    </div>
  );
};
