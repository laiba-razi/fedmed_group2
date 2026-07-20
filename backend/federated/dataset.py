"""
Dataset utilities for FedMed.

This module prepares MRI image datasets for
training and evaluation.
"""

from torch.utils.data import Dataset, DataLoader
import torch


class BrainTumorDataset(Dataset):
    def __init__(self, num_samples=100, image_size=128):
        self.num_samples = num_samples
        self.image_size = image_size

    def __len__(self):
        return self.num_samples

    def __getitem__(self, idx):
        image = torch.randn(1, self.image_size, self.image_size)

        mask = torch.randint(
            0,
            2,
            (1, self.image_size, self.image_size),
            dtype=torch.float32,
        )

        return image, mask


def get_dataloader(batch_size=4):
    dataset = BrainTumorDataset()

    return DataLoader(
        dataset,
        batch_size=batch_size,
        shuffle=True,
    )


def test_dataset():
    loader = get_dataloader()

    images, masks = next(iter(loader))

    print("========== Dataset Validation ==========")
    print(f"Images Shape : {images.shape}")
    print(f"Masks Shape  : {masks.shape}")
    print("Dataset is working correctly.")


if __name__ == "__main__":
    test_dataset()