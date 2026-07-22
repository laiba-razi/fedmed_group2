import flwr as fl
from flwr.server import ServerConfig, start_server

from backend.federated.config import (
    SERVER_ADDRESS,
    NUM_ROUNDS,
    MIN_AVAILABLE_CLIENTS,
    PROJECT_NAME,
    VERSION,
)

strategy = fl.server.strategy.FedAvg(
    fraction_fit=1.0,
    fraction_evaluate=1.0,
    min_fit_clients=MIN_AVAILABLE_CLIENTS,
    min_evaluate_clients=MIN_AVAILABLE_CLIENTS,
    min_available_clients=MIN_AVAILABLE_CLIENTS,
)


def main():
    print("=" * 50)
    print(f"{PROJECT_NAME} Federated Learning Server")
    print(f"Version : {VERSION}")
    print(f"Address : {SERVER_ADDRESS}")
    print(f"Rounds  : {NUM_ROUNDS}")
    print(f"Clients : {MIN_AVAILABLE_CLIENTS}")
    print("=" * 50)

    start_server(
        server_address=SERVER_ADDRESS,
        config=ServerConfig(num_rounds=NUM_ROUNDS),
        strategy=strategy,
    )


if __name__ == "__main__":
    main()