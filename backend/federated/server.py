"""
FedMed - Central Federated Learning Server (Flower Server)
Role: Federated Learning Specialist
"""

import argparse
import logging
import flwr as fl
from flwr.server import ServerConfig, start_server
from pathlib import Path

from backend.federated.config import (
    MIN_AVAILABLE_CLIENTS,
    MIN_EVALUATE_CLIENTS,
    MIN_FIT_CLIENTS,
    NUM_ROUNDS,
    PROJECT_NAME,
    SERVER_ADDRESS,
    VERSION,
)
from backend.federated.strategy import FedMedStrategy

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FedMedServer")


def main():
    parser = argparse.ArgumentParser(description="FedMed Flower Central Server")
    parser.add_argument("--server-address", type=str, default=SERVER_ADDRESS, help="Server gRPC listen address")
    parser.add_argument("--num-rounds", type=int, default=NUM_ROUNDS, help="Number of FL training rounds")
    parser.add_argument("--min-available-clients", type=int, default=MIN_AVAILABLE_CLIENTS, help="Minimum available clients required")
    parser.add_argument("--min-fit-clients", type=int, default=MIN_FIT_CLIENTS, help="Minimum fit clients required")
    args = parser.parse_args()

    logger.info("=" * 60)
    logger.info(f"{PROJECT_NAME} Federated Learning Central Server")
    logger.info(f"Version            : {VERSION}")
    logger.info(f"Address            : {args.server_address}")
    logger.info(f"Rounds             : {args.num_rounds}")
    logger.info(f"Available Clients  : {args.min_available_clients}")
    logger.info(f"Min Fit Clients    : {args.min_fit_clients}")
    logger.info("=" * 60)

    # Initialize custom FedMed strategy
    strategy = FedMedStrategy(
        fraction_fit=1.0,
        fraction_evaluate=0.0,
        min_fit_clients=args.min_fit_clients,
        min_evaluate_clients=1,
        min_available_clients=args.min_available_clients,
    )

    # Load TLS Certificates
    certs_dir = Path(__file__).parent.parent / "privacy" / ".certs"
    certificates = (
        (certs_dir / "ca.crt").read_bytes(),
        (certs_dir / "server.pem").read_bytes(),
        (certs_dir / "server.key").read_bytes(),
    )

    # Launch Flower gRPC server
    start_server(
        server_address=args.server_address,
        config=ServerConfig(num_rounds=args.num_rounds),
        strategy=strategy,
        certificates=certificates,
    )


if __name__ == "__main__":
    main()