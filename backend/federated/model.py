"""
Brain Tumor Segmentation Model

This module defines the neural network used for
federated learning.
"""

from monai.networks.nets import UNet


def build_model():
    """
    Create and return the segmentation model.
    """

    model = UNet(
        spatial_dims=2,
        in_channels=1,
        out_channels=1,
        channels=(16, 32, 64, 128),
        strides=(2, 2, 2),
        num_res_units=2,
    )

    return model
def test_model():
    import torch

    model = build_model()

    dummy_input = torch.randn(1, 1, 128, 128)

    output = model(dummy_input)

    print("===================================")
    print("FedMed Model Validation")
    print("===================================")
    print(f"Input Shape : {dummy_input.shape}")
    print(f"Output Shape: {output.shape}")
    print("Model validation completed successfully.")


if __name__ == "__main__":
    test_model()