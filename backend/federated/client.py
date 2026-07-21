from pyexpat import model

import torch
import torch.nn as nn
import torch.optim as optim
import os
import flwr as fl
import numpy as np

CHECKPOINT_DIR = "checkpoints"
os.makedirs(CHECKPOINT_DIR, exist_ok=True)


from backend.federated.model import build_model
from backend.federated.dataset import get_dataloader


def get_parameters(model):
    return [val.cpu().numpy() for _, val in model.state_dict().items()]


def set_parameters(model, parameters):
    params_dict = zip(model.state_dict().keys(), parameters)

    state_dict = {
        k: torch.tensor(v)
        for k, v in params_dict
    }

    model.load_state_dict(state_dict, strict=True)


def train_one_epoch(epoch=1):
    model = build_model()
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
    f"unet_epoch_{epoch}.pth")

    torch.save(model.state_dict(), checkpoint_path)

    print(f"Model checkpoint saved: {checkpoint_path}")


def load_trained_model(epoch=1):
    model = build_model()

    checkpoint_path = os.path.join(
        CHECKPOINT_DIR,
        f"unet_epoch_{epoch}.pth"
    )

    model.load_state_dict(torch.load(checkpoint_path))

    print(f"Loaded checkpoint: {checkpoint_path}")

    return model

def train(num_epochs=5):
    for epoch in range(1, num_epochs + 1):
        print(f"\n========== Epoch {epoch}/{num_epochs} ==========")
        train_one_epoch(epoch)

class FedMedClient(fl.client.NumPyClient):

    def __init__(self):
        self.model = build_model()

    def get_parameters(self, config):
        return get_parameters(self.model)

    def fit(self, parameters, config):

        set_parameters(self.model, parameters)

        train(num_epochs=1)

        return (
            get_parameters(self.model),
            len(get_dataloader().dataset),
            {}
        )

    def evaluate(self, parameters, config):

        set_parameters(self.model, parameters)

        loss = 0.0

        return (
            loss,
            len(get_dataloader().dataset),
            {"accuracy": 0.0},
        )

if __name__ == "__main__":

    fl.client.start_numpy_client(
        server_address="127.0.0.1:8080",
        client=FedMedClient(),
    )