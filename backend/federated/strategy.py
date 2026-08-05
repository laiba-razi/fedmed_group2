"""
FedMed - Custom Federated Averaging Strategy (FedMedStrategy)
Role: Federated Learning Specialist
"""

import json
import logging
from typing import Dict, List, Optional, Tuple, Union

import flwr as fl
from flwr.common import (
    EvaluateRes,
    FitRes,
    Parameters,
    Scalar,
    parameters_to_ndarrays,
    ndarrays_to_parameters,
)
from flwr.server.client_proxy import ClientProxy
import torch

from backend.federated.config import (
    BEST_MODEL_PATH,
    CHECKPOINT_DIR,
    METRICS_FILE,
    MIN_AVAILABLE_CLIENTS,
    MIN_EVALUATE_CLIENTS,
    MIN_FIT_CLIENTS,
)
from backend.federated.model import create_model

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FedMedStrategy")


class FedMedStrategy(fl.server.strategy.FedAvg):
    """
    Custom Flower FedAvg Strategy for FedMed.
    Manages weighted model aggregation, round metrics, global checkpoint saving,
    and JSON logging for dashboard streaming.
    """

    def __init__(
        self,
        fraction_fit: float = 1.0,
        fraction_evaluate: float = 1.0,
        min_fit_clients: int = MIN_FIT_CLIENTS,
        min_evaluate_clients: int = MIN_EVALUATE_CLIENTS,
        min_available_clients: int = MIN_AVAILABLE_CLIENTS,
        **kwargs,
    ):
        super().__init__(
            fraction_fit=fraction_fit,
            fraction_evaluate=fraction_evaluate,
            min_fit_clients=min_fit_clients,
            min_evaluate_clients=min_evaluate_clients,
            min_available_clients=min_available_clients,
            **kwargs,
        )

        self.history: List[Dict[str, Union[int, float]]] = []
        self.best_dice_score: float = 0.0

    def aggregate_fit(
        self,
        server_round: int,
        results: List[Tuple[ClientProxy, FitRes]],
        failures: List[Union[Tuple[ClientProxy, FitRes], BaseException]],
    ) -> Tuple[Optional[Parameters], Dict[str, Scalar]]:
        """
        Aggregate model weights received from hospital client nodes after local training.
        """
        logger.info(f"\n==================== FL Round {server_round} Aggregation ====================")
        logger.info(f"Received updates from {len(results)} hospital nodes ({len(failures)} failures).")

        if not results:
            logger.warning(f"Round {server_round}: No client results received for aggregation.")
            return None, {}

        # Cryptography / Security Placeholder:
        # [Placeholder for Cryptography & Security Engineer]
        # E.g., Secure Multi-Party Computation (SMPC) or Homomorphic Encryption (TenSEAL CKKS) parameter aggregation

        # Standard Federated Averaging (FedAvg) weighted aggregation
        aggregated_parameters, metrics = super().aggregate_fit(server_round, results, failures)

        if aggregated_parameters is not None:
            # Save round checkpoint
            self._save_checkpoint(aggregated_parameters, server_round)

            # Compute weighted train loss
            total_samples = sum(fit_res.num_examples for _, fit_res in results)
            weighted_train_loss = (
                sum(fit_res.num_examples * fit_res.metrics.get("train_loss", 0.0) for _, fit_res in results)
                / total_samples
                if total_samples > 0
                else 0.0
            )

            metrics["train_loss"] = weighted_train_loss
            logger.info(f"Round {server_round} Aggregated Train Loss: {weighted_train_loss:.4f}")

        return aggregated_parameters, metrics

    def aggregate_evaluate(
        self,
        server_round: int,
        results: List[Tuple[ClientProxy, EvaluateRes]],
        failures: List[Union[Tuple[ClientProxy, EvaluateRes], BaseException]],
    ) -> Tuple[Optional[float], Dict[str, Scalar]]:
        """
        Aggregate evaluation metrics (val_loss, dice_score) received from hospital nodes.
        """
        if not results:
            logger.warning(f"Round {server_round}: No evaluation results received.")
            return None, {}

        total_samples = sum(eval_res.num_examples for _, eval_res in results)

        weighted_val_loss = (
            sum(eval_res.num_examples * eval_res.loss for _, eval_res in results) / total_samples
            if total_samples > 0
            else 0.0
        )

        weighted_dice = (
            sum(eval_res.num_examples * eval_res.metrics.get("dice_score", 0.0) for _, eval_res in results)
            / total_samples
            if total_samples > 0
            else 0.0
        )

        logger.info(
            f"Round {server_round} Global Evaluation -> Val Loss: {weighted_val_loss:.4f}, Dice Score: {weighted_dice:.4f}"
        )

        # Track history entry
        round_metrics = {
            "round": server_round,
            "val_loss": float(weighted_val_loss),
            "dice_score": float(weighted_dice),
            "active_clients": len(results),
        }
        self.history.append(round_metrics)

        # Export metrics JSON for backend streaming
        self._export_metrics_json()

        # Update best model checkpoint if Dice score improves
        if weighted_dice > self.best_dice_score:
            logger.info(f"New best global Dice score achieved: {weighted_dice:.4f} (Previous: {self.best_dice_score:.4f})")
            self.best_dice_score = weighted_dice

        return weighted_val_loss, {"dice_score": weighted_dice, "val_loss": weighted_val_loss}

    def _save_checkpoint(self, parameters: Parameters, server_round: int) -> None:
        """
        Save PyTorch model state_dict checkpoint for the aggregated global model.
        """
        try:
            ndarrays = parameters_to_ndarrays(parameters)
            model = create_model()
            params_dict = zip(model.state_dict().keys(), ndarrays)
            state_dict = {key: torch.tensor(val) for key, val in params_dict}
            model.load_state_dict(state_dict)

            checkpoint_path = CHECKPOINT_DIR / f"global_model_round_{server_round}.pth"
            torch.save(model.state_dict(), checkpoint_path)
            logger.info(f"Saved global model checkpoint: {checkpoint_path}")

            # Update best model file if this is the latest best
            torch.save(model.state_dict(), BEST_MODEL_PATH)
        except Exception as e:
            logger.error(f"Error saving checkpoint for round {server_round}: {e}")

    def _export_metrics_json(self) -> None:
        """
        Export accumulated round metrics to logs/fl_metrics.json.
        """
        try:
            with open(METRICS_FILE, "w") as f:
                json.dump(
                    {
                        "project": "FedMed",
                        "num_rounds_completed": len(self.history),
                        "best_dice_score": self.best_dice_score,
                        "rounds": self.history,
                    },
                    f,
                    indent=2,
                )
            logger.info(f"Metrics exported to {METRICS_FILE}")
        except Exception as e:
            logger.error(f"Error writing metrics JSON: {e}")