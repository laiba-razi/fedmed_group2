import os
import math
import glob

from monai.transforms import (
    Compose,
    LoadImaged,
    EnsureChannelFirstd,
    Orientationd,
    Spacingd,
    ScaleIntensityRanged,
    CropForegroundd,
    RandCropByPosNegLabeld,
    ToTensord,
    MapLabelValued,
    Lambdad,
    RandFlipd,
    RandAffined,
    RandSpatialCropd,
)
from monai.data import Dataset, DataLoader


def get_brats_data_files(data_dir):
    """
    Collects and structures the paths to the NIfTI files for each patient.
    """
    patients = sorted([p for p in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, p))])

    data_files = []
    for patient in patients:
        folder = os.path.join(data_dir, patient)
        data_files.append({
            "image": [
                os.path.join(folder, patient + "_t1.nii.gz"),
                os.path.join(folder, patient + "_t1ce.nii.gz"),
                os.path.join(folder, patient + "_t2.nii.gz"),
                os.path.join(folder, patient + "_flair.nii.gz"),
            ],
            "label": os.path.join(folder, patient + "_seg.nii.gz")
        })
    return data_files


def get_common_transforms():
    """
    Returns common transformations applied to both training and validation data.
    """
    return [
        LoadImaged(keys=["image", "label"]),
        EnsureChannelFirstd(keys=["image", "label"]),
        # Remap BraTS labels (0, 1, 2, 4) to sequential (0, 1, 2, 3)
        MapLabelValued(
            keys="label",
            orig_labels=(1, 2, 4),
            target_labels=(1, 2, 3)
        ),
        # Ensure label values are strictly within [0, 3] and are integers
        Lambdad(
            keys="label",
            func=lambda x: x.clamp(min=0, max=3).int()
        ),
        Orientationd(
            keys=["image", "label"],
            axcodes="RAS"
        ),
        Spacingd(
            keys=["image", "label"],
            pixdim=(1.0, 1.0, 1.0),
            mode=("bilinear", "nearest")
        ),
        ScaleIntensityRanged(
            keys=["image"],
            a_min=0,
            a_max=3000,
            b_min=0,
            b_max=1,
            clip=True
        ),
        CropForegroundd(
            keys=["image", "label"],
            source_key="image"
        ),
    ]


def get_train_transforms_aug():
    """
    Returns augmented transformations for training data.
    """
    common_transforms = get_common_transforms()
    train_augmentations = [
        RandSpatialCropd(keys=["image", "label"], roi_size=[96, 96, 96], random_size=False, max_roi_size=None, random_center=True),
        RandFlipd(keys=["image", "label"], spatial_axis=[0], prob=0.10),
        RandFlipd(keys=["image", "label"], spatial_axis=[1], prob=0.10),
        RandFlipd(keys=["image", "label"], spatial_axis=[2], prob=0.10),
        RandAffined(keys=["image", "label"], mode=("bilinear", "nearest"), prob=0.2, spatial_size=[128, 128, 128],
                    rotate_range=(math.pi/12, math.pi/12, math.pi/12), scale_range=(0.1, 0.1, 0.1)),
        ToTensord(keys=["image", "label"])
    ]
    return Compose(common_transforms + train_augmentations)


def get_val_transforms():
    """
    Returns transformations for validation data (without augmentation).
    """
    common_transforms = get_common_transforms()
    validation_specific_transforms = [
        ToTensord(keys=["image", "label"])
    ]
    return Compose(common_transforms + validation_specific_transforms)


if __name__ == "__main__":
    # Example Usage
    data_directory = "brats" # Adjust this path as needed

    # Get all file paths
    all_files = get_brats_data_files(data_directory)
    print(f"Found {len(all_files)} total data samples.")

    # Define split ratio (can be passed as args or configured)
    val_ratio = 0.2
    num_total = len(all_files)
    num_train = 20 # Using a small number for quick testing, as in the notebook
    num_val = int(math.ceil(num_total * val_ratio))

    train_files_subset = all_files[:num_train]
    val_files = all_files[num_total - num_val:]

    print(f"Training samples (subset): {len(train_files_subset)}")
    print(f"Validation samples: {len(val_files)}")

    # Create datasets and dataloaders
    train_ds = Dataset(
        data=train_files_subset,
        transform=get_train_transforms_aug()
    )
    train_loader = DataLoader(
        train_ds,
        batch_size=1,
        shuffle=True
    )

    val_ds = Dataset(
        data=val_files,
        transform=get_val_transforms()
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=1,
        shuffle=False
    )

    print(f"Train DataLoader size: {len(train_loader)}")
    print(f"Validation DataLoader size: {len(val_loader)}")

    # You can then iterate through the loaders in your training script:
    # for batch_data in train_loader:
    #     inputs = batch_data["image"]
    #     labels = batch_data["label"]
    #     print(f"Input shape: {inputs.shape}, Label shape: {labels.shape}")
    #     break # Just show one batch