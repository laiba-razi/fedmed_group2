"""
FedMed - Hospital Node Flower Client (FedMedClient)
Role: Federated Learning Specialist
"""

import argparse
import logging
from typing import Dict, List, Tuple

import flwr as fl
import numpy as np
import torch
import torch.nn as nn
from monai.data import decollate_batch

from backend.federated.config import (
    DEVICE,
    LEARNING_RATE,
    LOCAL_EPOCHS,
    NUM_CLIENTS,
    SERVER_ADDRESS,
)
from backend.federated.dataset import get_client_dataloader
from backend.federated.losses import get_loss_function
from backend.federated.metrics import get_dice_metric, get_post_transforms
from backend.federated.model import create_model

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FedMedClient")


# ============================================================
# Parameter Serialization Helpers
# ============================================================

def get_model_parameters(model: nn.Module) -> List[np.ndarray]:
    """
    Extract model state_dict parameters as a list of NumPy arrays for Flower.
    """
    return [val.cpu().numpy() for val in model.state_dict().values()]


def set_model_parameters(model: nn.Module, parameters: List[np.ndarray]) -> None:
    """
    Load a list of NumPy parameter arrays back into the PyTorch model state_dict.
    """
    params_dict = zip(model.state_dict().keys(), parameters)
    state_dict = {key: torch.tensor(val) for key, val in params_dict}
    model.load_state_dict(state_dict, strict=True)


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
# FedMed Flower Client
# ============================================================

class FedMedClient(fl.client.NumPyClient):
    """
    Flower client representing an isolated Hospital Node in the FedMed network.
    Executes local training on its private dataset partition and reports weight updates.
    """

    def __init__(self, client_id: int = 0, num_clients: int = NUM_CLIENTS, local_epochs: int = LOCAL_EPOCHS):
        self.client_id = client_id
        self.num_clients = num_clients
        self.local_epochs = local_epochs

        # Select computing device
        self.device = torch.device("cuda" if DEVICE == "cuda" and torch.cuda.is_available() else "cpu")
        logger.info(f"Hospital Client {self.client_id + 1}/{self.num_clients} initialized on device: {self.device}")

        # Reuse existing MONAI model, loss, and metrics
        self.model = create_model().to(self.device)
        self.loss_function = get_loss_function()
        self.dice_metric = get_dice_metric()
        self.post_pred, self.post_label = get_post_transforms()

        # Load private data partition for this hospital node
        self.train_loader, self.val_loader = get_client_dataloader(
            client_id=self.client_id,
            num_clients=self.num_clients,
        )

    def get_parameters(self, config: Dict[str, str]) -> List[np.ndarray]:
        """Return global/local model weights as NumPy arrays."""
        logger.info(f"[Client {self.client_id}] Sending local parameters to server...")
        return get_model_parameters(self.model)

    def fit(
        self, parameters: List[np.ndarray], config: Dict[str, str]
    ) -> Tuple[List[np.ndarray], int, Dict[str, float]]:
        """
        Train global model parameters locally on hospital's private dataset partition.
        """
        logger.info(f"[Client {self.client_id}] Received global model weights from server. Starting local training...")

        # 1. Update local model with global parameters
        set_model_parameters(self.model, parameters)

        # 2. Local Training Loop using AdamW and DiceCELoss
        self.model.train()
        optimizer = torch.optim.AdamW(self.model.parameters(), lr=LEARNING_RATE)

        total_loss = 0.0
        num_batches = len(self.train_loader)

        for epoch in range(self.local_epochs):
            running_loss = 0.0
            for batch in self.train_loader:
                images, labels = unpack_batch(batch, self.device)

                optimizer.zero_grad()
                outputs = self.model(images)
                loss = self.loss_function(outputs, labels)
                loss.backward()
                optimizer.step()

                running_loss += loss.item()

            epoch_loss = running_loss / num_batches if num_batches > 0 else 0.0
            total_loss += epoch_loss
            logger.info(f"[Client {self.client_id}] Epoch {epoch + 1}/{self.local_epochs} - Loss: {epoch_loss:.4f}")

        avg_train_loss = total_loss / self.local_epochs

        # Cryptography / Security Placeholder:
        # [Placeholder for Cryptography & Security Engineer]
        # E.g., Apply Differential Privacy noise (Opacus / Gaussian noise) or Homomorphic Encryption (TenSEAL CKKS)

        updated_parameters = get_model_parameters(self.model)
        sample_count = len(self.train_loader.dataset)

        logger.info(f"[Client {self.client_id}] Local training complete. Returning parameter updates.")
        return updated_parameters, sample_count, {"train_loss": float(avg_train_loss)}

    def evaluate(
        self, parameters: List[np.ndarray], config: Dict[str, str]
    ) -> Tuple[float, int, Dict[str, float]]:
        """
        Evaluate global model parameters on hospital's private validation set.
        """
        logger.info(f"[Client {self.client_id}] Evaluating global model on validation partition...")

        set_model_parameters(self.model, parameters)
        self.model.eval()
        self.dice_metric.reset()

        val_loss = 0.0
        num_batches = len(self.val_loader)

        with torch.no_grad():
            for batch in self.val_loader:
                images, labels = unpack_batch(batch, self.device)

                outputs = self.model(images)
                loss = self.loss_function(outputs, labels)
                val_loss += loss.item()

                outputs_list = decollate_batch(outputs)
                labels_list = decollate_batch(labels)

                outputs_list = [self.post_pred(i) for i in outputs_list]
                labels_list = [self.post_label(i) for i in labels_list]

                self.dice_metric(outputs_list, labels_list)

        avg_val_loss = val_loss / num_batches if num_batches > 0 else 0.0
        dice_score = self.dice_metric.aggregate().item()
        self.dice_metric.reset()

        logger.info(
            f"[Client {self.client_id}] Validation complete - Val Loss: {avg_val_loss:.4f}, Dice Score: {dice_score:.4f}"
        )

        sample_count = len(self.val_loader.dataset)
        return float(avg_val_loss), sample_count, {"dice_score": float(dice_score)}


# ============================================================
# Main Client Runner
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="FedMed Hospital Node Client")
    parser.add_argument("--client-id", type=int, default=0, help="Client/Hospital ID (0, 1, 2...)")
    parser.add_argument("--num-clients", type=int, default=NUM_CLIENTS, help="Total number of hospital clients")
    parser.add_argument("--server-address", type=str, default=SERVER_ADDRESS, help="Flower server gRPC address")
    parser.add_argument("--epochs", type=int, default=LOCAL_EPOCHS, help="Local training epochs per round")
    args = parser.parse_args()

    client = FedMedClient(
        client_id=args.client_id,
        num_clients=args.num_clients,
        local_epochs=args.epochs,
    )

    logger.info(f"Starting Flower NumPy Client for Hospital Node {args.client_id + 1} connecting to {args.server_address}...")

    fl.client.start_numpy_client(
        server_address=args.server_address,
        client=client,
    )


if __name__ == "__main__":
    main()