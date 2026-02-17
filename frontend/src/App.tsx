import { useState, useEffect, useRef } from 'react';
import { startSimulation, stepSimulation, resetSimulation, updateWorkload, setPolicy, injectSpike } from './api';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import Metrics from './components/Metrics';
import type { SystemState } from './types';
import EventLog from './components/EventLog';
import { Play, Pause, RotateCcw, Cpu, Zap, Activity, Info, LayoutDashboard } from 'lucide-react';
import About from './components/About';


function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [state, setState] = useState<SystemState | null>(null);
  const [history, setHistory] = useState<SystemState[]>([]);
  const [workloadType, setWorkloadType] = useState("Dynamic-Mixed");
  const [currentView, setCurrentView] = useState<'dashboard' | 'about'>('dashboard');

  const intervalRef = useRef<number | null>(null);

  const handleStart = async () => {
    if (!state) {
      await startSimulation(workloadType);
      try {
        // Fetch first state immediately to update UI without waiting for interval
        const initialState = await stepSimulation();
        setState(initialState);
      } catch (error) {
        console.error("Failed to fetch initial state:", error);
      }
    }
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = async () => {
    setIsRunning(false);
    await resetSimulation();
    setState(null);
    setHistory([]);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(async () => {
        const newState = await stepSimulation();
        setState(newState);
        setHistory(prev => {
          // Keep last 60 points for smooth charts
          const newHist = [...prev, newState];
          if (newHist.length > 60) return newHist.slice(newHist.length - 60);
          return newHist;
        });
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900 blur-3xl filter opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900 blur-3xl filter opacity-40 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto p-4 lg:p-8 flex flex-col gap-6">

        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="relative p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Cpu className="w-8 h-8 text-indigo-400 icon-glow" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400 tracking-tight font-display drop-shadow-sm">
                  Architectural Simulator
                </h1>
                <p className="text-indigo-400/80 text-sm font-medium tracking-[0.2em] font-mono mt-1">
                  APP-AWARE DYNAMIC RESOURCE SCALING
                </p>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg border border-white/5 backdrop-blur-sm self-center md:self-end mb-4 md:mb-1 mx-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${currentView === 'dashboard' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button
              onClick={() => setCurrentView('about')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${currentView === 'about' ? 'bg-indigo-500/20 text-indigo-400 shadow-sm border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Info size={16} /> About
            </button>
          </nav>

          <div className="flex items-center gap-4 mt-6 md:mt-0 bg-slate-900/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">
            <div className="flex items-center gap-3 px-4 py-1">
              <div className={`relative flex items-center justify-center w-3 h-3 rounded-full ${isRunning ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`}>
                {isRunning && <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />}
              </div>
              <span className={`text-xs font-mono font-bold tracking-wider ${isRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
                {isRunning ? "SYSTEM ONLINE" : "STANDBY MODE"}
              </span>
            </div>

            <div className="h-8 w-px bg-white/10 mx-1" />

            <div className="flex gap-2">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="group flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold font-display tracking-wide rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95 border border-indigo-400/20"
                >
                  <Play size={18} className="fill-current" /> INITIALIZE
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="group flex items-center gap-2 px-6 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 border border-amber-500/50 text-sm font-bold font-display tracking-wide rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.1)] active:scale-95"
                >
                  <Pause size={18} className="fill-current" /> SUSPEND
                </button>
              )}
              <button
                onClick={handleReset}
                className="p-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-colors border border-transparent hover:border-white/10"
                title="Reset System"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Configuration Bar */}
        {
          currentView === 'dashboard' ? (
            <>
              {/* Configuration Bar */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-3">
                  <div className="h-full glass-panel rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                    {/* Decorative background blur */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-white/5 pb-2 font-display">Simulation Control</h2>

                    <div className="space-y-6 relative z-10">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workload Profile</label>
                        <div className="relative group">
                          <select
                            value={workloadType}
                            onChange={async (e) => {
                              const mk = e.target.value;
                              setWorkloadType(mk);
                              if (isRunning) {
                                try {
                                  await updateWorkload(mk);
                                } catch (err) {
                                  console.error("Failed to update workload:", err);
                                }
                              }
                            }}
                            disabled={false}
                            className="w-full appearance-none bg-slate-900/80 border border-slate-700 hover:border-indigo-500/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer font-sans shadow-inner"
                          >
                            <option value="Dynamic-Mixed">Dynamic Mixed (Adaptive)</option>
                            <option value="Compute-Intensive">Compute Intensive (HPC)</option>
                            <option value="Memory-Intensive">Memory Intensive (Data)</option>
                            <option value="AI-Inference">AI Inference (NPU Accelerated)</option>
                          </select>
                          <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500 group-hover:text-indigo-400 transition-colors">
                            <Activity size={16} />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Optimization Policy</label>
                        <div className="flex bg-slate-950/50 p-1.5 rounded-xl border border-slate-800">
                          <button
                            onClick={async () => {
                              if (isRunning) await setPolicy('Efficiency');
                            }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-display tracking-wide transition-all ${state?.policy === 'Efficiency' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                          >
                            EFFICIENCY
                          </button>
                          <button
                            onClick={async () => {
                              if (isRunning) await setPolicy('Performance');
                            }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold font-display tracking-wide transition-all ${state?.policy === 'Performance' ? 'bg-orange-500/20 text-orange-400 shadow-sm border border-orange-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
                          >
                            PERFORMANCE
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={async () => {
                            if (isRunning) await injectSpike();
                          }}
                          className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold font-display tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] active:scale-95"
                        >
                          <Zap size={16} className={isRunning ? "fill-current animate-pulse" : ""} /> INJECT LOAD SPIKE
                        </button>
                      </div>

                      {/* System Logs */}
                      <EventLog logs={state?.logs || []} />
                    </div>
                  </div>
                </div>

                {/* Metrics - Moving them up to be side-by-side with config usually looks better, but let's keep diagram massive */}
                <div className="lg:col-span-9 flex flex-col gap-6">
                  {/* Main Architectural View */}
                  <div className="glass-panel rounded-2xl overflow-hidden relative min-h-[500px]">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-80 shadow-[0_0_15px_#6366f1]" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <ArchitectureDiagram state={state} isRunning={isRunning} />
                  </div>
                </div>
              </section>

              {/* Bottom Metrics Section */}
              <section>
                <Metrics history={history} />
              </section>
            </>
          ) : (
            <About />
          )
        }

      </div >
    </div >
  );
}

export default App;
