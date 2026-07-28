"""
FedMed - BraTS 2023 Dataset Loader
"""

from pathlib import Path

import torch
from torch.utils.data import Subset

from monai.data import CacheDataset
from torch.utils.data import DataLoader
from monai.transforms import (
    Compose,
    LoadImaged,
    EnsureChannelFirstd,
    NormalizeIntensityd,
    RandCropByPosNegLabeld,
    EnsureTyped,
)

from backend.federated.config import (
    DATASET_ROOT,
    IMAGE_SIZE,
    BATCH_SIZE,
    NUM_WORKERS,
    MODALITIES,
)


# ============================================================
# Helper
# ============================================================

def find_file(folder: Path, filename: str):

    nii = folder / f"{filename}.nii"

    if nii.exists():
        return str(nii)

    nii_gz = folder / f"{filename}.nii.gz"

    if nii_gz.exists():
        return str(nii_gz)

    return None


# ============================================================
# Dataset Discovery
# ============================================================

def get_patient_files():

    patients = []

    patient_dirs = sorted(DATASET_ROOT.iterdir())

    for patient_dir in patient_dirs:

        if not patient_dir.is_dir():
            continue

        patient_id = patient_dir.name

        image_paths = []

        valid = True

        for modality in MODALITIES:

            img = find_file(
                patient_dir,
                f"{patient_id}-{modality}",
            )

            if img is None:
                valid = False
                break

            image_paths.append(img)

        label = find_file(
            patient_dir,
            f"{patient_id}-seg",
        )

        if label is None:
            valid = False

        if valid:

            patients.append(
                {
                    "image": image_paths,
                    "label": label,
                }
            )

    print("=" * 60)
    print("BraTS Dataset")
    print("=" * 60)
    print("Patients :", len(patients))

    return patients


# ============================================================
# Train Transform
# ============================================================

def get_train_transforms():

    return Compose(
        [

            LoadImaged(
                keys=["image", "label"],
            ),

            EnsureChannelFirstd(
                keys=["image", "label"],
            ),

            NormalizeIntensityd(
                keys="image",
                nonzero=True,
                channel_wise=True,
            ),

            RandCropByPosNegLabeld(
                keys=["image", "label"],
                label_key="label",
                spatial_size=IMAGE_SIZE,
                pos=1,
                neg=1,
                num_samples=1,
                image_key="image",
                image_threshold=0,
            ),

            EnsureTyped(
                keys=["image", "label"],
            ),
        ]
    )


# ============================================================
# Validation Transform
# ============================================================

def get_val_transforms():

    return Compose(
        [

            LoadImaged(
                keys=["image", "label"],
            ),

            EnsureChannelFirstd(
                keys=["image", "label"],
            ),


            RandCropByPosNegLabeld(
                keys=["image", "label"],
                label_key="label",
                spatial_size=IMAGE_SIZE,
                pos=1,
                neg=1,
                num_samples=1,
                image_key="image",
                image_threshold=0,
            ),

            NormalizeIntensityd(
                keys="image",
                nonzero=True,
                channel_wise=True,
            ),

            EnsureTyped(
                keys=["image", "label"],
            ),
        ]
    )


# ============================================================
# Dataset
# ============================================================

def get_datasets():

    data = get_patient_files()

    train_size = int(0.8 * len(data))
    val_size = len(data) - train_size

    generator = torch.Generator().manual_seed(42)

    indices = torch.randperm(len(data), generator=generator).tolist()

    train_indices = indices[:train_size]
    val_indices = indices[train_size:]

    train_data = [data[i] for i in train_indices]
    val_data = [data[i] for i in val_indices]

    print(f"Training Patients   : {len(train_data)}")
    print(f"Validation Patients : {len(val_data)}")

    train_dataset = CacheDataset(
        data=train_data,
        transform=get_train_transforms(),
        cache_rate=0.1,
        num_workers=NUM_WORKERS,
    )

    val_dataset = CacheDataset(
        data=val_data,
        transform=get_val_transforms(),
        cache_rate=0.1,
        num_workers=NUM_WORKERS,
    )

    return train_dataset, val_dataset


# ============================================================
# Client Dataset Partitioning (Federated Learning)
# ============================================================

def partition_dataset(data: list, client_id: int, num_clients: int = 3, seed: int = 42) -> list:
    """
    Deterministically partition patient list across hospital nodes.
    Guarantees no overlap, complete coverage, and equal partition sizes where possible.
    """
    if client_id < 0 or client_id >= num_clients:
        raise ValueError(f"Invalid client_id {client_id} for num_clients={num_clients}")

    generator = torch.Generator().manual_seed(seed)
    shuffled_indices = torch.randperm(len(data), generator=generator).tolist()

    total_samples = len(data)
    chunk_size = total_samples // num_clients
    remainder = total_samples % num_clients

    start_idx = client_id * chunk_size + min(client_id, remainder)
    end_idx = start_idx + chunk_size + (1 if client_id < remainder else 0)

    client_indices = shuffled_indices[start_idx:end_idx]
    return [data[i] for i in client_indices]


def get_client_dataloader(
    client_id: int,
    num_clients: int = 3,
    batch_size: int = BATCH_SIZE,
    num_workers: int = NUM_WORKERS,
    seed: int = 42,
):
    """
    Returns (train_loader, val_loader) partitioned specifically for client_id.
    """
    all_patients = get_patient_files()
    client_patients = partition_dataset(all_patients, client_id, num_clients, seed=seed)

    train_size = int(0.8 * len(client_patients))

    generator = torch.Generator().manual_seed(seed + client_id)
    indices = torch.randperm(len(client_patients), generator=generator).tolist()

    train_indices = indices[:train_size]
    val_indices = indices[train_size:]

    train_data = [client_patients[i] for i in train_indices]
    val_data = [client_patients[i] for i in val_indices]

    print("=" * 60)
    print(f"Hospital Node {client_id+1}/{num_clients} Data Partition")
    print("=" * 60)
    print(f"Total Patients      : {len(client_patients)}")
    print(f"Training Patients   : {len(train_data)}")
    print(f"Validation Patients : {len(val_data)}")

    train_dataset = CacheDataset(
        data=train_data,
        transform=get_train_transforms(),
        cache_rate=0.1,
        num_workers=num_workers,
    )

    val_dataset = CacheDataset(
        data=val_data,
        transform=get_val_transforms(),
        cache_rate=0.1,
        num_workers=num_workers,
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
    )

    return train_loader, val_loader


# ============================================================
# DataLoader
# ============================================================

def get_dataloader():

    train_dataset, val_dataset = get_datasets()

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=NUM_WORKERS,
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=NUM_WORKERS,
    )

    return train_loader, val_loader


# ============================================================
# Test
# ============================================================

if __name__ == "__main__":

    train_loader, val_loader = get_dataloader()

    batch = next(iter(train_loader))

    print("=" * 60)
    print("Training Batch")
    print("=" * 60)

    print(batch["image"].shape)
    print(batch["label"].shape)