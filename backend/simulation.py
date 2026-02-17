import random
import time
from enum import Enum
from dataclasses import dataclass, field
from typing import List, Dict

class WorkloadType(Enum):
    COMPUTE_INTENSIVE = "Compute-Intensive"
    MEMORY_INTENSIVE = "Memory-Intensive"
    DYNAMIC_MIXED = "Dynamic-Mixed"
    AI_INFERENCE = "AI-Inference" # New
    IDLE = "Idle"

@dataclass
class SystemState:
    tick: int
    workload_type: str
    compute_demand: float
    memory_demand: float
    ai_demand: float        # New
    compute_memory_gb: float
    unified_memory_gb: float
    
    # Architecture Configuration
    active_compute_units: int
    active_memory_banks: int
    active_npus: int        # New: Neural Processing Units
    cache_mode: str
    frequency: float
    
    # Metrics
    throughput: float
    latency: float
    power_consumption: float
    utilization: float
    temperature: float
    policy: str
    throttled: bool
    
    # Logs
    logs: List[str]         # New: System Decision Logs

class WorkloadGenerator:
    def __init__(self, w_type: WorkloadType):
        self.type = w_type
        self.phase = 0
        self.spike_ticks = 0
    
    def inject_spike(self):
        self.spike_ticks = 10
    
    def next_demand(self, tick: int):
        base_noise = random.uniform(-5, 5)
        cd, md, ad = 0, 0, 0
        
        if self.type == WorkloadType.COMPUTE_INTENSIVE:
            cd, md, ad = 80, 30, 0
        elif self.type == WorkloadType.MEMORY_INTENSIVE:
            cd, md, ad = 30, 90, 0
        elif self.type == WorkloadType.AI_INFERENCE:
            cd, md, ad = 40, 60, 90 # High AI, Med Mem, Med Cpu
        elif self.type == WorkloadType.DYNAMIC_MIXED:
            phase = (tick // 20) % 4
            if phase == 0: cd, md, ad = 80, 30, 10
            elif phase == 1: cd, md, ad = 30, 90, 10
            elif phase == 2: cd, md, ad = 50, 50, 80 # AI Phase
            else: cd, md, ad = 60, 60, 0
        
        # Apply Spike
        if self.spike_ticks > 0:
            cd = min(100, cd + 40)
            md = min(100, md + 20)
            self.spike_ticks -= 1
            
        return (max(0, min(100, cd + base_noise)), 
                max(0, min(100, md + base_noise)),
                max(0, min(100, ad + base_noise)))

class ApplicationAwareArchitecture:
    def __init__(self):
        self.MAX_CORES = 16
        self.MAX_MEM_BANKS = 16
        self.MAX_NPUS = 8 # New specialized units
        
        self.active_cores = 4
        self.active_mem = 4
        self.active_npus = 0
        self.freq = 1.0
        
        self.temperature = 45.0
        self.policy = "Efficiency"
        self.logs = []
        
    def log(self, tick, msg):
        self.logs.append(f"[Tick {tick}] {msg}")
        if len(self.logs) > 10: self.logs.pop(0)

    def reconfigure(self, tick, compute_demand, mem_demand, ai_demand):
        is_throttled = False
        
        # Thermal Throttling
        if self.temperature > 85:
            self.freq = max(0.5, self.freq - 0.5)
            self.active_cores = max(1, self.active_cores - 2)
            self.active_npus = max(0, self.active_npus - 2)
            if tick % 5 == 0: self.log(tick, "⚠ THERMAL THROTTLING: Reducing Resources")
            return True
            
        # NPU Scaling (AI aware)
        if ai_demand > 0:
            target_npus = int((ai_demand / 100) * self.MAX_NPUS)
            if target_npus > self.active_npus:
                self.active_npus = min(self.MAX_NPUS, self.active_npus + 1)
                self.log(tick, f"Workload Intelligence: Scaling Up NPUs to {self.active_npus}")
            elif target_npus < self.active_npus and self.active_npus > 0:
                self.active_npus = max(0, self.active_npus - 1)
        else:
            if self.active_npus > 0:
                self.active_npus = 0
                self.log(tick, "Power Gating: Putting NPUs to Sleep")

        # CPU & Freq Scaling Logic
        if self.policy == "Performance":
             # Aggressive
            if compute_demand > 50:
                if self.active_cores < self.MAX_CORES: self.active_cores += 2
                self.freq = min(4.0, self.freq + 0.5)
            elif compute_demand < 30:
                self.active_cores = max(2, self.active_cores - 1)
        else:
             # Efficient
            if compute_demand > 80:
                if self.active_cores < self.MAX_CORES: self.active_cores += 1
                self.freq = min(2.5, self.freq + 0.1)
            elif compute_demand < 60:
                self.active_cores = max(1, self.active_cores - 1)
                self.freq = max(1.0, self.freq - 0.2)
        
        self.active_cores = min(self.MAX_CORES, self.active_cores)

        # Memory Scaling
        if mem_demand > 70:
            if self.active_mem < self.MAX_MEM_BANKS:
                self.active_mem += 2
        elif mem_demand < 40:
            self.active_mem = max(4, self.active_mem - 1)
        self.active_mem = min(self.MAX_MEM_BANKS, self.active_mem)
            
        return False

    def simulate_tick(self, tick, workload_gen) -> SystemState:
        c_demand, m_demand, a_demand = workload_gen.next_demand(tick)
        
        is_throttled = self.reconfigure(tick, c_demand, m_demand, a_demand)
        
        # Performance Model
        # NPUs are 2x more efficient at AI tasks than Cores
        npu_power = (self.active_npus / self.MAX_NPUS) * 100
        compute_capacity = (self.active_cores / self.MAX_CORES) * 100 * (self.freq / 4.0) * 4
        
        # Effective capacity blends CPU and NPU for AI workloads
        if workload_gen.type == WorkloadType.AI_INFERENCE:
             effective_capacity = compute_capacity * 0.5 + npu_power * 1.5 
        else:
             effective_capacity = compute_capacity
             
        mem_capacity = (self.active_mem / self.MAX_MEM_BANKS) * 100
        
        curr_throughput = min(max(c_demand, a_demand), effective_capacity)
        
        # Power
        # NPUs efficient: 0.3 factor vs CPU 0.8
        dynamic_power = (self.active_cores * 0.8 * (self.freq/1.0)**2) + (self.active_mem * 0.4) + (self.active_npus * 0.3 * self.freq)
        leakage_power = 5.0 * (self.temperature / 100.0)
        total_power = dynamic_power + leakage_power
        
        # Temperature
        cooling = 20.0 + (self.freq * 6)
        dt = (total_power - cooling) * 0.1
        self.temperature = max(30.0, self.temperature + dt)
        
        # Construct Logs only on events to save bandwidth, or just return window
        # We perform simple logging in reconfigure
        
        return SystemState(
            tick=tick,
            workload_type=workload_gen.type.value,
            compute_demand=c_demand,
            memory_demand=m_demand,
            ai_demand=a_demand,
            active_compute_units=self.active_cores,
            active_memory_banks=self.active_mem,
            active_npus=self.active_npus,
            compute_memory_gb= (c_demand / 100.0) * 16.0,
            unified_memory_gb= (m_demand / 100.0) * 16.0,
            cache_mode="Adaptive",
            frequency=self.freq,
            throughput=curr_throughput,
            latency=1.0 + max(0, (max(c_demand, a_demand) - effective_capacity)*0.05),
            power_consumption=total_power,
            utilization=min(100, (max(c_demand, a_demand)/ (effective_capacity+0.1))*100),
            temperature=self.temperature,
            policy=self.policy,
            throttled=is_throttled,
            logs=list(self.logs)
        )
