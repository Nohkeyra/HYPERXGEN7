
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RefineSummary } from '../types';

interface AutoRefineDiagnosticProps {
  onComplete: (refineData: RefineSummary) => void;
  mode?: 'AUDIT' | 'ENHANCE' | 'OPTIMIZE';
}

type RefinePhase = 'AUDITING' | 'ALIGNING' | 'VALIDATING' | 'ENHANCING' | 'SUCCESS' | 'FAILED' | 'COMPLETED';

interface AuditNode {
  id: string;
  target: string;
  issue: string;
  valid: boolean;
  isEnhancing?: boolean;
  impact: 'PERFORMANCE' | 'VISUAL' | 'FUNCTIONAL' | 'ACCESSIBILITY';
  confidence: number;
  suggestions: string[];
  isHidden?: boolean;
}

const AUDIT_TARGETS_BASE = [
  { 
    target: "Vector_Padding", 
    issue: "Mismatch: p-3 detected, p-4 expected.", 
    impact: 'VISUAL' as const,
    suggestions: ["Update padding scale", "Implement responsive padding system", "Add CSS custom properties"]
  },
  { 
    target: "Typography_Borders", 
    issue: "Inconsistent stroke: 2px vs 4px.", 
    impact: 'VISUAL' as const,
    suggestions: ["Standardize border widths", "Create border scale tokens", "Implement border utility classes"]
  },
  { 
    target: "Extractor_Shadows", 
    issue: "Drop shadow depth drift: 8px vs 12px.", 
    impact: 'VISUAL' as const,
    suggestions: ["Consolidate shadow depths", "Implement shadow elevation system", "Add shadow transition animations"]
  },
  { 
    target: "Slider_Interpolation", 
    issue: "Non-linear feedback loop detected.", 
    impact: 'PERFORMANCE' as const,
    suggestions: ["Optimize animation curves", "Implement requestAnimationFrame", "Add debounce logic"]
  },
  { 
    target: "Button_Debouncing", 
    issue: "High-frequency signal jitter.", 
    impact: 'FUNCTIONAL' as const,
    suggestions: ["Implement throttle logic", "Add click state management", "Optimize event listeners"]
  },
  { 
    target: "Grid_Synchronization", 
    issue: "Sub-pixel lattice misalignment.", 
    impact: 'VISUAL' as const,
    suggestions: ["Implement CSS subpixel rounding", "Use flexbox gap property", "Add alignment debugging"]
  },
  { 
    target: "Color_Contrast", 
    issue: "WCAG 2.1 AA compliance failures.", 
    impact: 'ACCESSIBILITY' as const,
    suggestions: ["Update color palette", "Implement contrast checker", "Add dark mode support"]
  },
  { 
    target: "Image_Optimization", 
    issue: "Uncompressed assets detected.", 
    impact: 'PERFORMANCE' as const,
    suggestions: ["Implement WebP conversion", "Add lazy loading", "Optimize image delivery"]
  }
];

const IMPACT_COLORS = {
  PERFORMANCE: '#3B82F6',
  VISUAL: '#FD1E4A',
  FUNCTIONAL: '#FABD0D',
  ACCESSIBILITY: '#F59E0B'
};

export const AutoRefineDiagnostic: React.FC<AutoRefineDiagnosticProps> = ({ 
  onComplete, 
  mode = 'AUDIT' 
}) => {
  const [logs, setLogs] = useState<{ msg: string; type: 'info' | 'error' | 'success' | 'warning'; id: number }[]>([]);
  const [phase, setPhase] = useState<RefinePhase>('AUDITING');
  const [nodes, setNodes] = useState<AuditNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [refineStartTime] = useState<number>(Date.now());
  const [refineSummary, setRefineSummary] = useState<RefineSummary | null>(null);
  const [uiComplexity, setUiComplexity] = useState(100);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLocalLog = useCallback((msg: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    setLogs(prev => [...prev, { 
      msg: `[${new Date().toLocaleTimeString()}] ${msg}`, 
      type,
      id: Math.random() 
    }]);
  }, []);

  const progress = useMemo(() => {
    if (nodes.length === 0) return 0;
    const validated = nodes.filter(n => n.valid).length;
    return (validated / nodes.length) * 100;
  }, [nodes]);

  const calculateRefineSummary = useCallback(() => {
    const totalTime = (Date.now() - refineStartTime) / 1000;
    const resolvedIssues = nodes.filter(n => n.valid).length;
    const totalIssues = nodes.length;
    
    const performanceGain = nodes
      .filter(n => n.impact === 'PERFORMANCE' && n.valid)
      .length * 15;
    
    const visualScore = Math.min(
      100,
      nodes
        .filter(n => n.impact === 'VISUAL' && n.valid)
        .length * 25
    );

    const uxIssuesResolved = nodes.filter(n => (n.impact === 'FUNCTIONAL' || n.impact === 'ACCESSIBILITY') && n.valid).length;
    const totalUxIssues = nodes.filter(n => n.impact === 'FUNCTIONAL' || n.impact === 'ACCESSIBILITY').length;
    const uxScore = totalUxIssues > 0 ? Math.round((uxIssuesResolved / totalUxIssues) * 100) : 100;

    const aestheticCohesionIndex = Math.max(0, Math.round(visualScore * 0.7 + (100 - uiComplexity) * 0.3));

    const summary: RefineSummary = {
      totalIssues,
      resolvedIssues,
      performanceGain,
      visualScore,
      totalTime,
      mode,
      uxScore,
      aestheticCohesionIndex
    };
    setRefineSummary(summary);
    return summary;
  }, [nodes, refineStartTime, mode, uiComplexity]);

  const finalSummary = useMemo(() => {
    return refineSummary || calculateRefineSummary();
  }, [refineSummary, calculateRefineSummary]);

  useEffect(() => {
    const initiateAuditing = async () => {
      addLocalLog("HYPERXGEN_UI_REFINE_PROTOCOL: v3.1_AESTHETIC_ALCHEMIST", 'info');
      addLocalLog("INITIATING_DESIGN_AUDIT...", 'info');
      
      await new Promise(r => setTimeout(r, 1200));
      
      const numInitialNodes = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
      const detectedNodes: AuditNode[] = Array.from({ length: numInitialNodes }).map((_, i) => {
        const auditData = AUDIT_TARGETS_BASE[Math.floor(Math.random() * AUDIT_TARGETS_BASE.length)];
        return {
          id: `issue-${i}-${Date.now()}`,
          target: auditData.target,
          issue: auditData.issue,
          suggestions: auditData.suggestions,
          valid: false,
          isEnhancing: false,
          impact: auditData.impact,
          confidence: Math.round(Math.random() * (90 - 50) + 50)
        };
      });

      setNodes(detectedNodes);
      setUiComplexity(Math.min(100, numInitialNodes * 8 + Math.random() * 15));
      setPhase('ALIGNING');
    };

    initiateAuditing();
  }, [addLocalLog]);

  const handleEnhanceNode = useCallback(async (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node || node.valid) return;

    setNodes(prev => prev.map(n => n.id === id ? { ...n, isEnhancing: true } : n));
    setSelectedNode(id);

    const baseEnhanceTime = { PERFORMANCE: 900, VISUAL: 700, FUNCTIONAL: 600, ACCESSIBILITY: 800 }[node.impact];
    const effectiveEnhanceTime = baseEnhanceTime * (1 + (uiComplexity / 150));
    
    await new Promise(r => setTimeout(r, effectiveEnhanceTime));

    const enhanceSuccessful = Math.random() < (0.85 - (uiComplexity / 100) * 0.2);
    
    setNodes(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, valid: enhanceSuccessful, isEnhancing: false } : n);
      if (enhanceSuccessful) addLocalLog(`ENHANCEMENT_SUCCESS: ${node.target}`, 'success');
      else addLocalLog(`ENHANCEMENT_FAILED: ${node.target}`, 'error');
      
      if (updated.every(n => n.valid)) setTimeout(() => finishRefine(true), 1000);
      return updated;
    });
    setSelectedNode(null);
  }, [nodes, addLocalLog, uiComplexity]);

  const finishRefine = async (success: boolean) => {
    calculateRefineSummary();
    setPhase('VALIDATING');
    await new Promise(r => setTimeout(r, 1500));
    setPhase(success ? 'SUCCESS' : 'FAILED');
    await new Promise(r => setTimeout(r, 2000));
    setPhase('COMPLETED');
  };

  const handleBulkEnhance = async () => {
    if (phase !== 'ALIGNING') return;
    const unvalidatedNodes = nodes.filter(n => !n.valid);
    for (const node of unvalidatedNodes) {
      await handleEnhanceNode(node.id);
      await new Promise(r => setTimeout(r, 200));
    }
  };

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [logs]);

  return (
    <div className="fixed inset-0 z-[500] bg-brandCharcoal flex flex-col font-mono overflow-hidden select-none animate-in fade-in duration-300">
      <header className="h-16 border-b-2 border-brandYellow flex items-center justify-between px-6 bg-brandCharcoal/95 backdrop-blur-sm shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${phase === 'SUCCESS' ? 'bg-green-500' : 'bg-brandYellow animate-pulse'}`} />
          <span className="text-xs font-black uppercase tracking-[0.4em] text-brandNeutral">HyperXGen_UI_Refine_Protocol</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleBulkEnhance} disabled={phase !== 'ALIGNING'} className="bg-brandYellow/20 border border-brandYellow text-brandYellow px-4 py-1.5 text-[10px] font-black uppercase">Bulk_Enhance</button>
          <button onClick={() => onComplete(finalSummary)} className="bg-transparent border border-brandRed text-brandRed px-4 py-1.5 text-[10px] font-black uppercase">Abort</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-6 overflow-hidden relative z-10 max-w-7xl mx-auto w-full">
          <div className="mb-6 bg-black/60 border-2 border-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div ref={scrollRef} className="h-28 overflow-y-auto space-y-1 custom-scrollbar text-[10px] font-medium">
              {logs.map((log) => (<div key={log.id} className={`${log.type === 'error' ? 'text-red-500' : log.type === 'warning' ? 'text-yellow-500' : 'text-green-400'}`}>{log.msg}</div>))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {phase === 'AUDITING' ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6"><div className="w-20 h-20 border-4 border-brandYellow border-t-transparent rounded-full animate-spin" /><span className="text-brandYellow text-[12px] font-black uppercase tracking-widest animate-pulse">Auditing...</span></div>
            ) : phase === 'COMPLETED' ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
                <span className="text-[16px] font-black uppercase tracking-widest text-brandYellow">REFINE SUMMARY</span>
                <div className="text-[12px] text-brandNeutral/80 text-center space-y-2">
                  <p>RESOLVED: {finalSummary.resolvedIssues}/{finalSummary.totalIssues}</p>
                  <p>UX_SCORE: {finalSummary.uxScore}%</p>
                  <p>COHESION: {finalSummary.aestheticCohesionIndex}%</p>
                </div>
                <button onClick={() => onComplete(finalSummary)} className="bg-brandRed text-white px-8 py-3 font-black uppercase text-[12px]">DISMISS</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {nodes.map(node => (
                  <div key={node.id} className={`p-4 border-2 transition-all relative overflow-hidden flex flex-col justify-between h-40 rounded-lg ${node.valid ? 'border-green-500 bg-green-500/5' : 'border-brandYellow bg-brandYellow/5'}`}>
                    <span className="text-[8px] font-black text-brandNeutral/30 uppercase">{node.target}</span>
                    <p className="text-[10px] font-bold text-white/80 uppercase leading-tight mb-2">{node.issue}</p>
                    {!node.valid && (
                      <button onClick={() => handleEnhanceNode(node.id)} disabled={node.isEnhancing} className="w-full py-2 bg-brandYellow text-brandCharcoal font-black uppercase text-[10px] rounded hover:bg-brandRed hover:text-white transition-all">
                        {node.isEnhancing ? 'ENHANCING...' : 'ENHANCE'}
                      </button>
                    )}
                    {node.valid && <div className="text-center text-green-500 font-black text-[10px]">OPTIMIZED</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  );
};
