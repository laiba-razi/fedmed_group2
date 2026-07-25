"""
FedMed - Centralized Training
"""

from pathlib import Path
from pyexpat import model

import torch
from tqdm import tqdm

from backend.federated.config import (
    DEVICE,
    LEARNING_RATE,
)

from backend.federated.dataset import (
    get_dataloader,
)

from backend.federated.model import (
    create_model,
)

from backend.federated.losses import (
    get_loss_function,
)

from backend.federated.metrics import (
    get_dice_metric,
)


# ============================================================
# Device
# ============================================================

def setup_device():

    if DEVICE == "cuda" and torch.cuda.is_available():

        device = torch.device("cuda")

    else:

        device = torch.device("cpu")

    print("=" * 50)
    print(f"Using Device : {device}")
    print("=" * 50)

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
# Initialize Everything
# ============================================================

def initialize():

    device = setup_device()

    train_loader = get_dataloader()

    model = create_model().to(device)

    optimizer = get_optimizer(model)

    loss_function = get_loss_function()

    dice_metric = get_dice_metric()

    return (
        device,
        train_loader,
        model,
        optimizer,
        loss_function,
        dice_metric,
    )


# ============================================================
# Training
# ============================================================

def train_one_epoch(
    model,
    train_loader,
    optimizer,
    loss_function,
    device,
    max_batches=None,
):
    """
    Train the model for one epoch.

    Returns:
        float: Average training loss
    """

    model.train()

    total_loss = 0.0

    progress_bar = tqdm(
    enumerate(train_loader),
    total=len(train_loader),
    desc="Training",
    leave=False,
)

for batch_idx, batch in progress_bar:

    if max_batches is not None and batch_idx >= max_batches:
        break

    images = batch["image"].to(device)
    labels = batch["label"].to(device)

    optimizer.zero_grad()

    outputs = model(images)

    loss = loss_function(outputs, labels)

    loss.backward()

    optimizer.step()

    total_loss += loss.item()

    progress_bar.set_postfix(loss=f"{loss.item():.4f}")
   

    for batch in progress_bar:
        

        images = batch["image"].to(device)

        labels = batch["label"].to(device)

        optimizer.zero_grad()
        

        outputs = model(images)

        loss = loss_function(outputs, labels)

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

        progress_bar.set_postfix(
            loss=f"{loss.item():.4f}"
        )
    processed_batches = (
    min(len(train_loader), max_batches)
    if max_batches is not None
    else len(train_loader)
)

    average_loss = total_loss / processed_batches
    return average_loss
    


# ============================================================
# Validation
# ============================================================

if __name__ == "__main__":

    (
        device,
        train_loader,
        model,
        optimizer,
        loss_function,
        dice_metric,
    ) = initialize()

    print("\nStarting one training epoch...\n")

    train_loss = train_one_epoch(
    model=model,
    train_loader=train_loader,
    optimizer=optimizer,
    loss_function=loss_function,
    device=device,
    max_batches=10,
)
    print("\n" + "=" * 50)
    print(f"Training Loss : {train_loss:.4f}")
    print("=" * 50)