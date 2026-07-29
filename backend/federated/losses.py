"""
FedMed - Loss Functions
"""

from monai.losses import DiceCELoss


def get_loss_function():
    """
    Returns the Dice + Cross Entropy loss used for BraTS segmentation.
    """

    return DiceCELoss(
        to_onehot_y=True,
        softmax=True,
        include_background=True,
    )


if __name__ == "__main__":

    loss = get_loss_function()

    print("=" * 50)
    print("Loss Function Validation")
    print("=" * 50)
    print(loss)