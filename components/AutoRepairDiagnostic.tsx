
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { RepairSummary } from '../types';

interface AutoRepairDiagnosticProps {
  onComplete: (repairData: RepairSummary) => void;
  initialNodes?: number;
}

type RepairPhase = 'SCANNING' | 'INTERACTIVE_REPAIR' | 'VERIFYING' | 'SUCCESS' | 'FAILED' | 'COMPLETED';

interface BrokenNode {
  id: string;
  address: string;
  error: string;
  repaired: boolean;
  isRepairing?: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  repairAttempts: number;
  maxRepairAttempts: number;
  permanentFailure: boolean;
  description?: string;
}

const ERROR_LIST = [
  { error: "Lattice_Drift_Detected", severity: 'CRITICAL' as const, description: "Quantum lattice alignment failed" },
  { error: "Semantic_Overflow", severity: 'HIGH' as const, description: "Memory buffer exceeded semantic limits" },
  { error: "Vector_Quantization_Error", severity: 'MEDIUM' as const, description: "Vector space quantization mismatch" },
  { error: "Typography_Glyph_Collision", severity: 'LOW' as const, description: "Unicode glyph superposition detected" },
  { error: "DNA_Sequence_Interruption", severity: 'CRITICAL' as const, description: "Genetic encoding sequence corrupted" },
  { error: "Kernel_State_Corruption", severity: 'HIGH' as const, description: "Core kernel integrity compromised" },
  { error: "Logic_Loop_Failure", severity: 'MEDIUM' as const, description: "Recursive logic loop timeout" }
];

export const AutoRepairDiagnostic: React.FC<AutoRepairDiagnosticProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<{ msg: string; type: 'info' | 'error' | 'success' | 'warning'; id: number }[]>([]);
  const [phase, setPhase] = useState<RepairPhase>('SCANNING');
  const [nodes, setNodes] = useState<BrokenNode[]>([]);
  const [repairStartTime] = useState<number>(Date.now());
  const [repairSummary, setRepairSummary] = useState<RepairSummary | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLocalLog = useCallback((msg: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    setLogs(prev => [...prev, { msg: `[${new Date().toLocaleTimeString()}] ${msg}`, type, id: Math.random() }]);
  }, []);

  const calculateRepairSummary = useCallback(() => {
    const totalTime = (Date.now() - repairStartTime) / 1000;
    const repairedNodes = nodes.filter(n => n.repaired).length;
    const criticalFailures = nodes.filter(n => n.severity === 'CRITICAL' && !n.repaired).length;
    const systemStabilityScore = Math.max(0, Math.round((repairedNodes / Math.max(nodes.length, 1)) * 100 - (criticalFailures * 10)));

    const summary: RepairSummary = {
      totalNodes: nodes.length,
      repairedNodes,
      failedNodes: nodes.filter(n => !n.repaired).length,
      averageRepairTime: totalTime / Math.max(repairedNodes, 1),
      totalTime,
      criticalFailures,
      systemStabilityScore
    };
    setRepairSummary(summary);
    return summary;
  }, [nodes, repairStartTime]);

  useEffect(() => {
    const initiateScanning = async () => {
      addLocalLog("HYPERXGEN_KERNEL_REPAIR_PROTOCOL: v4.2.1", 'info');
      await new Promise(r => setTimeout(r, 600));
      
      const numInitialNodes = 12; // Increased count for higher density
      const detectedNodes: BrokenNode[] = Array.from({ length: numInitialNodes }).map((_, i) => {
        const errorData = ERROR_LIST[Math.floor(Math.random() * ERROR_LIST.length)];
        return {
          id: `node-${i}-${Date.now()}`,
          address: `0x${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
          error: errorData.error,
          description: errorData.description,
          repaired: false,
          isRepairing: false,
          severity: errorData.severity,
          repairAttempts: 0,
          maxRepairAttempts: 3,
          permanentFailure: false
        };
      });

      setNodes(detectedNodes);
      addLocalLog(`CRITICAL: ${detectedNodes.length} CORRUPTED SEGMENTS DETECTED.`, 'error');
      setPhase('INTERACTIVE_REPAIR');
    };
    initiateScanning();
  }, [addLocalLog]);

  const handleRepairNode = useCallback(async (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node || node.repaired || node.permanentFailure) return;

    setNodes(prev => prev.map(n => n.id === id ? { ...n, isRepairing: true, repairAttempts: n.repairAttempts + 1 } : n));
    setSelectedNode(id);
    
    await new Promise(r => setTimeout(r, 400));
    const repairSuccessful = Math.random() < 0.85;
    
    setNodes(prev => {
      const updated = prev.map(n => {
        if (n.id === id) {
          const newPermanentFailure = !repairSuccessful && n.repairAttempts >= n.maxRepairAttempts;
          return { 
            ...n, 
            repaired: repairSuccessful, 
            isRepairing: false,
            permanentFailure: newPermanentFailure
          };
        }
        return n;
      });
      
      if (repairSuccessful) addLocalLog(`SECURED: ${node.address}`, 'success');
      else addLocalLog(`FAILED_RETRY: ${node.address}`, 'error');
      
      const done = updated.every(n => n.repaired || n.permanentFailure);
      if (done) setTimeout(() => finishRepair(updated.every(n => n.repaired || n.permanentFailure)), 500);
      
      return updated;
    });
    setSelectedNode(null);
  }, [nodes, addLocalLog]);

  const finishRepair = async (success: boolean) => {
    const finalSummary = calculateRepairSummary();
    setPhase('VERIFYING');
    await new Promise(r => setTimeout(r, 800));
    setPhase(success ? 'SUCCESS' : 'FAILED');
    await new Promise(r => setTimeout(r, 1000));
    setPhase('COMPLETED');
  };

  const handleBulkRepair = async () => {
    if (phase !== 'INTERACTIVE_REPAIR') return;
    const unrepairedNodes = nodes.filter(n => !n.repaired && !n.permanentFailure);
    for (const node of unrepairedNodes) {
      await handleRepairNode(node.id);
      await new Promise(r => setTimeout(r, 80));
    }
  };

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [logs]);

  const finalSummary = repairSummary || calculateRepairSummary();

  return (
    <div className="fixed inset-0 z-[500] bg-brandCharcoal flex flex-col font-mono overflow-hidden select-none animate-in fade-in duration-200">
      <header className="h-14 border-b-2 border-brandRed flex items-center justify-between px-6 shrink-0 z-50 bg-black/40 backdrop-blur-md">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brandNeutral italic">HyperXGen_Repair_Protocol</span>
        <div className="flex gap-2">
          <button onClick={handleBulkRepair} className="bg-brandRed/10 border border-brandRed text-brandRed px-4 py-1.5 text-[9px] font-black uppercase hover:bg-brandRed hover:text-white transition-all rounded-sm">Bulk_Repair</button>
          <button onClick={() => onComplete(calculateRepairSummary())} className="bg-white/5 border border-white/20 text-white/40 px-4 py-1.5 text-[9px] font-black uppercase hover:text-brandRed transition-all rounded-sm">Abort_System</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col p-6 overflow-hidden relative z-10 max-w-4xl mx-auto w-full">
          <div className="mb-6 bg-black/40 border-2 border-brandRed/20 p-4 rounded-sm shadow-2xl">
            <div ref={scrollRef} className="h-20 overflow-y-auto space-y-1 custom-scrollbar text-[9px]">
              {logs.map((log) => (<div key={log.id} className={`${log.type === 'error' ? 'text-brandRed' : log.type === 'warning' ? 'text-brandYellow' : 'text-green-400'}`}>{log.msg}</div>))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {phase === 'SCANNING' ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-brandRed border-t-transparent rounded-full animate-spin" />
                <span className="text-brandRed text-[10px] font-black uppercase animate-pulse">Scanning_Lattice...</span>
              </div>
            ) : phase === 'COMPLETED' ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-300">
                <div className="text-center">
                   <h2 className="text-[20px] font-black uppercase tracking-[0.4em] text-brandRed italic mb-2">REPAIR_MANIFEST</h2>
                   <div className="h-1 w-24 bg-brandRed mx-auto mb-8" />
                </div>

                <div className="flex flex-col items-center justify-center mb-6 p-8 border-2 border-green-500/30 bg-green-500/5 rounded-sm shadow-[0_0_50px_rgba(34,197,94,0.1)] backdrop-blur-sm animate-in zoom-in-95 duration-500">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500 mb-2">System_Stability_Restored</span>
                   <div className="text-8xl font-black italic text-green-400 drop-shadow-[0_0_25px_rgba(34,197,94,0.6)]">
                     {finalSummary.systemStabilityScore}%
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-12 text-[11px] text-brandNeutral/80 uppercase font-black tracking-widest">
                  <div className="flex flex-col gap-2 items-center">
                    <span className="opacity-40">Nodes_Processed</span>
                    <span className="text-2xl text-white">{finalSummary.totalNodes}</span>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <span className="opacity-40">Failed_Nodes</span>
                    <span className="text-2xl text-brandRed">{finalSummary.failedNodes}</span>
                  </div>
                </div>
                <button onClick={() => onComplete(finalSummary)} className="mt-10 bg-brandRed text-white px-12 py-4 font-black uppercase text-[12px] italic tracking-[0.3em] hover:brightness-110 active:scale-95 transition-all rounded-sm">
                  Dismiss_Diagnostics
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {nodes.map(node => (
                  <button 
                    key={node.id}
                    onClick={() => handleRepairNode(node.id)}
                    disabled={node.repaired || node.isRepairing || node.permanentFailure}
                    className={`relative h-24 flex flex-col items-center justify-center p-3 border-2 transition-all rounded-sm text-center
                      ${node.repaired 
                        ? 'border-green-600 bg-green-500/10' 
                        : node.permanentFailure 
                          ? 'border-white/5 opacity-20 grayscale' 
                          : 'border-brandRed/40 bg-brandRed/5 hover:border-brandRed hover:bg-brandRed/10'}
                    `}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-sm font-black text-[9px] mb-2 shadow-inner
                      ${node.repaired ? 'bg-green-600 text-white' : 'bg-brandRed/20 text-brandRed'}
                    `}>
                      {node.repaired ? 'OK' : '!'}
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tight text-white/90 truncate w-full px-1">
                      {node.error.replace(/_/g, ' ')}
                    </span>
                    <span className="absolute bottom-1 right-2 text-[6px] text-white/20 font-mono">{node.address}</span>
                    
                    {node.isRepairing && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-brandCharcoal/80">
                         <div className="w-4 h-4 border-2 border-brandYellow border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-brandRed/20">
         <div className="h-full bg-brandRed animate-shimmer" style={{ width: '100%' }} />
      </div>
    </div>
  );
};
