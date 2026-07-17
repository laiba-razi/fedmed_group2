"""
FedMed Flower Server

Responsibilities
----------------
- Start the Flower server
- Configure federated learning rounds
- Coordinate communication with clients
"""

from flwr.server import ServerConfig, start_server

from backend.federated.config import (
    SERVER_ADDRESS,
    NUM_ROUNDS,
    PROJECT_NAME,
    VERSION,
)


def main():
    print("=" * 50)
    print(f"{PROJECT_NAME} Federated Learning Server")
    print(f"Version : {VERSION}")
    print(f"Address : {SERVER_ADDRESS}")
    print(f"Rounds  : {NUM_ROUNDS}")
    print("=" * 50)

    start_server(
        server_address=SERVER_ADDRESS,
        config=ServerConfig(
            num_rounds=NUM_ROUNDS,
        ),
    )


if __name__ == "__main__":
    main()