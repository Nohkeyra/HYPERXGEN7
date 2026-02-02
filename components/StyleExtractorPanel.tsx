
import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { PanelMode, ExtractionResult, KernelConfig, PresetCategory } from '../types.ts';
// Removed invalid import generateCreativeBrief
import { extractStyleFromImage } from '../services/geminiService.ts';
import { ReconHUD, GenerationBar, SparkleIcon, StarIcon, BoxIcon, TypographyIcon, TrashIcon, CategoryBlock } from './PanelShared.tsx';
import { CanvasStage } from './CanvasStage.tsx';

interface StyleExtractorPanelProps {
  initialData?: any;
  onSaveToHistory?: (data: any) => void;
  onSaveToPresets?: (data: any) => void;
  savedPresets?: any[];
  kernelConfig: KernelConfig;
  integrity?: number;
  uiRefined?: boolean;
  onModeSwitch: (mode: PanelMode, data?: any) => void;
  onSetGlobalDna?: (dna: ExtractionResult | null) => void;
  activeGlobalDna?: ExtractionResult | null;
}

export const StyleExtractorPanel: React.FC<StyleExtractorPanelProps> = ({
  initialData,
  onSaveToHistory,
  onSaveToPresets,
  savedPresets = [],
  kernelConfig,
  integrity,
  uiRefined,
  onModeSwitch,
  onSetGlobalDna,
  activeGlobalDna
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(initialData?.uploadedImage || initialData?.imageUrl || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractionResult | null>(initialData?.dna || null);
  const [reconStatus, setReconStatus] = useState(initialData?.dna ? "DNA_HARVESTED" : "IDLE");
  const [dna, setDna] = useState<ExtractionResult | null>(initialData?.dna || null);


  const storedDnaLibrary = useMemo(() => {
    return Array.isArray(savedPresets) ? savedPresets.filter(p => p && p.dna) : [];
  }, [savedPresets]);

  const isAlreadySaved = useMemo(() => {
    if (!extractedData) return false;
    return storedDnaLibrary.some(p => p.dna?.name === extractedData.name);
  }, [extractedData, storedDnaLibrary]);

  useEffect(() => {
    if (initialData?.uploadedImage || initialData?.imageUrl) {
      setUploadedImage(initialData.uploadedImage || initialData.imageUrl);
      if (initialData.dna) {
        setExtractedData(initialData.dna);
        setReconStatus("DNA_HARVESTED");
      }
    }
  }, [initialData]);

  const handleAnalyze = useCallback(async () => {
    if (!uploadedImage) {
      setReconStatus('CRITICAL: NO_BUFFER');
      return;
    }
    setIsProcessing(true);
    setReconStatus("AUDITING_BUFFER");
    try {
      const base64 = uploadedImage.split(',')[1] || uploadedImage;
      const result = await extractStyleFromImage(base64, true, kernelConfig);
      setExtractedData(result);
      setReconStatus("DNA_HARVESTED");
      onSaveToHistory?.({ name: result.name, type: PanelMode.EXTRACTOR, uploadedImage, dna: result });
    } catch (e) {
      setReconStatus("AUDIT_FAILED");
    } finally { setIsProcessing(false); }
  }, [uploadedImage, kernelConfig, onSaveToHistory]);

  const handleSavePreset = () => {
    if (!extractedData) return;
    const targetMode = extractedData.domain === 'Typography' ? PanelMode.TYPOGRAPHY : PanelMode.VECTOR;
    onSaveToPresets?.({
      id: `dna-${extractedData.name}-${Date.now()}`,
      name: extractedData.name,
      type: targetMode, 
      description: extractedData.description,
      dna: extractedData,
      imageUrl: uploadedImage,
      category: extractedData.category,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const handleSetGlobalAnchor = () => {
    if (!extractedData) return;
    onSetGlobalDna?.(activeGlobalDna?.name === extractedData.name ? null : extractedData);
  };

  const jumpToSynthesis = (mode: PanelMode) => {
    if (!extractedData) return;
    onModeSwitch(mode, { dna: extractedData, imageUrl: uploadedImage, isPresetLoad: true });
  };

  const isAnchorActive = activeGlobalDna?.name === extractedData?.name;

  return (
    <div className="flex flex-col h-full bg-brandNeutral font-sans overflow-y-auto no-scrollbar">
      <main className="flex-1 flex flex-col py-4 w-full">
        <CanvasStage
          uploadedImage={uploadedImage}
          generatedOutput={null}
          isProcessing={isProcessing}
          devourerStatus={reconStatus}
          isValidationError={reconStatus.includes("FAILED") || reconStatus.includes("CRITICAL")}
          uiRefined={uiRefined}
          onClear={() => { setUploadedImage(null); setExtractedData(null); setReconStatus("IDLE"); }}
          onGenerate={handleAnalyze}
          onFileUpload={(f) => {
            const r = new FileReader(); r.onload = (e) => {
              setUploadedImage(e.target?.result as string);
              setReconStatus("BUFFER_LOADED");
              setExtractedData(null);
            };
            r.readAsDataURL(f);
          }}
          mode={PanelMode.EXTRACTOR}
          integrity={integrity}
        />

        <div className="hx-container">
          <div className="flex flex-col xs:flex-row gap-2">
             <button 
                onClick={handleSavePreset}
                disabled={!extractedData}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase transition-all border-2 rounded-sm
                  ${extractedData ? (isAlreadySaved ? 'border-brandRed bg-brandRed text-white' : 'border-brandCharcoal bg-white text-brandCharcoal') : 'border-brandCharcoal/10 text-brandCharcoalSoft cursor-not-allowed'}
                `}
             >
               <StarIcon className={`w-3.5 h-3.5 ${isAlreadySaved ? 'fill-current' : ''}`} /> 
               {isAlreadySaved ? 'ARCHIVE_SYNCED' : 'ARCHIVE_STYLE_VAULT'}
             </button>
             <button 
                onClick={handleSetGlobalAnchor}
                disabled={!extractedData}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase transition-all border-2 rounded-sm
                  ${isAnchorActive ? 'border-brandRed bg-brandRed text-white shadow-lg' : extractedData ? 'border-brandRed bg-transparent text-brandRed' : 'border-brandCharcoal/10 text-brandCharcoalSoft cursor-not-allowed'}
                `}
             >
               {isAnchorActive ? 'ANCHOR_ENGAGED' : 'SET_STYLE_ANCHOR'}
             </button>
          </div>
          
          <GenerationBar onGenerate={handleAnalyze} isProcessing={isProcessing} placeholder="Upload source image for aesthetic extraction..." />

          {extractedData && (
            <div className="animate-in slide-in-up duration-500">
              <div className="bg-brandCharcoal text-brandNeutral p-6 sm:p-8 border-t-8 border-brandRed shadow-2xl rounded-sm">
                 <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">{extractedData.name}</h3>
                      <div className="flex gap-2">
                        <span className="text-[8px] font-black bg-brandRed px-2 py-0.5 rounded-sm">{extractedData.domain.toUpperCase()}</span>
                        <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-sm border border-white/5">{extractedData.category.toUpperCase()}</span>
                      </div>
                    </div>
                 </div>
                 <p className="text-[11px] font-bold uppercase leading-relaxed text-brandNeutral/80 italic border-l-4 border-brandRed pl-4 mb-8">{extractedData.description}</p>
                 <div className="flex flex-col sm:flex-row gap-3 border-t border-white/5 pt-6">
                    <button onClick={() => jumpToSynthesis(PanelMode.VECTOR)} className="flex-1 bg-brandYellow text-brandCharcoal font-black uppercase text-[10px] py-4 italic tracking-widest rounded-sm">SYNTH_VECTOR</button>
                    <button onClick={() => jumpToSynthesis(PanelMode.TYPOGRAPHY)} className="flex-1 bg-brandRed text-white font-black uppercase text-[10px] py-4 italic tracking-widest rounded-sm">SYNTH_TYPO</button>
                 </div>
              </div>
            </div>
          )}

          <div className="mt-12 pb-16">
             <div className="flex items-center gap-4 mb-6">
                <div className="bg-brandCharcoal text-brandYellow text-[9px] font-black uppercase px-3 py-1 border-l-4 border-brandRed rounded-sm">DNA_VAULT_ARCHIVES</div>
                <div className="h-[1px] flex-1 bg-brandCharcoal/10" />
                <span className="text-[8px] font-bold text-brandCharcoalSoft uppercase tracking-widest">{storedDnaLibrary.length} RECORES</span>
             </div>
             {storedDnaLibrary.length === 0 ? (
               <div className="p-10 border-2 border-dashed border-brandCharcoal/10 rounded-sm flex flex-col items-center justify-center opacity-30">
                  <BoxIcon className="w-8 h-8 mb-3" />
                  <span className="text-[9px] font-black uppercase tracking-widest">NO_STORED_FRAGMENTS</span>
               </div>
             ) : (
               <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {storedDnaLibrary.map((item) => (
                    <div 
                      key={item.id} 
                      className={`group relative h-24 flex flex-col items-center justify-center text-center p-3 border-2 transition-all duration-300 rounded-sm cursor-pointer
                        ${activeGlobalDna?.name === item.dna.name ? 'border-brandRed bg-brandRed/5 shadow-md scale-[1.02]' : 'bg-white border-brandCharcoal/10 hover:border-brandRed hover:-translate-y-1.5'}`}
                      onClick={() => { setUploadedImage(item.imageUrl); setExtractedData(item.dna); setReconStatus("DNA_RESTORED"); }}
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-sm font-black text-[10px] mb-2 shadow-inner
                          ${item.dna.domain === 'Typography' ? 'bg-brandRed/10 text-brandRed' : 'bg-brandYellow/10 text-brandYellowDark'}`}>
                          {item.dna.domain === 'Typography' ? 'T' : 'V'}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tight text-brandCharcoal truncate w-full px-1">{item.dna.name}</span>
                        <span className="text-[7px] font-bold uppercase text-brandCharcoalSoft mt-1">{item.dna.category}</span>
                      </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};
