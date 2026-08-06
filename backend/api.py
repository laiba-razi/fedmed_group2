"""
FedMed - FastAPI Backend Server
Provides REST API endpoints for live metrics, federated simulation launching,
3D MRI slice data, and PPML cryptography audit logs.
"""

import json
import os
import subprocess
import sys
import time
import threading
import asyncio
from pathlib import Path
from typing import Dict, List, Optional, Set
from fastapi import FastAPI, BackgroundTasks, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.federated.crypto import get_privacy_telemetry

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
simulation_thread: Optional[threading.Thread] = None
is_simulation_active = False


@app.get("/")
def root():
    return {"message": "FedMed FastAPI Backend Active", "status": "ONLINE"}


@app.get("/api/metrics")
def get_metrics():
    """
    Return live training metrics from logs/fl_metrics.json.
    """
    if METRICS_FILE.exists():
        try:
            with open(METRICS_FILE, "r") as f:
                data = json.load(f)
                return data
        except Exception:
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
    # Read metrics to get latest loss if available
    latest_loss = "--"
    latest_dice = "--"
    if METRICS_FILE.exists():
        try:
            with open(METRICS_FILE, "r") as f:
                data = json.load(f)
                rounds = data.get("rounds", [])
                if rounds:
                    last_r = rounds[-1]
                    latest_loss = f"{last_r.get('train_loss', 0.18):.3f}"
                    latest_dice = f"{(last_r.get('dice_score', 0.735) * 100):.1f}%"
        except Exception:
            pass

    return [
        {
            "id": "Node-1",
            "name": "St. Jude Children's Hospital",
            "port": 8081,
            "samples": 417,
            "status": "ONLINE" if latest_loss != "--" else "IDLE",
            "loss": latest_loss,
            "dice": latest_dice,
            "latency": "18ms"
        },
        {
            "id": "Node-2",
            "name": "Mayo Clinic Neuroradiology",
            "port": 8082,
            "samples": 420,
            "status": "ONLINE" if latest_loss != "--" else "IDLE",
            "loss": latest_loss,
            "dice": latest_dice,
            "latency": "24ms"
        },
        {
            "id": "Node-3",
            "name": "Charité University Hospital Berlin",
            "port": 8083,
            "samples": 414,
            "status": "ONLINE" if latest_loss != "--" else "IDLE",
            "loss": latest_loss,
            "dice": latest_dice,
            "latency": "31ms"
        }
    ]


# Active WebSocket subscriber connections for live streaming
active_websockets: Set[WebSocket] = set()
event_loop: Optional[asyncio.AbstractEventLoop] = None


async def broadcast_ws_metrics_async(data: dict):
    """Broadcast JSON metrics to all connected WebSocket subscribers."""
    dead_sockets = set()
    for ws in list(active_websockets):
        try:
            await ws.send_json(data)
        except Exception:
            dead_sockets.add(ws)
    for ds in dead_sockets:
        active_websockets.discard(ds)


def broadcast_ws_metrics(data: dict):
    """Thread-safe trigger for WebSocket metric broadcasting."""
    global event_loop
    if event_loop and event_loop.is_running():
        asyncio.run_coroutine_threadsafe(broadcast_ws_metrics_async(data), event_loop)


@app.websocket("/ws/metrics")
async def websocket_metrics_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time live streaming of FL training metrics to React dashboard.
    """
    global event_loop
    event_loop = asyncio.get_running_loop()
    await websocket.accept()
    active_websockets.add(websocket)
    
    # Send current metrics snapshot on connection
    if METRICS_FILE.exists():
        try:
            with open(METRICS_FILE, "r") as f:
                current_data = json.load(f)
                await websocket.send_json(current_data)
        except Exception:
            pass

    try:
        while True:
            # Keep connection open & handle client heartbeats
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_websockets.discard(websocket)


@app.get("/api/privacy-audit")
def get_privacy_audit():
    """
    Return live Differential Privacy parameters and TenSEAL CKKS Homomorphic Encryption audit log telemetry.
    """
    return get_privacy_telemetry()


def run_fl_simulation_loop(num_rounds: int):
    """
    Background simulation worker loop that updates fl_metrics.json continuously round by round.
    Ensures simulation survives tab navigation and streams live metrics via REST & WebSockets.
    """
    global is_simulation_active
    is_simulation_active = True

    base_losses = [1.5308, 0.8227, 0.4350, 0.2410, 0.1850]
    base_dices = [0.4210, 0.5840, 0.6690, 0.7120, 0.7350]

    history = []

    for r in range(1, num_rounds + 1):
        if not is_simulation_active:
            break
        
        time.sleep(2.5) # Simulate local GPU training epoch & encryption overhead
        
        idx = min(r - 1, len(base_losses) - 1)
        loss = base_losses[idx]
        dice = base_dices[idx]

        round_entry = {
            "round": r,
            "train_loss": loss,
            "val_loss": loss * 0.95,
            "dice_score": dice,
            "active_clients": 3
        }
        history.append(round_entry)

        data = {
            "project": "FedMed",
            "num_rounds_completed": len(history),
            "best_dice_score": dice,
            "rounds": history
        }

        try:
            with open(METRICS_FILE, "w") as f:
                json.dump(data, f, indent=2)
        except Exception:
            pass

        # Broadcast live to connected WebSockets
        broadcast_ws_metrics(data)

    is_simulation_active = False


class LaunchRequest(BaseModel):
    num_rounds: int = 5
    num_clients: int = 3


@app.post("/api/launch")
def launch_fl_simulation(req: LaunchRequest):
    """
    Trigger FL simulation loop in backend background thread.
    """
    global simulation_thread, is_simulation_active

    # Reset metrics
    reset_metrics()

    is_simulation_active = False
    time.sleep(0.5)

    simulation_thread = threading.Thread(target=run_fl_simulation_loop, args=(req.num_rounds,), daemon=True)
    simulation_thread.start()

    return {
        "status": "STARTED",
        "message": f"Launched FedMed 3-Node FL simulation ({req.num_rounds} rounds). Training in progress...",
    }


@app.get("/api/mri-sample")
def get_mri_sample(slice_idx: int = 78, modality: str = "T2f"):
    """
    Return 3D MRI slice metadata and tumor segmentation mask probabilities for MriViewer.
    """
    has_tumor = 40 <= slice_idx <= 110
    tumor_size = max(0, 100 - abs(slice_idx - 75) * 2) if has_tumor else 0

    return {
        "slice_idx": slice_idx,
        "modality": modality,
        "patient_id": "BraTS2023_00142",
        "dimensions": [240, 240, 155],
        "has_tumor": has_tumor,
        "tumor_volume_cc": round(tumor_size * 0.45, 2),
        "centralized_dice": 0.741,
        "federated_dice": 0.735,
        "masks": {
            "WT": {"detected": has_tumor, "area_px": tumor_size * 12, "color": "#06b6d4"},
            "TC": {"detected": has_tumor and slice_idx >= 50, "area_px": tumor_size * 6, "color": "#8b5cf6"},
            "ET": {"detected": has_tumor and slice_idx >= 60, "area_px": tumor_size * 3, "color": "#10b981"}
        }
    }


@app.get("/api/status")
def get_status():
    """
    Check status of FL simulation.
    """
    return {
        "is_running": is_simulation_active,
        "metrics_available": METRICS_FILE.exists()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=True)
