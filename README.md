# FedMed: Cross-Silo Federated Learning Engine

**FedMed** is a privacy-preserving healthcare AI framework that enables multiple hospitals to collaboratively train a 3D brain tumor segmentation model (MONAI 3D U-Net) on private MRI scans without sharing raw patient data.

Instead of pooling sensitive medical imagery onto a central server (violating HIPAA/GDPR), each hospital node trains the model locally on its private dataset partition and sends only parameter weight updates to a central aggregation server running **Flower (`flwr`)**.

---

## 🏗️ Architecture & Team Roles

```text
                               ┌───────────────────────────┐
                               │   Central Flower Server   │
                               │   (FedMedStrategy FedAvg) │
                               └─────────────┬─────────────┘
                                             │
                      ┌──────────────────────┼──────────────────────┐
                      ▼                      ▼                      ▼
           ┌─────────────────────┐┌─────────────────────┐┌─────────────────────┐
           │ Hospital 1 Node     ││ Hospital 2 Node     ││ Hospital 3 Node     │
           │ (St. Jude)          ││ (Mayo Clinic)       ││ (Charité)           │
           │ Private Dataset 1/3 ││ Private Dataset 2/3 ││ Private Dataset 3/3 │
           └─────────────────────┘└─────────────────────┘└─────────────────────┘
```

| Module / Role | Primary Files | Status |
| :--- | :--- | :--- |
| **Federated Learning Specialist** | `client.py`, `strategy.py`, `server.py`, `launch_federated.py`, `test_federated.py` | ✅ **Completed & Verified** |
| **Computer Vision Engineer** | `model.py`, `dataset.py`, `losses.py`, `metrics.py`, `train.py` | ✅ Baseline MONAI Pipeline Ready |
| **Cryptography & Security** | *Placeholders in `client.py` & `strategy.py`* | ⏳ Plug-in Ready (HE / DP) |
| **Backend Engineer** | *`logs/fl_metrics.json` exporter* | ⏳ Ready for WebSocket Streaming |
| **Frontend Developer** | *React Dashboard* | ⏳ Ready for Metrics Visualization |

---

## 📁 Repository Structure

```text
fedmed_group2/
├── backend/
│   └── federated/
│       ├── __init__.py
│       ├── config.py           # Central configuration (paths, FL parameters, hyperparams)
│       ├── dataset.py          # BraTS loader & 3-hospital deterministic partitioner
│       ├── model.py            # MONAI 3D U-Net architecture definition
│       ├── losses.py           # MONAI DiceCELoss function
│       ├── metrics.py          # MONAI DiceMetric evaluation
│       ├── client.py           # Flower NumPyClient (FedMedClient) for hospital nodes
│       ├── strategy.py         # Custom FedMedStrategy (FedAvg, checkpointing, metrics exporter)
│       ├── server.py           # Central Flower gRPC server launcher
│       └── train.py            # Centralized baseline training script
├── checkpoints/                # Aggregated global model weight checkpoints (.pth)
├── logs/                       # Training metrics export (fl_metrics.json)
├── launch_federated.py         # Multi-process orchestrator for 1 server + 3 clients
├── test_federated.py           # Integration test suite (zero-overlap, serialization, strategy)
├── requirements.txt            # Project dependencies
└── README.md                   # System documentation
```

---

## ⚙️ Prerequisites & Setup

### 1. Virtual Environment & Dependencies
Clone the repository and set up a Python 3.10+ virtual environment:

```bash
# Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt
```

### 2. Dataset Configuration
Configure your BraTS 2023 MRI dataset path in `backend/federated/config.py`:

```python
DATASET_ROOT = Path(r"D:\fedmed data set\ASNR-MICCAI-BraTS2023-GLI-Challenge-TrainingData")
```

---

## 🚀 How to Run

### Option A: Automated Multi-Node Launcher (Recommended)
Launches 1 Central Flower Server and 3 distinct Hospital Node Clients in parallel sub-processes:

```bash
# Run FL simulation for 3 communication rounds
python launch_federated.py 3
```

### Option B: Manual Multi-Terminal Launcher
You can manually run the server and client nodes in separate terminals:

**Terminal 1: Start Central Server**
```bash
python -m backend.federated.server --num-rounds 5 --min-clients 3
```

**Terminal 2: Start Hospital 1 (St. Jude)**
```bash
python -m backend.federated.client --client-id 0
```

**Terminal 3: Start Hospital 2 (Mayo Clinic)**
```bash
python -m backend.federated.client --client-id 1
```

**Terminal 4: Start Hospital 3 (Charité)**
```bash
python -m backend.federated.client --client-id 2
```

### Option C: Centralized Baseline Training
To run a standard non-federated MONAI 3D U-Net training pipeline on the full dataset:

```bash
python -m backend.federated.train
```

---

## 🧪 Testing & Verification

Run the federated integration test suite to verify dataset zero-overlap partitioning, parameter serialization, and FedMedStrategy checkpointing:

```bash
python test_federated.py
```

Expected output:
```text
Ran 3 tests in 0.314s

OK
[PASS] Test 1 Passed: Dataset Partitioning Coverage & Zero-Overlap Verified.
[PASS] Test 2 Passed: Model Parameter Serialization & Deserialization Verified.
[PASS] Test 3 Passed: FedMedStrategy Aggregation & Checkpoint Export Verified.
```

---

## 📊 Outputs & Artifacts

- **Model Checkpoints**: Saved automatically after each FL round in `checkpoints/global_model_round_{N}.pth` and `checkpoints/best_global_model.pth`.
- **Live Metrics**: Per-round training loss, validation loss, and aggregated Dice scores are exported to `logs/fl_metrics.json`.
