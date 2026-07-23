"""
Dataset utilities for FedMed.

This module prepares MRI image datasets for
training and evaluation.
"""

from pathlib import Path

import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image


# ============================================================
# Dataset Configuration
# ============================================================

DATASET_PATH = Path(r"D:\ibm internship data\kaggle_3m")

IMAGE_SIZE = 128


# ============================================================
# Image Transformations
# ============================================================

image_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
])

mask_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
])


# ============================================================
# Dataset
# ============================================================

class BrainTumorDataset(Dataset):

    def __init__(self, root_dir=DATASET_PATH):

        self.samples = []

        root_dir = Path(root_dir)

        print(f"Dataset Path: {root_dir}")
        print(f"Exists: {root_dir.exists()}")

        patient_count = 0

        for patient_folder in root_dir.iterdir():

            if not patient_folder.is_dir():
                continue

            patient_count += 1

            

            for image_path in patient_folder.glob("*.tif"):

                

                if image_path.name.endswith("_mask.tif"):
                    continue

                mask_path = image_path.with_name(
                    image_path.stem + "_mask.tif"
                )

                if mask_path.exists():
                    self.samples.append((image_path, mask_path))

        print(f"Patients: {patient_count}")
        print(f"Pairs: {len(self.samples)}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):

        image_path, mask_path = self.samples[idx]

        image = Image.open(image_path).convert("L")
        mask = Image.open(mask_path).convert("L")

        image = image_transform(image)
        mask = mask_transform(mask)

        return image, mask

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):

        image_path, mask_path = self.samples[idx]

        image = Image.open(image_path).convert("L")
        mask = Image.open(mask_path).convert("L")

        image = image_transform(image)
        mask = mask_transform(mask)

        return image, mask


# ============================================================
# DataLoader
# ============================================================

def get_dataloader(batch_size=4):

    dataset = BrainTumorDataset()

    return DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True,
    )


# ============================================================
# Test
# ============================================================

def test_dataset():

    loader = get_dataloader(batch_size=4)

    images, masks = next(iter(loader))

    print("\n========== Dataset Validation ==========")
    print(f"Dataset Size : {len(loader.dataset)}")
    print(f"Images Shape : {images.shape}")
    print(f"Masks Shape  : {masks.shape}")
    print("Dataset is working correctly.")


if __name__ == "__main__":
    test_dataset()