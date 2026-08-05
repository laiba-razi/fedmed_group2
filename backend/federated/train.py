"""
FedMed - Centralized Training
"""

import torch
from tqdm import tqdm
from monai.data import decollate_batch
from backend.federated.config import (
    DEVICE,
    LEARNING_RATE,
    NUM_EPOCHS,
    CHECKPOINT_DIR,
    BEST_MODEL_PATH,
)

from backend.federated.dataset import get_dataloader
from backend.federated.model import create_model
from backend.federated.losses import get_loss_function
from backend.federated.metrics import (
    get_dice_metric,
    get_post_transforms,
)


# ============================================================
# Device
# ============================================================

def setup_device():

    if DEVICE == "cuda" and torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")

    print("=" * 60)
    print(f"Using Device : {device}")
    print("=" * 60)

    return device


# ============================================================
# Optimizer
# ============================================================

def get_optimizer(model):

    return torch.optim.AdamW(
        model.parameters(),
        lr=LEARNING_RATE,
    )


# ============================================================
# Initialize
# ============================================================

def initialize():

    device = setup_device()

    train_loader, val_loader = get_dataloader()

    model = create_model().to(device)

    optimizer = get_optimizer(model)

    loss_function = get_loss_function()

    dice_metric = get_dice_metric()

    post_pred, post_label = get_post_transforms()

    return (
        device,
        train_loader,
        val_loader,
        model,
        optimizer,
        loss_function,
        dice_metric,
        post_pred,
        post_label,
    )


def unpack_batch(batch, device):
    """
    Safely unpack images and labels from DataLoader batch dict or list of dicts.
    """
    if isinstance(batch, list):
        images = torch.cat([b["image"] for b in batch], dim=0).to(device)
        labels = torch.cat([b["label"] for b in batch], dim=0).to(device)
    elif isinstance(batch, dict):
        images = batch["image"].to(device)
        labels = batch["label"].to(device)
    else:
        raise TypeError(f"Unexpected batch type: {type(batch)}")
    return images, labels


# ============================================================
# Train
# ============================================================

def train_one_epoch(
    model,
    train_loader,
    optimizer,
    loss_function,
    device,
):

    model.train()

    running_loss = 0.0

    progress = tqdm(
        train_loader,
        desc="Training",
        leave=False,
    )

    for batch in progress:

        images, labels = unpack_batch(batch, device)

        optimizer.zero_grad()

        print("=" * 40)
        print("TRAIN BATCH")
        print("Image:", images.shape)
        print("Label:", labels.shape)

        outputs = model(images)

        loss = loss_function(outputs, labels)

        loss.backward()

        optimizer.step()

        running_loss += loss.item()

        progress.set_postfix(
            loss=f"{loss.item():.4f}"
        )

    return running_loss / len(train_loader)


# ============================================================
# Validation
# ============================================================

def validate(
    model,
    val_loader,
    loss_function,
    metric,
    post_pred,
    post_label,
    device,
):

    model.eval()

    metric.reset()

    running_loss = 0.0

    with torch.no_grad():

        for batch in tqdm(
            val_loader,
            desc="Validation",
            leave=False,
        ):

            images, labels = unpack_batch(batch, device)

            print(f"Image shape: {images.shape}")
            print(f"Label shape: {labels.shape}")

            outputs = model(images)


            loss = loss_function(outputs, labels)

            running_loss += loss.item()

            outputs_list = decollate_batch(outputs)
            labels_list = decollate_batch(labels)

            outputs_list = [post_pred(i) for i in outputs_list]
            labels_list = [post_label(i) for i in labels_list]

            metric(outputs_list, labels_list)

    dice = metric.aggregate().item()

    metric.reset()

    return running_loss / len(val_loader), dice


# ============================================================
# Checkpoint
# ============================================================

def save_checkpoint(
    model,
    optimizer,
    epoch,
    train_loss,
    val_loss,
    dice,
    best_dice,
):

    checkpoint = {
        "epoch": epoch,
        "model_state_dict": model.state_dict(),
        "optimizer_state_dict": optimizer.state_dict(),
        "train_loss": train_loss,
        "val_loss": val_loss,
        "dice": dice,
    }

    torch.save(
        checkpoint,
        CHECKPOINT_DIR / f"epoch_{epoch+1}.pth",
    )

    if dice > best_dice:

        torch.save(
            model.state_dict(),
            BEST_MODEL_PATH,
        )

        best_dice = dice

    return best_dice



# ============================================================
# Main
# ============================================================

def main():

    (
        device,
        train_loader,
        val_loader,
        model,
        optimizer,
        loss_function,
        dice_metric,
        post_pred,
        post_label,
    ) = initialize()

    best_dice = 0.0

    for epoch in range(NUM_EPOCHS):

        print()
        print("=" * 60)
        print(f"Epoch {epoch+1}/{NUM_EPOCHS}")
        print("=" * 60)

        train_loss = train_one_epoch(
            model=model,
            train_loader=train_loader,
            optimizer=optimizer,
            loss_function=loss_function,
            device=device,
        )

        val_loss, dice = validate(
            model=model,
            val_loader=val_loader,
            loss_function=loss_function,
            metric=dice_metric,
            post_pred=post_pred,
            post_label=post_label,
            device=device,
        )

        best_dice = save_checkpoint(
            model=model,
            optimizer=optimizer,
            epoch=epoch,
            train_loss=train_loss,
            val_loss=val_loss,
            dice=dice,
            best_dice=best_dice,
        )

        print(f"Train Loss : {train_loss}")
        print(f"Val Loss   : {val_loss:.4f}")
        print(f"Dice Score : {dice:.4f}")
        print(f"Best Dice  : {best_dice:.4f}")

    print()
    print("=" * 60)
    print("Training Complete")
    print("=" * 60)


if __name__ == "__main__":
    main()