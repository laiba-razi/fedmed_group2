"""
FedMed - FastAPI Backend Server
Provides REST API endpoints for live metrics, federated simulation launching,
and 3D MRI slice data for the frontend dashboard.
"""

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Optional
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="FedMed API Server", version="1.0.0")

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ROOT = Path(__file__).parent.parent.resolve()
LOGS_DIR = PROJECT_ROOT / "logs"
LOGS_DIR.mkdir(exist_ok=True)
METRICS_FILE = LOGS_DIR / "fl_metrics.json"

# Process handle for federated launcher
simulation_process: Optional[subprocess.Popen] = None


@app.get("/")
def root():
    return {"message": "FedMed FastAPI Backend Active", "status": "ONLINE"}


@app.get("/api/metrics")
def get_metrics():
    """
    Return live training metrics from logs/fl_metrics.json.
    Returns empty rounds array if training has not started.
    """
    if METRICS_FILE.exists():
        try:
            with open(METRICS_FILE, "r") as f:
                data = json.load(f)
                return data
        except Exception as e:
            pass
    
    return {
        "project": "FedMed",
        "num_rounds_completed": 0,
        "best_dice_score": 0.0,
        "rounds": []
    }


@app.post("/api/reset")
def reset_metrics():
    """
    Reset metrics file for a fresh simulation run.
    """
    initial_data = {
        "project": "FedMed",
        "num_rounds_completed": 0,
        "best_dice_score": 0.0,
        "rounds": []
    }
    try:
        with open(METRICS_FILE, "w") as f:
            json.dump(initial_data, f, indent=2)
        return {"status": "SUCCESS", "message": "Metrics reset successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset metrics: {str(e)}")


@app.get("/api/nodes")
def get_nodes():
    """
    Return active hospital nodes status.
    """
    return [
        {
            "id": "Node-1",
            "name": "St. Jude Children's Hospital",
            "port": 8081,
            "samples": 417,
            "status": "ONLINE",
            "loss": "--",
            "dice": "--",
            "latency": "18ms"
        },
        {
            "id": "Node-2",
            "name": "Mayo Clinic Neuroradiology",
            "port": 8082,
            "samples": 420,
            "status": "ONLINE",
            "loss": "--",
            "dice": "--",
            "latency": "24ms"
        },
        {
            "id": "Node-3",
            "name": "Charité University Hospital Berlin",
            "port": 8083,
            "samples": 414,
            "status": "ONLINE",
            "loss": "--",
            "dice": "--",
            "latency": "31ms"
        }
    ]


class LaunchRequest(BaseModel):
    num_rounds: int = 5
    num_clients: int = 3


@app.post("/api/launch")
def launch_fl_simulation(req: LaunchRequest, background_tasks: BackgroundTasks):
    """
    Trigger the launch_federated.py script in background after resetting metrics.
    """
    global simulation_process

    # Reset metrics file for clean run
    reset_metrics()

    venv_python = PROJECT_ROOT / ".venv" / "Scripts" / "python.exe"
    python_exe = str(venv_python) if venv_python.exists() else sys.executable

    cmd = [python_exe, "launch_federated.py", str(req.num_rounds)]

    try:
        simulation_process = subprocess.Popen(cmd, cwd=str(PROJECT_ROOT))
        return {
            "status": "STARTED",
            "message": f"Launched FedMed simulation ({req.num_rounds} rounds, {req.num_clients} clients).",
            "pid": simulation_process.pid
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to launch simulation: {str(e)}")


@app.get("/api/status")
def get_status():
    """
    Check status of FL simulation.
    """
    global simulation_process
    is_running = simulation_process is not None and simulation_process.poll() is None
    return {
        "is_running": is_running,
        "pid": simulation_process.pid if simulation_process else None,
        "metrics_available": METRICS_FILE.exists()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=True)
