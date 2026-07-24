"""
FedMed - BraTS 2023 Dataset Loader

Loads the BraTS 2023 MRI dataset for 3D brain tumor segmentation.

Dataset Structure
-----------------
BraTS-GLI-00000-000/
    ├── BraTS-GLI-00000-000-t1c.nii
    ├── BraTS-GLI-00000-000-t1n.nii
    ├── BraTS-GLI-00000-000-t2f.nii
    ├── BraTS-GLI-00000-000-t2w.nii
    └── BraTS-GLI-00000-000-seg.nii
"""

from pathlib import Path

from monai.data import (
    CacheDataset,
    DataLoader,
)
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
# Helper Functions
# ============================================================

def find_file(folder: Path, filename: str):
    """
    Finds either .nii or .nii.gz
    """

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
    """
    Creates a MONAI compatible dataset list.

    Returns
    -------
    [
        {
            "image": [
                t1c,
                t1n,
                t2f,
                t2w
            ],
            "label": segmentation
        }
    ]
    """

    patients = []

    patient_dirs = sorted(DATASET_ROOT.iterdir())

    for patient_dir in patient_dirs:

        if not patient_dir.is_dir():
            continue

        patient_id = patient_dir.name

        image_paths = []

        valid_patient = True

        for modality in MODALITIES:

            image = find_file(
                patient_dir,
                f"{patient_id}-{modality}"
            )

            if image is None:
                valid_patient = False
                break

            image_paths.append(image)

        label = find_file(
            patient_dir,
            f"{patient_id}-seg"
        )

        if label is None:
            valid_patient = False

        if valid_patient:

            patients.append(
                {
                    "image": image_paths,
                    "label": label,
                }
            )

    print("=" * 50)
    print("BraTS Dataset Discovery")
    print("=" * 50)
    print(f"Patients Found : {len(patients)}")

    return patients


# ============================================================
# MONAI Transforms
# ============================================================

def get_train_transforms():

    return Compose(

        [

            LoadImaged(
                keys=["image", "label"]
            ),

            EnsureChannelFirstd(
                keys=["image", "label"]
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
                keys=["image", "label"]
            ),

        ]

    )


# ============================================================
# Dataset
# ============================================================

def get_dataset():

    data = get_patient_files()

    dataset = CacheDataset(
        data=data,
        transform=get_train_transforms(),
        cache_rate=0.1,
        num_workers=NUM_WORKERS,
    )

    return dataset


# ============================================================
# DataLoader
# ============================================================

def get_dataloader():

    dataset = get_dataset()

    loader = DataLoader(

        dataset,

        batch_size=BATCH_SIZE,

        shuffle=True,

        num_workers=NUM_WORKERS,

    )

    return loader


# ============================================================
# Validation
# ============================================================

if __name__ == "__main__":

    loader = get_dataloader()

    batch = next(iter(loader))

    images = batch["image"]

    labels = batch["label"]

    print("=" * 50)
    print("BraTS DataLoader Validation")
    print("=" * 50)

    print("Image Shape :", images.shape)
    print("Label Shape :", labels.shape)

    print("Image dtype :", images.dtype)
    print("Label dtype :", labels.dtype)