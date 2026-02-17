import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    logs: string[];
}

const EventLog: React.FC<Props> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[200px]">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">System Control Logs</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs" ref={scrollRef}>
                <div className="space-y-1">
                    <AnimatePresence initial={false}>
                        {logs.length === 0 && (
                            <div className="text-slate-600 italic">Waiting for system events...</div>
                        )}
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-slate-300 border-l-2 border-slate-700 pl-2 py-0.5 hover:bg-white/5 transition-colors"
                            >
                                <span className="text-indigo-400 mr-2">{log.split(']')[0]}]</span>
                                {log.split(']')[1]}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default EventLog;
