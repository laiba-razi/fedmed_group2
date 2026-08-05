# FedMed Federated Learning Engine (`backend/federated`)

This module implements the Flower (`flwr`) Cross-Silo Federated Learning engine for 3D brain tumor MRI segmentation.

---

## 🛠️ Components

### 1. Central Configuration (`config.py`)
Centralized project configuration including dataset paths, MONAI image parameters, FL server settings, node counts, and checkpoint directories.

### 2. Dataset Partitioning (`dataset.py`)
- Discovers 3D BraTS 2023 MRI patient scans (`get_patient_files()`).
- `partition_dataset(data, client_id, num_clients)`: Deterministically partitions patient data across hospital nodes with zero sample overlap and 100% complete coverage.
- `get_client_dataloader(client_id, num_clients)`: Builds client-specific training and validation DataLoaders.

### 3. Hospital Node Client (`client.py`)
- `FedMedClient(fl.client.NumPyClient)`: Flower client representing an isolated hospital node.
- Performs local training on private dataset partitions using PyTorch, MONAI 3D `UNet`, `AdamW`, and `DiceCELoss`.
- `unpack_batch()` helper safely handles MONAI patch dictionary batches.
- CLI argument `--client-id` (0, 1, 2).

### 4. Federated Strategy (`strategy.py`)
- `FedMedStrategy(fl.server.strategy.FedAvg)`: Custom Flower strategy.
- Sample-weighted parameter aggregation (`aggregate_fit`).
- Saves PyTorch global checkpoints (`checkpoints/global_model_round_{N}.pth` and `checkpoints/best_global_model.pth`).
- Exports per-round metrics to `logs/fl_metrics.json`.

### 5. Central Server (`server.py`)
- Launches Flower gRPC server (`start_server`) configured with `FedMedStrategy`.
- CLI parameters: `--server-address`, `--num-rounds`, `--min-clients`.

---

## 🚀 Execution Quick Reference

```bash
# Start server
python -m backend.federated.server --num-rounds 5 --min-clients 3

# Start individual clients
python -m backend.federated.client --client-id 0
python -m backend.federated.client --client-id 1
python -m backend.federated.client --client-id 2
```