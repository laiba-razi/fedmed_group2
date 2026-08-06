# Test 1: TLS Secure Communication

This test demonstrates that the Flower gRPC server enforces TLS encryption and physically rejects any client that attempts to connect using plaintext or an unverified certificate.

## 1. Environment Setup
Before running the test, ensure your virtual environment is active and dependencies are installed.

```bash
# Activate your Python virtual environment (Linux/macOS)
source .venv/bin/activate

# Install required dependencies
pip install -r requirements.txt
```

## 2. Start the Secure Server
In **Terminal 1**, start the central Flower server. The server is configured to load the TLS certificates from `backend/privacy/.certs/`.

```bash
python -m backend.federated.server
```

You should see logs indicating that the `gRPC server running (5 rounds), SSL is enabled`.

## 3. The "Rogue Client" Test
To prove that unauthorized, unencrypted access is blocked, we will attempt to launch a client that does not provide the `root_certificates` for the TLS handshake.

In **Terminal 2**, create a temporary python script (e.g., `rogue_client.py`) with the following content:

```python
import flwr as fl

# A standard NumPyClient
class DummyClient(fl.client.NumPyClient):
    pass

# Attempt to connect to the secure server WITHOUT TLS certificates
fl.client.start_numpy_client(
    server_address="127.0.0.1:8080",
    client=DummyClient()
)
```

Run the rogue client:
```bash
python rogue_client.py
```

## 4. Verification
- **Client Output**: The rogue client will immediately crash with a `grpc._channel._MultiThreadedRendezvous: StatusCode.UNAVAILABLE` error, stating `Socket closed`.
- **Server Output**: Check **Terminal 1**. The server will log a TLS handshake failure, proving the connection was actively refused:
  ```text
  Handshake failed with error SSL_ERROR_SSL: error:100000f7:SSL routines:OPENSSL_internal:WRONG_VERSION_NUMBER: Invalid certificate verification context
  ```

This confirms that the federated network enforces strict TLS encryption, guaranteeing patient data privacy during transmission.
