export interface SystemState {
    tick: number;
    workload_type: string;
    compute_demand: number;
    memory_demand: number;
    ai_demand: number;
    compute_memory_gb: number;
    unified_memory_gb: number;

    active_compute_units: number;
    active_memory_banks: number;
    active_npus: number;
    cache_mode: string;
    frequency: number;

    throughput: number;
    latency: number;
    power_consumption: number;
    utilization: number;
    temperature: number;
    policy: string;
    throttled: boolean;
    logs: string[];
}
