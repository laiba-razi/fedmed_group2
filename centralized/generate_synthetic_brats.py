import os
import numpy as np
import nibabel as nib

def create_synthetic_brats(base_dir="brats_synthetic", num_patients=5, shape=(32, 32, 32)):
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
        
    modalities = ['t1', 't1ce', 't2', 'flair']
    
    for i in range(num_patients):
        patient_id = f"patient_{i:03d}"
        patient_dir = os.path.join(base_dir, patient_id)
        os.makedirs(patient_dir, exist_ok=True)
        
        # Create random synthetic images for each modality
        for mod in modalities:
            # Random values between 0 and 3000 (as per the dataset scale)
            img_data = np.random.randint(0, 3000, size=shape, dtype=np.int16)
            img = nib.Nifti1Image(img_data, np.eye(4))
            nib.save(img, os.path.join(patient_dir, f"{patient_id}_{mod}.nii.gz"))
            
        # Create synthetic segmentation mask
        # Background: 0, Necrosis/Core: 1, Edema: 2, Enhancing Tumor: 4
        labels = [0, 1, 2, 4]
        seg_data = np.random.choice(labels, size=shape).astype(np.uint8)
        
        # To make it more realistic, maybe make a small block in the center as tumor
        seg_data[:, :, :] = 0
        cx, cy, cz = shape[0]//2, shape[1]//2, shape[2]//2
        # tumor core
        seg_data[cx-5:cx+5, cy-5:cy+5, cz-5:cz+5] = 1
        # edema
        seg_data[cx-8:cx-5, cy-8:cy+8, cz-8:cz+8] = 2
        # enhancing tumor
        seg_data[cx-2:cx+2, cy-2:cy+2, cz-2:cz+2] = 4
        
        seg = nib.Nifti1Image(seg_data, np.eye(4))
        nib.save(seg, os.path.join(patient_dir, f"{patient_id}_seg.nii.gz"))
        
    print(f"Generated {num_patients} synthetic patient cases in {base_dir}")

if __name__ == "__main__":
    create_synthetic_brats()
