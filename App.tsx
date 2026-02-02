
import React, { useState, useEffect, useCallback } from 'react';
import { PanelMode, KernelConfig, ExtractionResult, CloudArchiveEntry } from './types.ts';
import { StartScreen } from './components/StartScreen.tsx';
import { ArtPanel } from './components/ArtPanel.tsx';
import { StyleExtractorPanel } from './components/StyleExtractorPanel.tsx';
import { ImageForgePanel } from './components/ImageForgePanel.tsx';
import { ImageFilterPanel } from './components/ImageFilterPanel.tsx';
import { AutoRepairDiagnostic } from './components/AutoRepairDiagnostic.tsx';
import { AutoRefineDiagnostic } from './components/AutoRefineDiagnostic.tsx';
import { AppControlsBar, PanelHeader, ThemeToggle } from './components/PanelShared.tsx'; 
import { useDeviceDetection } from './components/DeviceDetector.tsx';

const LS_KEYS = {
  ARCHIVES: 'hyperxgen_cloud_archives_v3',
  DNA: 'hyperxgen_active_dna_v3',
  PRESETS: 'hyperxgen_presets_v3',
  RECENT: 'hyperxgen_recent_v3',
  THEME: 'hyperxgen_theme_v1'
};

export const App: React.FC = () => {
  const [currentPanel, setCurrentPanel] = useState<PanelMode>(PanelMode.START);
  const [transferData, setTransferData] = useState<any>(null);
  const [isRepairing, setIsRepairing] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [systemIntegrity, setSystemIntegrity] = useState(100);
  const [activeDna, setActiveDna] = useState<ExtractionResult | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [hasProKey, setHasProKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const deviceInfo = useDeviceDetection();
  const [uiRefinementLevel, setUiRefinementLevel] = useState(0);

  const [kernelConfig, setKernelConfig] = useState<KernelConfig>({
    thinkingBudget: 4000,
    temperature: 0.15,
    model: 'gemini-3-flash-preview',
    deviceContext: 'INITIALIZING_HARDWARE_HANDSHAKE'
  });

  const [recentWorks, setRecentWorks] = useState<any[]>([]);
  const [savedPresets, setSavedPresets] = useState<any[]>([]);
  const [cloudArchives, setCloudArchives] = useState<CloudArchiveEntry[]>([]);

  useEffect(() => {
    if (deviceInfo.deviceType !== 'desktop' || kernelConfig.deviceContext === 'INITIALIZING_HARDWARE_HANDSHAKE') {
      setKernelConfig(prevConfig => ({
        ...prevConfig,
        deviceContext: deviceInfo.deviceType.toUpperCase(),
      }));
    }
  }, [deviceInfo, kernelConfig.deviceContext]);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasProKey(has);
      }
    };
    checkKey();
  }, []);

  // Theme Logic
  useEffect(() => {
    const storedTheme = localStorage.getItem(LS_KEYS.THEME);
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(LS_KEYS.THEME, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasProKey(true);
    }
  };

  useEffect(() => {
    const boot = () => {
      try {
        const p3 = localStorage.getItem(LS_KEYS.PRESETS);
        setSavedPresets(p3 ? JSON.parse(p3) : []);
        const r3 = localStorage.getItem(LS_KEYS.RECENT);
        setRecentWorks(r3 ? JSON.parse(r3) : []);
        const dna = localStorage.getItem(LS_KEYS.DNA);
        if (dna) setActiveDna(JSON.parse(dna));
        const archives = localStorage.getItem(LS_KEYS.ARCHIVES);
        setCloudArchives(archives ? JSON.parse(archives) : []);
        setHasInitialized(true);
      } catch (e) {
        console.error("Error loading from local storage:", e);
        setSavedPresets([]);
        setRecentWorks([]);
        setCloudArchives([]);
        setActiveDna(null);
        setHasInitialized(true);
      }
    };
    boot();
  }, []);

  useEffect(() => { 
    if (hasInitialized) localStorage.setItem(LS_KEYS.PRESETS, JSON.stringify(savedPresets)); 
  }, [savedPresets, hasInitialized]);

  useEffect(() => { 
    if (hasInitialized) localStorage.setItem(LS_KEYS.RECENT, JSON.stringify(recentWorks.slice(0, 15))); 
  }, [recentWorks, hasInitialized]);

  useEffect(() => { 
    if (hasInitialized) localStorage.setItem(LS_KEYS.ARCHIVES, JSON.stringify(cloudArchives));
  }, [cloudArchives, hasInitialized]);

  useEffect(() => {
    if (hasInitialized) localStorage.setItem(LS_KEYS.DNA, JSON.stringify(activeDna));
  }, [activeDna, hasInitialized]);

  const handleForceSave = useCallback(() => {
    setIsSaving(true);
    localStorage.setItem(LS_KEYS.PRESETS, JSON.stringify(savedPresets));
    localStorage.setItem(LS_KEYS.RECENT, JSON.stringify(recentWorks.slice(0, 15)));
    localStorage.setItem(LS_KEYS.ARCHIVES, JSON.stringify(cloudArchives));
    localStorage.setItem(LS_KEYS.DNA, JSON.stringify(activeDna));
    setTimeout(() => setIsSaving(false), 1200);
  }, [savedPresets, recentWorks, cloudArchives, activeDna]);

  const handleModeSwitch = useCallback((mode: PanelMode, data?: any) => {
    setCurrentPanel(mode);
    if (data) setTransferData(data);
  }, []);

  const handleSaveRepairReport = useCallback((report: any) => {
    const newReport: CloudArchiveEntry = {
      ...report,
      id: `repair-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'RepairReport',
      integrityAfterRepair: report.systemStabilityScore,
    };
    setCloudArchives(prev => [newReport, ...prev]);
  }, []);

  const handleSaveRefineReport = useCallback((report: any) => {
    const newReport: CloudArchiveEntry = {
      ...report,
      id: `refine-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'RefineReport',
      uiRefinementLevelAfterRefine: report.visualScore,
    };
    setCloudArchives(prev => [newReport, ...prev]);
  }, []);

  const handleLoadCloudArchive = useCallback((archive: CloudArchiveEntry) => {
    if (archive.type === 'RepairReport') {
      setSystemIntegrity(archive.integrityAfterRepair);
    } else if (archive.type === 'RefineReport') {
      setUiRefinementLevel(archive.uiRefinementLevelAfterRefine);
    }
  }, []);

  const handleLoadDNAFromHistory = useCallback((item: any) => {
    if (item.dna) setActiveDna(item.dna);
    if (item.type) {
      setCurrentPanel(item.type);
      setTransferData(item);
    }
  }, []);

  const handleClearCloudArchives = useCallback(() => {
    setCloudArchives([]);
  }, []);

  const renderPanel = () => {
    if (!hasInitialized) return null;
    return (
      <div className="h-full w-full">
        {currentPanel === PanelMode.START && <StartScreen onSelectMode={handleModeSwitch} recentCount={recentWorks.length} isDarkMode={isDarkMode} />}
        {(currentPanel === PanelMode.VECTOR || currentPanel === PanelMode.TYPOGRAPHY || currentPanel === PanelMode.MONOGRAM) && (
          <ArtPanel mode={currentPanel} initialData={transferData} kernelConfig={kernelConfig} integrity={systemIntegrity} onSaveToHistory={(w) => setRecentWorks(p => [w, ...p])} onModeSwitch={handleModeSwitch} savedPresets={savedPresets} globalDna={activeDna} />
        )}
        {currentPanel === PanelMode.EXTRACTOR && (
          <StyleExtractorPanel initialData={transferData} kernelConfig={kernelConfig} integrity={systemIntegrity} onSaveToPresets={(p) => setSavedPresets(prev => [p, ...prev])} savedPresets={savedPresets} onModeSwitch={handleModeSwitch} onSetGlobalDna={setActiveDna} activeGlobalDna={activeDna} />
        )}
        {currentPanel === PanelMode.IMAGE_FORGE && (
          <ImageForgePanel 
            initialData={transferData} 
            kernelConfig={kernelConfig} 
            integrity={systemIntegrity} 
            onModeSwitch={handleModeSwitch} 
            globalDna={activeDna} 
            hasProKey={hasProKey} 
            onAuth={handleOpenKeyDialog}
            onSaveToHistory={(w) => setRecentWorks(p => [w, ...p])}
          />
        )}
        {currentPanel === PanelMode.FILTERS && (
          <ImageFilterPanel 
            onSaveToHistory={(w) => setRecentWorks(p => [w, ...p])} 
            kernelConfig={kernelConfig} 
            integrity={systemIntegrity} 
            onModeSwitch={handleModeSwitch} 
            uiRefined={uiRefinementLevel > 50}
          />
        )}
      </div>
    );
  };

  return (
    <div className="app-shell relative">
      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 255, 0, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
      {isRepairing && <AutoRepairDiagnostic onComplete={(r) => { setIsRepairing(false); setSystemIntegrity(r.systemStabilityScore); handleSaveRepairReport(r); }} />}
      {isRefining && <AutoRefineDiagnostic onComplete={(r) => { setIsRefining(false); setUiRefinementLevel(r.visualScore); handleSaveRefineReport(r); }} />}
      
      <PanelHeader 
        title="HYPERXGEN" 
        onBack={() => handleModeSwitch(PanelMode.START)} 
        integrity={systemIntegrity} 
        onStartRepair={() => setIsRepairing(true)} 
        onStartRefine={() => setIsRefining(true)} 
      />

      {/* Floating Theme Toggle - Below Header */}
      <div className="fixed top-[calc(var(--header-h)+1rem)] left-6 z-[150] animate-in fade-in duration-700 delay-300">
         <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      </div>

      <div className="app-main"><div className="app-main-content-area">{renderPanel()}</div></div>
      <AppControlsBar 
        activeDna={activeDna} 
        onClearDna={() => setActiveDna(null)} 
        recentWorks={recentWorks}
        savedPresets={savedPresets}
        cloudArchives={cloudArchives}
        clearCloudArchives={handleClearCloudArchives}
        onLoadCloudArchive={handleLoadCloudArchive}
        onLoadDNA={handleLoadDNAFromHistory}
        isSaving={isSaving}
        onForceSave={handleForceSave}
        activeMode={currentPanel}
        onSwitchMode={handleModeSwitch}
      />
    </div>
  );
};
