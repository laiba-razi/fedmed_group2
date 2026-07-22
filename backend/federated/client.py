import os

import flwr as fl
import torch
import torch.nn as nn
import torch.optim as optim

from backend.federated.dataset import get_dataloader
from backend.federated.model import build_model

# ============================================================
# Checkpoint Configuration
# ============================================================

CHECKPOINT_DIR = "checkpoints"
os.makedirs(CHECKPOINT_DIR, exist_ok=True)


# ============================================================
# Flower Parameter Utilities
# ============================================================

def get_parameters(model):
    """Convert model parameters to NumPy arrays."""
    return [
        param.detach().cpu().numpy()
        for param in model.state_dict().values()
    ]


def set_parameters(model, parameters):
    """Load NumPy parameters into the PyTorch model."""
    params_dict = zip(model.state_dict().keys(), parameters)

    state_dict = {
        key: torch.tensor(value)
        for key, value in params_dict
    }

    model.load_state_dict(state_dict, strict=True)


# ============================================================
# Local Training
# ============================================================

def train_one_epoch(model, epoch):
    dataloader = get_dataloader(batch_size=4)

    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    model.train()

    total_loss = 0.0

    for images, masks in dataloader:

        optimizer.zero_grad()

        outputs = model(images)

        loss = criterion(outputs, masks)

        loss.backward()

        optimizer.step()

        total_loss += loss.item()

    avg_loss = total_loss / len(dataloader)

    print(f"Training completed. Average Loss: {avg_loss:.4f}")

    checkpoint_path = os.path.join(
        CHECKPOINT_DIR,
        f"unet_epoch_{epoch}.pth"
    )

    torch.save(model.state_dict(), checkpoint_path)

    print(f"Model checkpoint saved: {checkpoint_path}")


def train(model, num_epochs=5):
    for epoch in range(1, num_epochs + 1):

        print(f"\n========== Epoch {epoch}/{num_epochs} ==========")

        train_one_epoch(model, epoch)


# ============================================================
# Load Saved Model
# ============================================================

def load_trained_model(epoch=1):
    model = build_model()

    checkpoint_path = os.path.join(
        CHECKPOINT_DIR,
        f"unet_epoch_{epoch}.pth"
    )

    model.load_state_dict(torch.load(checkpoint_path))

    print(f"Loaded checkpoint: {checkpoint_path}")

    return model


# ============================================================
# Flower Client
# ============================================================

class FedMedClient(fl.client.NumPyClient):

    def __init__(self):
        self.model = build_model()

    def get_parameters(self, config):
        print("Sending model parameters to server...")
        return get_parameters(self.model)

    def fit(self, parameters, config):
        print("\nReceiving global model from server...")

        set_parameters(self.model, parameters)

        train(self.model, num_epochs=1)

        print("Returning updated model weights...")

        return (
            get_parameters(self.model),
            len(get_dataloader().dataset),
            {},
        )

    def evaluate(self, parameters, config):
        print("\nEvaluating global model...")

        set_parameters(self.model, parameters)

        # Placeholder evaluation
        loss = 0.0
        accuracy = 0.0

        return (
            loss,
            len(get_dataloader().dataset),
            {"accuracy": accuracy},
        )


# ============================================================
# Main
# ============================================================

if __name__ == "__main__":

    print("Starting FedMed Flower Client...")

    fl.client.start_numpy_client(
        server_address="127.0.0.1:8080",
        client=FedMedClient(),
    )