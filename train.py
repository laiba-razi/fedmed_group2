import os
import math
import torch
import torch.nn.functional as F

from monai.networks.nets import UNet
from monai.losses import DiceLoss
from monai.metrics import DiceMetric
from monai.transforms import Activations, AsDiscrete
from monai.data import decollate_batch, Dataset, DataLoader

# Assuming dataset.py is in the same directory
from dataset import get_brats_data_files, get_train_transforms_aug, get_val_transforms

def main(data_dir="brats", max_epochs=50, val_ratio=0.2, num_train_subset=800):
    # 1. Device Configuration
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # 2. Data Preparation
    print("Preparing data...")
    all_files = get_brats_data_files(data_dir)
    num_total = len(all_files)
    
    # Using subset for training as in notebook, and fixed val_ratio for validation
    train_files_subset = all_files[:num_train_subset]
    num_val = int(math.ceil(num_total * val_ratio))
    val_files = all_files[num_total - num_val:] # Use last part for validation

    print(f"Total data samples: {num_total}")
    print(f"Training samples (subset): {len(train_files_subset)}")
    print(f"Validation samples: {len(val_files)}")

    train_ds = Dataset(
        data=train_files_subset,
        transform=get_train_transforms_aug()
    )
    train_loader = DataLoader(
        train_ds,
        batch_size=1,
        shuffle=True
    )

    val_ds = Dataset(
        data=val_files,
        transform=get_val_transforms()
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=1,
        shuffle=False
    )
    print(f"Train DataLoader size: {len(train_loader)}")
    print(f"Validation DataLoader size: {len(val_loader)}")

    # 3. Model, Loss, Optimizer, Metrics
    model = UNet(
        spatial_dims=3,
        in_channels=4,
        out_channels=4, # 4 classes (0, 1, 2, 3)
        channels=(16, 32, 64, 128, 256),
        strides=(2, 2, 2, 2),
        num_res_units=2,
    ).to(device)

    loss_function = DiceLoss(to_onehot_y=True, softmax=True)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    dice_metric = DiceMetric(include_background=False, reduction="mean")

    # Post-processing for evaluation
    post_pred = Compose([
        Activations(softmax=True),
        AsDiscrete(argmax=True, to_onehot=4) # 4 classes
    ])
    post_label = Compose([
        AsDiscrete(to_onehot=4) # 4 classes
    ])

    # 4. Training and Validation Loop
    best_metric = -1
    best_metric_epoch = -1

    print(f"Starting training for {max_epochs} epochs...")

    for epoch in range(max_epochs):
        print(f"\nEpoch {epoch+1}/{max_epochs}")

        model.train()
        epoch_loss = 0

        for batch_data in train_loader:
            inputs = batch_data["image"].to(device)
            labels = batch_data["label"].to(device)

            # Dynamic padding to ensure dimensions are divisible by 16
            current_d, current_h, current_w = inputs.shape[2:]
            target_d = current_d + (16 - current_d % 16) % 16
            target_h = current_h + (16 - current_h % 16) % 16
            target_w = current_w + (16 - current_w % 16) % 16
            padding = (0, target_w - current_w, 0, target_h - current_h, 0, target_d - current_d)

            inputs = F.pad(inputs, padding, "constant", 0)
            labels = F.pad(labels, padding, "constant", 0)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = loss_function(outputs, labels)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()

        avg_loss = epoch_loss / len(train_loader)
        print(f"Average Training Loss: {avg_loss:.4f}")

        # Validation phase
        if (epoch + 1) % 5 == 0: # Evaluate every 5 epochs
            model.eval()
            with torch.no_grad():
                for val_data in val_loader:
                    inputs_val = val_data["image"].to(device)
                    labels_val = val_data["label"].to(device)

                    # Dynamic padding for validation
                    current_d, current_h, current_w = inputs_val.shape[2:]
                    target_d = current_d + (16 - current_d % 16) % 16
                    target_h = current_h + (16 - current_h % 16) % 16
                    target_w = current_w + (16 - current_w % 16) % 16
                    padding_val = (0, target_w - current_w, 0, target_h - current_h, 0, target_d - current_d)

                    inputs_val = F.pad(inputs_val, padding_val, "constant", 0)
                    labels_val = F.pad(labels_val, padding_val, "constant", 0)

                    outputs_val = model(inputs_val)

                    outputs_val = [post_pred(i) for i in decollate_batch(outputs_val)]
                    labels_val = [post_label(i) for i in decollate_batch(labels_val)]

                    dice_metric(y_pred=outputs_val, y=labels_val)

                metric = dice_metric.aggregate().item()
                dice_metric.reset()

                print(f"Validation Dice Score: {metric:.4f}")

                if metric > best_metric:
                    best_metric = metric
                    best_metric_epoch = epoch + 1
                    torch.save(model.state_dict(), "best_metric_model.pth")
                    print("Saved new best metric model!")

    print(f"\nTraining finished. Best validation Dice score: {best_metric:.4f} at epoch {best_metric_epoch}")
    torch.save(model.state_dict(), "final_model.pth")
    print("Final model saved as final_model.pth")


if __name__ == "__main__":
    # You can pass arguments here or set defaults
    # Example: main(data_dir="./my_brats_data", max_epochs=50)
    main()
