
import { motion } from 'framer-motion';
import {
    Activity,
    Monitor,
    Cpu,
    Zap,
    Server,
    BarChart2,
    Sliders,
    Terminal,
    CloudLightning,
    GitBranch
} from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring' as const, stiffness: 100 }
    }
};

const About = () => {
    return (
        <motion.div
            className="max-w-[1200px] mx-auto text-slate-100 flex flex-col gap-12 pb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero Section */}
            <motion.section
                className="text-center py-20 relative overflow-hidden rounded-3xl glass-panel"
                variants={itemVariants}
            >
                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full scale-150 animate-pulse opacity-20 pointer-events-none" />
                <div className="relative z-10 px-6">
                    <h1 className="text-5xl md:text-7xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-4 tracking-tight drop-shadow-sm">
                        About the Architectural Simulator
                    </h1>
                    <h2 className="text-xl md:text-2xl text-indigo-300 font-mono tracking-widest uppercase mb-6">
                        App-Aware Dynamic Resource Scaling Engine
                    </h2>
                    <p className="max-w-3xl mx-auto text-slate-300 text-lg leading-relaxed">
                        A high-fidelity simulation environment designed to visualize and analyze how modern cloud infrastructures
                        dynamically adapt resources based on real-time application demands, balancing efficiency with performance.
                    </p>
                </div>
            </motion.section>

            {/* Definition Section */}
            <motion.section variants={itemVariants}>
                <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-700" />

                    <h3 className="text-3xl font-bold font-display mb-6 text-white flex items-center gap-3">
                        <span className="w-1 h-8 bg-indigo-500 rounded-full" />
                        What is App-Aware Dynamic Resource Scaling?
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed mb-4">
                        Application-Aware Dynamic Resource Scaling is an intelligent orchestration strategy that moves beyond simple metric-based scaling (like CPU usage).
                        It understands the specific "personality" and requirements of the running application—whether it's memory-intensive, compute-heavy, or sensitive to latency.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                        By continuously profiling the workload and applying policy-driven logic, the system autonomously adjusts CPU frequencies, allocates memory blocks,
                        and manages NPU acceleration to maintain optimal Service Level Agreements (SLAs) while minimizing power consumption.
                    </p>
                </div>
            </motion.section>

            {/* Working Mechanism */}
            <motion.section variants={itemVariants}>
                <h3 className="text-3xl font-bold font-display mb-10 text-center text-white">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 z-0" />

                    {[
                        { icon: Activity, title: "Workload Detection", desc: "Monitors incoming request patterns." },
                        { icon: Monitor, title: "Resource Monitoring", desc: "Tracks utilization metrics real-time." },
                        { icon: GitBranch, title: "Policy Evaluation", desc: "Weighs Perf vs. Efficiency rules." },
                        { icon: Zap, title: "Scaling Decision", desc: "Calculates optimal resource delta." },
                        { icon: Server, title: "Dynamic Allocation", desc: "Provisions CPUs/NPUs instantly." },
                    ].map((step, index) => (
                        <motion.div
                            key={index}
                            className="relative z-10 flex flex-col items-center text-center group"
                            whileHover={{ y: -5 }}
                        >
                            <div className="w-24 h-24 glass-panel rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300">
                                <step.icon size={40} className="text-indigo-400 group-hover:text-white transition-colors icon-glow" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2 font-display">{step.title}</h4>
                            <p className="text-sm text-slate-400 px-2">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Key Features */}
            <motion.section variants={itemVariants}>
                <h3 className="text-3xl font-bold font-display mb-8 text-white pl-4 border-l-4 border-indigo-500">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: Terminal, title: "Dynamic Profiling", desc: "Identifies workload characteristics (Complete, Memory, AI) on the fly." },
                        { icon: Sliders, title: "Policy Optimization", desc: "Switch between 'Efficiency' and 'Performance' modes to see impact." },
                        { icon: BarChart2, title: "Real-time Logging", desc: "Live event stream showing every decision made by the engine." },
                        { icon: CloudLightning, title: "Load Simulation", desc: "Inject artificial load spikes to test system resilience and response." },
                        { icon: Cpu, title: "Hardware Awareness", desc: "Visualizes specific hardware units (CPU, Memory, NPU) engaging." },
                        { icon: Monitor, title: "Deep Analytics", desc: "Track throughput, response time, and power usage over time." },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            className="glass-panel p-6 rounded-xl hover:bg-slate-800/50 transition-colors border border-white/5"
                            whileHover={{ scale: 1.02 }}
                        >
                            <feature.icon className="text-indigo-400 mb-4 icon-glow" size={32} />
                            <h4 className="text-xl font-bold text-slate-100 mb-2 font-display">{feature.title}</h4>
                            <p className="text-slate-400 text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Why This Simulator */}
            <motion.section variants={itemVariants}>
                <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-indigo-900/20 to-slate-900/50 border border-indigo-500/20">
                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                        <div className="flex-1">
                            <h3 className="text-3xl font-bold font-display mb-6 text-white">Why This Simulator?</h3>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                In the era of cloud computing and distributed systems, static resource allocation is obsolete.
                                Understanding <strong>dynamic scaling</strong> is critical for building cost-effective, high-performance applications.
                            </p>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                This tool serves as an interactive educational platform and research utility to visualize complex
                                orchestration concepts that usually happen invisibly in the backend of providers like AWS, Azure, or Google Cloud.
                            </p>
                        </div>
                        <div className="w-full md:w-1/3">
                            <div className="bg-slate-950/50 p-6 rounded-xl border border-white/10 text-center">
                                <div className="text-4xl font-bold text-indigo-400 mb-2 font-mono">100%</div>
                                <div className="text-sm text-slate-400 uppercase tracking-widest">Web Browser Native</div>
                                <div className="my-4 h-px bg-white/10" />
                                <div className="text-4xl font-bold text-emerald-400 mb-2 font-mono">&lt;50ms</div>
                                <div className="text-sm text-slate-400 uppercase tracking-widest">Simulation Step</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
};

export default About;
