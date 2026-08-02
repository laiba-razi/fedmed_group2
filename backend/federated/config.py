"""
Project Configuration
FedMed - 3D Brain Tumor Segmentation
"""

import os
from pathlib import Path

# ============================================================
# Dataset Configuration
# ============================================================

# Set FEDMED_DATASET_ROOT to the directory containing the extracted BraTS data.
# The relative default keeps the project portable for local and Streamlit deployments.
DATASET_ROOT = Path(os.getenv("FEDMED_DATASET_ROOT", "datasets/BraTS2023"))

# ============================================================
# Image Configuration
# ============================================================

# Training patch size (we'll use patches instead of full volumes)
IMAGE_SIZE = (128, 128, 128)

# MRI modalities used
MODALITIES = [
    "t1c",
    "t1n",
    "t2f",
    "t2w",
]

# ============================================================
# Model Configuration
# ============================================================

IN_CHANNELS = 4
OUT_CHANNELS = 4

# ============================================================
# DataLoader Configuration
# ============================================================

BATCH_SIZE = 1
NUM_WORKERS = 0

# ============================================================
# Training Configuration
# ============================================================

LEARNING_RATE = 1e-4
NUM_EPOCHS = 5

# ============================================================
# Checkpoints
# ============================================================

CHECKPOINT_DIR = Path("checkpoints")
CHECKPOINT_DIR.mkdir(exist_ok=True)

# ============================================================
# Device Configuration
# ============================================================

DEVICE = "cuda"

# ============================================================
# Checkpoint Configuration
# ============================================================

BEST_MODEL_NAME = "best_model.pth"
BEST_MODEL_PATH = CHECKPOINT_DIR / BEST_MODEL_NAME

# ============================================================
# Federated Learning Configuration (Flower)
# ============================================================

SERVER_ADDRESS = "127.0.0.1:8080"
NUM_CLIENTS = 3
NUM_ROUNDS = 5
LOCAL_EPOCHS = 1
MIN_AVAILABLE_CLIENTS = 3
MIN_FIT_CLIENTS = 3
MIN_EVALUATE_CLIENTS = 3
RANDOM_SEED = 42

PROJECT_NAME = "FedMed"
VERSION = "1.0.0"

METRICS_DIR = Path("logs")
METRICS_DIR.mkdir(exist_ok=True)
METRICS_FILE = METRICS_DIR / "fl_metrics.json"
