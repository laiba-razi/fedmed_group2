"""
FedMed - 3D U-Net Model
"""

import torch

from monai.networks.nets import UNet

from backend.federated.config import (
    IMAGE_SIZE,
    IN_CHANNELS,
    OUT_CHANNELS,
)


def create_model():
    """
    Create a 3D U-Net model for BraTS segmentation.
    """

    model = UNet(
        spatial_dims=3,
        in_channels=IN_CHANNELS,
        out_channels=OUT_CHANNELS,
        channels=(16, 32, 64, 128, 256),
        strides=(2, 2, 2, 2),
        num_res_units=2,
    )

    return model


if __name__ == "__main__":

    model = create_model()

    x = torch.randn(
        1,
        IN_CHANNELS,
        *IMAGE_SIZE,
    )

    y = model(x)

    print("=" * 50)
    print("3D U-Net Validation")
    print("=" * 50)

    print(f"Input Shape  : {x.shape}")
    print(f"Output Shape : {y.shape}")

    total_params = sum(
        p.numel()
        for p in model.parameters()
    )

    trainable_params = sum(
        p.numel()
        for p in model.parameters()
        if p.requires_grad
    )

    print(f"Total Parameters     : {total_params:,}")
    print(f"Trainable Parameters : {trainable_params:,}")