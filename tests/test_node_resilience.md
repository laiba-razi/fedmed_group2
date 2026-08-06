# Test 2: Node Resilience (Fault Tolerance)

This test demonstrates that the FedMed architecture is fault-tolerant. If a hospital node loses its connection or crashes mid-training, the central server will successfully aggregate the remaining clients instead of hanging indefinitely or terminating the entire global epoch.

## 1. Environment Setup
Make sure your environment is activated across multiple terminal windows.

```bash
# Activate your Python virtual environment (Linux/macOS)
source .venv/bin/activate

# Install required dependencies
pip install -r requirements.txt
```

## 2. Start the Central Server
In **Terminal 1**, start the Flower server. It is configured to require all 3 clients to connect initially, but can survive if only 2 clients return training results (`MIN_FIT_CLIENTS = 2`).

```bash
python -m backend.federated.server
```

## 3. Connect the Hospital Nodes
Start all three hospital clients in separate terminals.

In **Terminal 2 (Hospital 1)**:
```bash
python -m backend.federated.client --client-id 0
```

In **Terminal 3 (Hospital 2)**:
```bash
python -m backend.federated.client --client-id 1
```

In **Terminal 4 (Hospital 3)**:
```bash
python -m backend.federated.client --client-id 2
```

## 4. Trigger the Node Failure
Once all three clients are connected, the server will broadcast the initial model weights and the clients will begin their local training loop.

Wait for the clients to log:
`[Client X] Received global model weights from server. Starting local training...`

Immediately switch to **Terminal 4 (Hospital 3)** and press **`Ctrl+C`** to forcefully kill the process mid-epoch.

## 5. Verification
Monitor **Terminal 1** (the server logs). 

- The server will detect the broken connection.
- After Hospitals 1 and 2 complete their local epochs, the server will successfully aggregate their updates, ignoring the dropped Hospital 3.
- You will see a successful aggregation log confirming resilience:

```text
==================== FL Round 1 Aggregation ====================
Received updates from 2 hospital nodes (1 failures).
Saved global model checkpoint: checkpoints/global_model_round_1.pth
```

This proves the system remains highly resilient to real-world network instability without compromising the entire federated run.
