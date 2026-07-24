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
# DataLoader Configuration
# ============================================================

BATCH_SIZE = 1
NUM_WORKERS = 2

# ============================================================
# Training Configuration
# ============================================================

LEARNING_RATE = 1e-4
NUM_EPOCHS = 50

# ============================================================
# Checkpoints
# ============================================================

CHECKPOINT_DIR = Path("checkpoints")
CHECKPOINT_DIR.mkdir(exist_ok=True)