import nibabel as nib

img = nib.load(
    r"D:\fedmed data set\ASNR-MICCAI-BraTS2023-GLI-Challenge-TrainingData\BraTS-GLI-00000-000\BraTS-GLI-00000-000-t1c.nii.gz"
)

print("Shape:", img.shape)
print("Data type:", img.get_data_dtype())