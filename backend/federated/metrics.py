"""
FedMed - Evaluation Metrics
"""

from monai.metrics import DiceMetric
from monai.transforms import (
    AsDiscrete,
    Compose,
)
from monai.data import decollate_batch


def get_dice_metric():
    """
    Returns the Dice Metric used for validation.
    """

    return DiceMetric(
        include_background=True,
        reduction="mean",
        get_not_nans=False,
    )


def get_post_transforms():
    """
    Post-processing transforms for predictions and labels.
    """

    post_pred = Compose([
        AsDiscrete(argmax=True, to_onehot=4),
    ])

    post_label = Compose([
        AsDiscrete(to_onehot=4),
    ])

    return post_pred, post_label


if __name__ == "__main__":

    metric = get_dice_metric()

    print("=" * 50)
    print("Metrics Validation")
    print("=" * 50)
    print(metric)