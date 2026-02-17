import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { SystemState } from '../types';

interface Props {
    history: SystemState[];
}

const Metrics: React.FC<Props> = ({ history }) => {
    // We want to show the last 60 ticks
    const data = history.slice(-60);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel p-4 rounded-xl shadow-2xl !bg-slate-900/95 border-slate-700/50">
                    <p className="text-slate-400 text-xs mb-2 font-mono uppercase tracking-wider">Tick: {label}</p>
                    {payload.map((p: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 text-xs mb-1">
                            <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: p.color, color: p.color }} />
                            <span className="text-slate-300 capitalize font-medium">{p.name}:</span>
                            <span className="font-mono text-white font-bold">{p.value.toFixed(1)}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    {/* Background watermark/icon could go here */}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-slate-200 font-bold font-display tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_#f97316]" /> Throughput Analysis
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-1">RESOURCE DEMAND vs CAPACITY</p>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                            <XAxis dataKey="tick" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tick={{ fontFamily: 'monospace' }} />
                            <YAxis stroke="#64748b" domain={[0, 100]} fontSize={10} tickLine={false} axisLine={false} tick={{ fontFamily: 'monospace' }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />

                            <Area type="monotone" dataKey="compute_demand" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorCompute)" name="Compute Demand" animationDuration={500} />
                            <Area type="monotone" dataKey="memory_demand" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" name="Memory Demand" animationDuration={500} />
                            <Line type="monotone" dataKey="throughput" stroke="#4ade80" strokeWidth={2} dot={false} name="Actual Throughput" strokeDasharray="4 4" animationDuration={500} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-slate-200 font-bold font-display tracking-wide flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_5px_#facc15]" /> Power Efficiency
                        </h3>
                        <p className="text-xs text-slate-500 font-mono mt-1">DYNAMIC SCALING METRICS</p>
                    </div>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                            <XAxis dataKey="tick" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tick={{ fontFamily: 'monospace' }} />
                            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tick={{ fontFamily: 'monospace' }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />

                            <Line type="stepAfter" dataKey="power_consumption" stroke="#facc15" strokeWidth={2} dot={false} name="Power (W)" animationDuration={500} activeDot={{ r: 4, strokeWidth: 0, fill: '#facc15' }} />
                            <Line type="monotone" dataKey="utilization" stroke="#38bdf8" strokeWidth={2} dot={false} name="Utilization (%)" strokeOpacity={0.7} animationDuration={500} activeDot={{ r: 4, strokeWidth: 0, fill: '#38bdf8' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Metrics;
