🚀 COA Project: Application-Aware Architecture Design

An adaptive computer architecture simulation that dynamically reallocates system resources (Compute vs Memory) based on application workload behavior.

This project demonstrates how modern systems can intelligently respond to changing workload patterns to improve performance and resource efficiency.

🧠 Project Overview

Traditional architectures allocate fixed resources regardless of workload type.
This project simulates an application-aware architecture that:

Monitors workload characteristics

Dynamically reallocates compute and memory resources

Optimizes performance metrics in real time

Visualizes architectural behavior through an interactive dashboard

🏗️ Project Structure
COA/
│
├── backend/          # Flask-based simulation engine
├── frontend/         # React + TypeScript interactive dashboard
├── Project_Report.md # Formal project documentation
└── README.md

⚙️ Tech Stack
Backend

Python

Flask

Simulation Logic Engine

Frontend

React

TypeScript

Vite

Tailwind (if used)

▶️ How to Run the Project
1️⃣ Start the Backend (Simulation Engine)

Open a terminal inside the backend/ folder:

pip install -r requirements.txt
python app.py


Backend runs at:

http://localhost:5000

2️⃣ Start the Frontend (Interactive Dashboard)

Open a new terminal inside the frontend/ folder:

npm install
npm run dev


Open the link shown in the terminal (typically):

http://localhost:5173

3️⃣ Run the Simulation

Select a workload (e.g., Dynamic-Mixed)

Click Start Simulation

Observe:

Resource reallocation (Cores vs Memory)

Real-time performance metrics

System adaptation behavior

📊 Features

Real-time workload simulation

Dynamic resource reallocation

Interactive architecture visualization

Performance metrics tracking

Modular backend simulation logic

Clean frontend dashboard interface

📄 Documentation

The detailed project report is available here:

Project_Report.md


It includes:

Architectural design principles

Simulation methodology

Performance analysis

Implementation details

🎯 Learning Outcomes

This project demonstrates:

Application-aware system design

Dynamic resource allocation strategies

Frontend-backend integration

Simulation modeling in computer architecture

Real-time system visualization

👨‍💻 Author

Adhi Vignesh
B.Tech – Artificial Intelligence & Machine Learning
