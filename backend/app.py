from flask import Flask, jsonify, request
from flask_cors import CORS
from simulation import WorkloadGenerator, ApplicationAwareArchitecture, WorkloadType

app = Flask(__name__)
CORS(app)

# Global Simulation State
sim_state = {
    "arch": None,
    "workload": None,
    "tick": 0
}

@app.route('/start', methods=['POST'])
def start_simulation():
    data = request.json
    w_type_str = data.get('workload', 'Dynamic-Mixed')
    
    w_type = None
    if w_type_str == "Compute-Intensive":
        w_type = WorkloadType.COMPUTE_INTENSIVE
    elif w_type_str == "Memory-Intensive":
        w_type = WorkloadType.MEMORY_INTENSIVE
    elif w_type_str == "AI-Inference":
        w_type = WorkloadType.AI_INFERENCE
    else:
        w_type = WorkloadType.DYNAMIC_MIXED
        
    sim_state['arch'] = ApplicationAwareArchitecture()
    sim_state['workload'] = WorkloadGenerator(w_type)
    sim_state['tick'] = 0
    
    return jsonify({"message": "Simulation Started", "config": w_type_str})

@app.route('/update_workload', methods=['POST'])
def update_workload():
    data = request.json
    w_type_str = data.get('workload', 'Dynamic-Mixed')
    
    w_type = None
    if w_type_str == "Compute-Intensive":
        w_type = WorkloadType.COMPUTE_INTENSIVE
    elif w_type_str == "Memory-Intensive":
        w_type = WorkloadType.MEMORY_INTENSIVE
    elif w_type_str == "AI-Inference":
        w_type = WorkloadType.AI_INFERENCE
    else:
        w_type = WorkloadType.DYNAMIC_MIXED
        
    # Hot-swap the workload type
    if sim_state['workload']:
        sim_state['workload'].type = w_type
    else:
        # If not started, just ensure next start uses this? 
        # Actually start will take the param. 
        # But if user clicks start later with this new value, App.tsx should handle it.
        pass
    
    return jsonify({"message": "Workload Updated", "config": w_type_str})

@app.route('/set_policy', methods=['POST'])
def set_policy():
    data = request.json
    policy = data.get('policy', 'Efficiency')
    if sim_state['arch']:
        sim_state['arch'].policy = policy
    return jsonify({"message": "Policy Updated", "policy": policy})

@app.route('/inject_spike', methods=['POST'])
def inject_spike():
    if sim_state['workload']:
        sim_state['workload'].inject_spike()
    return jsonify({"message": "Spike Injected"})

@app.route('/step', methods=['GET'])
def step_simulation():
    if not sim_state['arch']:
        return jsonify({"error": "Simulation not started"}), 400
        
    arch = sim_state['arch']
    workload = sim_state['workload']
    tick = sim_state['tick']
    
    state = arch.simulate_tick(tick, workload)
    sim_state['tick'] += 1
    
    return jsonify(state.__dict__)

@app.route('/reset', methods=['POST'])
def reset_simulation():
    sim_state['arch'] = None
    sim_state['workload'] = None
    sim_state['tick'] = 0
    return jsonify({"message": "Simulation Reset"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
