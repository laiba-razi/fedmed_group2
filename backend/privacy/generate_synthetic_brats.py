"""
FedMed - Synthetic BraTS Dataset Generator
Generates mock 3D MRI volumes to test federated learning pipelines.
"""

import os
from pathlib import Path
import numpy as np
import nibabel as nib

# Dataset Configuration
ROOT_DIR = Path(__file__).parent.parent.parent / "datasets" / "synthetic_brats"
NUM_PATIENTS = 6
IMAGE_SIZE = (128, 128, 128)
MODALITIES = ["t1c", "t1n", "t2f", "t2w"]

def create_synthetic_tumor_mask(shape):
    """Create a 3D sphere as a mock tumor segmentation mask."""
    mask = np.zeros(shape, dtype=np.uint8)
    center = [s // 2 for s in shape]
    radius = 15

    z, y, x = np.ogrid[:shape[0], :shape[1], :shape[2]]
    dist_from_center = np.sqrt((x - center[2])**2 + (y - center[1])**2 + (z - center[0])**2)
    mask[dist_from_center <= radius] = 1 # Mock tumor class 1

    return mask

def generate_patient_data(patient_id):
    """Generate mock MRI modalities and mask for a single patient."""
    patient_dir = ROOT_DIR / patient_id
    patient_dir.mkdir(parents=True, exist_ok=True)
    print(f"Generating data for {patient_id} in {patient_dir}")

    affine = np.eye(4)
    
    # 1. Generate Tumor Mask
    mask_data = create_synthetic_tumor_mask(IMAGE_SIZE)
    mask_img = nib.Nifti1Image(mask_data, affine)
    nib.save(mask_img, str(patient_dir / f"{patient_id}-seg.nii.gz"))

    # 2. Generate Modalities (Noise + intensity over the tumor)
    for modality in MODALITIES:
        # Background noise
        img_data = np.random.normal(loc=100, scale=20, size=IMAGE_SIZE).astype(np.float32)
        # Highlight tumor region slightly to simulate signal
        img_data[mask_data == 1] += 50.0 
        
        img = nib.Nifti1Image(img_data, affine)
        nib.save(img, str(patient_dir / f"{patient_id}-{modality}.nii.gz"))

def main():
    print(f"Creating synthetic dataset in: {ROOT_DIR}")
    ROOT_DIR.mkdir(parents=True, exist_ok=True)
    
    for i in range(1, NUM_PATIENTS + 1):
        patient_id = f"BraTS-GLI-{i:05d}-000"
        generate_patient_data(patient_id)
        
    print("Dataset generation complete!")

if __name__ == "__main__":
    main()
