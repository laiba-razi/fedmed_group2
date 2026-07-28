"""
Project Configuration
FedMed - 3D Brain Tumor Segmentation
"""

from pathlib import Path

# ============================================================
# Dataset Configuration
# ============================================================

# Update this path to your extracted BraTS dataset
DATASET_ROOT = Path(
    r"D:\fedmed data set\ASNR-MICCAI-BraTS2023-GLI-Challenge-TrainingData"
)

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