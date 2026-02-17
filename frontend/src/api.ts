import axios from 'axios';
import type { SystemState } from './types';

// Use relative URL so requests go through Vite proxy
const API_URL = '';

export const startSimulation = async (workload: string) => {
    await axios.post(`${API_URL}/start`, { workload });
};

export const updateWorkload = async (workload: string) => {
    await axios.post(`${API_URL}/update_workload`, { workload });
};

export const setPolicy = async (policy: string) => {
    await axios.post(`${API_URL}/set_policy`, { policy });
};

export const injectSpike = async () => {
    await axios.post(`${API_URL}/inject_spike`);
};

export const stepSimulation = async (): Promise<SystemState> => {
    const res = await axios.get(`${API_URL}/step`);
    return res.data;
};

export const resetSimulation = async () => {
    await axios.post(`${API_URL}/reset`);
};
