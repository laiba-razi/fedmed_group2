"""
FedMed - Federated Learning Simulation Launcher
Role: Federated Learning Specialist

Launches 1 Central Flower Server and 3 Isolated Hospital Clients in parallel sub-processes.
- Hospital 1 (Node 0)
- Hospital 2 (Node 1)
- Hospital 3 (Node 2)
"""

import os
import sys
import time
import subprocess
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(levelname)s] %(message)s")
logger = logging.getLogger("FedMedLauncher")

# Resolve python interpreter path (.venv or current sys.executable)
PROJECT_ROOT = Path(__file__).parent.resolve()
VENV_PYTHON = PROJECT_ROOT / ".venv" / "Scripts" / "python.exe"

PYTHON_EXE = str(VENV_PYTHON) if VENV_PYTHON.exists() else sys.executable


def launch_simulation(num_clients: int = 3, num_rounds: int = 5, local_epochs: int = 1):
    logger.info("=" * 70)
    logger.info("FedMed Cross-Silo Federated Learning Launcher")
    logger.info(f"Python Executable : {PYTHON_EXE}")
    logger.info(f"Hospital Nodes    : {num_clients}")
    logger.info(f"FL Rounds         : {num_rounds}")
    logger.info(f"Local Epochs      : {local_epochs}")
    logger.info("=" * 70)

    processes = []

    try:
        # 1. Start Flower Central Server
        server_cmd = [
            PYTHON_EXE,
            "-m",
            "backend.federated.server",
            "--num-rounds",
            str(num_rounds),
            "--min-clients",
            str(num_clients),
        ]
        logger.info("Starting Flower Server process...")
        server_process = subprocess.Popen(server_cmd, cwd=str(PROJECT_ROOT))
        processes.append(("Flower Server", server_process))

        # Wait for gRPC server socket initialization
        time.sleep(4)

        # 2. Start Hospital Client Nodes
        hospital_names = ["Hospital 1 (St. Jude)", "Hospital 2 (Mayo Clinic)", "Hospital 3 (Charité)"]

        for i in range(num_clients):
            name = hospital_names[i] if i < len(hospital_names) else f"Hospital Node {i + 1}"
            client_cmd = [
                PYTHON_EXE,
                "-m",
                "backend.federated.client",
                "--client-id",
                str(i),
                "--num-clients",
                str(num_clients),
                "--epochs",
                str(local_epochs),
            ]
            logger.info(f"Launching {name} (Client ID: {i})...")
            client_process = subprocess.Popen(client_cmd, cwd=str(PROJECT_ROOT))
            processes.append((name, client_process))
            time.sleep(1)

        logger.info("=" * 70)
        logger.info("All FedMed processes initialized. Training loop in progress...")
        logger.info("Press Ctrl+C to terminate simulation.")
        logger.info("=" * 70)

        # Wait for all processes to finish
        for name, proc in processes:
            proc.wait()

        logger.info("Federated training simulation completed successfully!")

    except KeyboardInterrupt:
        logger.info("\nTermination requested by user. Terminating all processes...")
    finally:
        for name, proc in processes:
            if proc.poll() is None:
                logger.info(f"Stopping {name}...")
                proc.terminate()
                proc.wait()


if __name__ == "__main__":
    num_rounds = int(sys.argv[1]) if len(sys.argv) > 1 else 3
    launch_simulation(num_rounds=num_rounds)
