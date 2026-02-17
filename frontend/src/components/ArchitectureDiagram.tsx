import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SystemState } from '../types';
import { Cpu, Database, Zap, GitBranch, ChevronsUp, Layers, Thermometer, BrainCircuit } from 'lucide-react';

interface Props {
    state: SystemState | null;
    isRunning: boolean;
}

const ArchitectureDiagram: React.FC<Props> = ({ state, isRunning }) => {
    // Default dummy state for offline view
    const isOffline = !state;
    const s = state || {
        active_compute_units: 4,
        active_memory_banks: 4,
        frequency: 1.0,
        power_consumption: 0,
        compute_demand: 0,
        memory_demand: 0,
        workload_type: 'Idle',
        throughput: 0,
        latency: 0,
        utilization: 0,
        tick: 0,
        cache_mode: 'Shared',
        temperature: 40.0,
        throttled: false,
        policy: 'Efficiency',
        ai_demand: 0,
        active_npus: 0,
        compute_memory_gb: 0,
        unified_memory_gb: 0,
        logs: []
    };

    const maxCores = 16;
    const maxMem = 16;

    // Helper to render grid items
    const renderGrid = (count: number, activeCount: number, type: 'compute' | 'memory') => {
        return Array.from({ length: count }).map((_, i) => {
            const isActive = i < activeCount;
            const colorClass = type === 'compute' ? 'bg-orange-500' : 'bg-purple-500';
            const glowClass = type === 'compute' ? 'shadow-[0_0_10px_rgba(249,115,22,0.6)]' : 'shadow-[0_0_10px_rgba(168,85,247,0.6)]';

            return (
                <motion.div
                    key={`${type}-${i}`}
                    className={`
                        relative rounded-sm overflow-hidden transition-all duration-300 border border-slate-700/50
                        ${isActive ? `${colorClass} ${glowClass} border-transparent` : 'bg-slate-800/50'}
                    `}
                    style={{ height: '36px' }}
                    initial={false}
                    animate={{
                        opacity: isActive ? 1 : 0.2,
                        scale: isActive ? 1 : 0.95,
                    }}
                >
                    {isActive && (
                        <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.05 }}
                        />
                    )}
                </motion.div>
            );
        });
    };

    return (
        <div className="relative p-8 min-h-[500px] flex flex-col items-center justify-center">
            {/* Background Circuit lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, slate-500 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {isOffline && (
                <div className={`absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-all duration-500 ${isRunning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="text-center p-8 border border-white/10 rounded-2xl bg-black/40">
                        <div className="animate-spin mb-4 inline-block">
                            <Layers className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-medium text-white">System Offline</h3>
                        <p className="text-slate-500">Initialize simulation to view architecture state.</p>
                    </div>
                </div>
            )}

            {/* Booting State - Optional if we want a specific loading indicator when isRunning && !state */}
            {isRunning && !state && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        <div className="animate-pulse text-indigo-400 font-mono tracking-widest text-sm">INITIALIZING HARDWARE...</div>
                    </div>
                </div>
            )}

            <div className={`w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 transition-opacity duration-500 ${isOffline && !isRunning ? 'opacity-30 blur-sm' : 'opacity-100'}`}>

                {/* LEFT: COMPUTE FABRIC */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    <div className="bg-slate-800/40 border border-orange-500/20 p-5 rounded-xl backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu className="w-24 h-24 text-orange-500" />
                        </div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h3 className="text-sm font-bold text-orange-100 uppercase tracking-widest flex items-center gap-2">
                                    <Cpu size={16} className="text-orange-500" /> Compute Fabric
                                </h3>
                                <p className="text-xs text-orange-400/70 mt-1">Scale-out Processing Units</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-mono font-bold text-white">{s.active_compute_units}</span>
                                <span className="text-xs text-slate-400"> / {maxCores} Active</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {renderGrid(maxCores, s.active_compute_units, 'compute')}
                        </div>

                        <div className="flex justify-between items-center text-xs border-t border-orange-500/10 pt-3 mt-2">
                            <span className="text-slate-400">Clock Frequency</span>
                            <span className="font-mono text-orange-300">{s.frequency.toFixed(2)} GHz</span>
                        </div>

                        {/* Compute Memory Usage */}
                        <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-orange-500/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Compute Memory Usage</span>
                                <span className="font-mono text-orange-300">
                                    {(s.compute_memory_gb || 0).toFixed(1)} GB / 16 GB ({((s.compute_memory_gb || 0) / 16 * 100).toFixed(0)}%)
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden relative">
                                <motion.div
                                    className={`h-full bg-gradient-to-r from-orange-600 to-orange-400 ${(s.compute_memory_gb || 0) / 16 > 0.75 ? 'shadow-[0_0_8px_rgba(249,115,22,0.6)]' : ''
                                        } ${(s.compute_memory_gb || 0) / 16 > 0.9 ? 'animate-pulse' : ''
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (s.compute_memory_gb || 0) / 16 * 100)}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI Accelerators / NPU Block */}
                    <div className={`bg-slate-800/40 border p-4 rounded-xl backdrop-blur-md relative overflow-hidden transition-all duration-500 ${s.active_npus > 0 ? 'border-emerald-500/30 bg-emerald-900/10' : 'border-white/5 bg-slate-800/30'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <BrainCircuit size={16} className={s.active_npus > 0 ? "text-emerald-400" : "text-slate-600"} />
                                <h3 className={`text-xs font-bold tracking-widest ${s.active_npus > 0 ? "text-emerald-100" : "text-slate-500"}`}>AI ACCELERATORS</h3>
                            </div>
                            <span className="text-xs text-slate-500 font-mono">{(s.ai_demand || 0).toFixed(0)}% LOAD</span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 relative">
                            <motion.div
                                className="absolute inset-0 bg-emerald-500/10 pointer-events-none z-0 rounded-lg"
                                animate={{ opacity: (s.ai_demand || 0) / 200 }}
                            />
                            {Array.from({ length: 8 }).map((_, i) => {
                                const isActive = i < (s.active_npus || 0);
                                return (
                                    <motion.div
                                        key={`npu-${i}`}
                                        className={`relative z-10 aspect-[2/1] rounded-sm border text-[8px] flex items-center justify-center font-bold tracking-tighter transition-all duration-300
                                            ${isActive
                                                ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-600'
                                            }`}
                                        animate={{ scale: isActive ? 1.05 : 1 }}
                                    >
                                        NPU
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-slate-800/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Total Load</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                                    animate={{ width: `${s.compute_demand}%` }}
                                />
                            </div>
                            <span className="min-w-[3ch] text-xs font-mono text-white text-right">{s.compute_demand.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

                {/* MIDDLE: INTERCONNECT & CONTROL */}
                <div className="md:col-span-4 flex flex-col justify-center items-center relative">
                    {/* The Bus/Interconnect Lines */}
                    <div className="hidden md:block absolute top-[50%] left-[-20px] right-[-20px] h-1 bg-gradient-to-r from-orange-500/0 via-indigo-500/50 to-purple-500/0" />

                    {/* Animated Data Particles */}
                    {!isOffline && s.throughput > 0 && (
                        <div className="hidden md:block absolute top-[50%] left-0 right-0 h-1 overflow-hidden pointer-events-none">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute top-0 w-2 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                                    initial={{ left: "0%", opacity: 0 }}
                                    animate={{
                                        left: ["0%", "50%", "100%"],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2 - (s.throughput / 100),
                                        repeat: Infinity,
                                        delay: i * 0.4,
                                        ease: "linear"
                                    }}
                                />
                            ))}
                            {Array.from({ length: 5 }).map((_, i) => (
                                <motion.div
                                    key={`rev-${i}`}
                                    className="absolute top-0 w-2 h-1 bg-indigo-300 rounded-full"
                                    initial={{ right: "0%", opacity: 0 }}
                                    animate={{
                                        right: ["0%", "50%", "100%"],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 3 - (s.throughput / 100),
                                        repeat: Infinity,
                                        delay: i * 0.6,
                                        ease: "linear"
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Control Plane Unit */}
                    <motion.div
                        className="w-full bg-slate-900 border border-indigo-500/50 p-6 rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.15)] relative z-20"
                        animate={{
                            boxShadow: `0 0 ${20 + (s.utilization / 4)}px rgba(99,102,241,0.25)`,
                            borderColor: s.utilization > 80 ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.5)'
                        }}
                    >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-3 py-1 border border-indigo-500/50 rounded-full text-[10px] text-indigo-300 uppercase tracking-wider font-bold whitespace-nowrap shadow-lg shadow-indigo-500/20">
                            Adaptive Control Plane
                        </div>

                        <div className="text-center space-y-4 pt-2">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Current Workload</span>
                                <div className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
                                    {s.workload_type.replace('_', ' ')}
                                </div>
                            </div>

                            <div className="flex justify-center items-baseline gap-1">
                                <h2 className="text-4xl font-bold text-white tracking-tighter">
                                    {(s.throughput).toFixed(0)}
                                </h2>
                                <span className="text-xs text-slate-400 uppercase">Ops/Cycle</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-800/50 p-2 rounded border border-white/5">
                                    <div className="text-slate-500 mb-1">Latency</div>
                                    <div className={`font-mono ${s.latency > 1.2 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {s.latency.toFixed(2)}x
                                    </div>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded border border-white/5">
                                    <div className="text-slate-500 mb-1">Utilization</div>
                                    <div className="font-mono text-blue-400">
                                        {s.utilization.toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-indigo-500/20">
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="text-indigo-300">Power Consumption</span>
                                    <span className="flex items-center gap-1 text-white font-bold">
                                        <Zap size={12} className="text-yellow-400 fill-current" />
                                        {s.power_consumption.toFixed(1)} W
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-indigo-300">Core Temp</span>
                                    <span className={`flex items-center gap-1 font-bold ${s.temperature > 80 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        <Thermometer size={12} />
                                        {s.temperature.toFixed(1)}°C
                                    </span>
                                </div>
                                {s.throttled && (
                                    <div className="mt-2 bg-red-500/10 border border-red-500/50 text-red-500 text-[10px] font-bold text-center py-1 px-2 rounded animate-pulse">
                                        ⚠️ THERMAL THROTTLING ACTIVE
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Arrows animated */}
                    <AnimatePresence>
                        {!isOffline && (
                            <>
                                <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full text-indigo-500/50" animate={{ x: [-10, 0, -10], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <ChevronsUp className="rotate-90 w-8 h-8" />
                                </motion.div>
                                <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full text-indigo-500/50" animate={{ x: [10, 0, 10], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
                                    <ChevronsUp className="-rotate-90 w-8 h-8" />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* RIGHT: MEMORY FABRIC */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    <div className="bg-slate-800/40 border border-purple-500/20 p-5 rounded-xl backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Database className="w-24 h-24 text-purple-500" />
                        </div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div>
                                <h3 className="text-sm font-bold text-purple-100 uppercase tracking-widest flex items-center gap-2">
                                    <Database size={16} className="text-purple-500" /> Memory Fabric
                                </h3>
                                <p className="text-xs text-purple-400/70 mt-1">Unified Elastic Banks</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-mono font-bold text-white">{s.active_memory_banks}</span>
                                <span className="text-xs text-slate-400"> / {maxMem} Active</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {renderGrid(maxMem, s.active_memory_banks, 'memory')}
                        </div>

                        <div className="flex justify-between items-center text-xs border-t border-purple-500/10 pt-3 mt-2">
                            <span className="text-slate-400">Mode</span>
                            <span className="font-mono text-purple-300 flex items-center gap-1">
                                <GitBranch size={10} /> {s.cache_mode}
                            </span>
                        </div>

                        {/* Unified Memory Consumption */}
                        <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-purple-500/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400">Unified Memory Consumption</span>
                                <span className="font-mono text-purple-300">
                                    {(s.unified_memory_gb || 0).toFixed(1)} GB / 16 GB ({((s.unified_memory_gb || 0) / 16 * 100).toFixed(0)}%)
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden relative">
                                <motion.div
                                    className={`h-full bg-gradient-to-r transition-all duration-300 ${((s.unified_memory_gb || 0) / 16 * 100) > 95 ? 'from-fuchsia-500 to-red-500 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]' :
                                        ((s.unified_memory_gb || 0) / 16 * 100) > 80 ? 'from-purple-500 to-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.6)]' :
                                            ((s.unified_memory_gb || 0) / 16 * 100) > 50 ? 'from-purple-500 to-purple-300' :
                                                'from-purple-900 to-purple-600'
                                        }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (s.unified_memory_gb || 0) / 16 * 100)}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <span className="text-xs text-slate-400 uppercase tracking-wider">Bus Demand</span>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                                    animate={{ width: `${s.memory_demand}%` }}
                                />
                            </div>
                            <span className="min-w-[3ch] text-xs font-mono text-white text-right">{s.memory_demand.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default ArchitectureDiagram;
