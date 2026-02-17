# COA Project: Application-Aware Architecture Design

This project demonstrates a modern, adaptive computer architecture that reconfigures its resources (Compute vs Memory) based on application workloads.

## Project Component

1.  **Backend (Python/Flask)**: Runs the abstract simulation logic.
2.  **Frontend (React/TypeScript)**: Interactive Dashboard to visualize the architecture and results.

## How to Run

### Step 1: Start the Backend Simulation
1.  Open a terminal in `backend/`.
2.  Install requirements: `pip install -r requirements.txt`.
3.  Run the server: `python app.py`.
    *   It will run on `http://localhost:5000`.

### Step 2: Start the Frontend Dashboard
1.  Open a new terminal in `frontend/`.
2.  Run `npm install` (if not done already).
3.  Run `npm run dev`.
4.  Open the link provided (usually `http://localhost:5173`).

### Step 3: View the Simulation
*   Use the Dashboard to select a workload (e.g., "Dynamic-Mixed").
*   Click **Start Simulation**.
*   Watch resources (Cores/Memory) light up and metrics update in real-time.

## Report
The formal project report is available in `Project_Report.md`.
