# FedMed: Cross-Silo Federated Learning Engine

**FedMed** is a privacy-preserving machine learning (PPML) project designed for the healthcare domain. It demonstrates a cross-silo federated learning architecture for training a 3D brain tumor MRI segmentation model across multiple hospitals without sharing sensitive raw patient data.

> **Disclaimer:** FedMed is intended for **research use only** and is not a clinical decision-support device.

---

## 📖 Overview

Training highly accurate machine learning models for rare diseases requires massive patient datasets. However, strict data privacy laws (like HIPAA and GDPR) prevent hospitals from pooling raw patient data into centralized servers.

FedMed solves this by bringing the model to the data:
1. **Decentralized Training:** A centralized server distributes an untrained 3D U-Net model to participating hospital nodes.
2. **Local Updates:** Each hospital trains the model locally on its private MRI dataset.
3. **Secure Aggregation:** Only encrypted model weight updates are sent back to the central server, where they are aggregated (using FedAvg) to improve the global model.

### Key Technologies
* **Federated Learning:** [Flower (`flwr`)](https://flower.ai/) orchestrates the decentralized training loop.
* **Deep Learning & Medical Imaging:** [PyTorch](https://pytorch.org/) and [MONAI](https://monai.io/) power the 3D U-Net architecture for MRI segmentation.
* **Dashboard:** [Streamlit](https://streamlit.io/) provides a real-time monitoring interface for tracking global model convergence and accuracy.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Python 3.10+** installed on your system.

### 2. Installation
Clone the repository and set up a virtual environment:

```bash
git clone https://github.com/laiba-razi/fedmed_group2.git
cd fedmed_group2

# Create and activate a virtual environment
python -m venv .venv

# macOS/Linux
source .venv/bin/activate
# Windows
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Dataset Configuration
The project uses the BraTS dataset for 3D MRI segmentation. By default, the system looks for the dataset in `datasets/BraTS2023`. You can override this by setting an environment variable:

```bash
# macOS/Linux
export FEDMED_DATASET_ROOT="/path/to/your/BraTS2023"

# Windows PowerShell
$env:FEDMED_DATASET_ROOT="C:\path\to\your\BraTS2023"
```

---

## 🏃‍♂️ Running the Project

### Federated Learning Simulation
You can launch the full federated learning simulation (1 Server + 3 Hospital Clients) locally using the provided launcher:

```bash
# Run FL for 3 rounds (default)
python launch_federated.py 3
```
This will automatically spawn the central server and the hospital nodes, execute the federated training loop, and save the aggregated global model checkpoints in the `checkpoints/` directory.

### Centralized Baseline Training
To establish a baseline before running the federated pipeline, you can train a standard centralized model:

```bash
cd centralized
python train.py
```
*(Note: You can configure the dataset path and number of epochs directly inside `centralized/train.py`.)*

### Streamlit Dashboard
To visualize the training progress, monitor metrics, and perform inferences using the global model, launch the Streamlit dashboard:

```bash
streamlit run app.py
```

---

## 📂 Project Structure

```text
fedmed_group2/
├── app.py                         # Streamlit dashboard entry point
├── launch_federated.py            # FL simulation launcher (Server + Clients)
├── requirements.txt               # Python dependencies
├── backend/
│   ├── federated/                 # Core FL logic
│   │   ├── client.py              # Hospital node client (Flower)
│   │   ├── server.py              # Central aggregation server
│   │   ├── strategy.py            # Custom FedAvg aggregation & metrics logic
│   │   ├── model.py               # MONAI 3D U-Net architecture
│   │   └── dataset.py             # Dataset partitioning logic
│   └── privacy/                   # Security and TLS configurations
│       └── generate_certs.sh      # Script to generate TLS certificates
├── centralized/                   # Baseline centralized training scripts
├── checkpoints/                   # Saved global model checkpoints (.pth)
├── logs/                          # Training metrics (fl_metrics.json)
└── tests/                         # Integration, security, and resilience tests
```

---

## 🛡️ Security & Testing

We have built a comprehensive test suite to verify the security, node resilience, and architectural correctness of the pipeline. 

### Integration Tests
Run the federated integration test suite to verify dataset zero-overlap partitioning, parameter serialization, and checkpointing:

```bash
python test_federated.py
```

### Security & Resilience
For detailed guides on physical testing of TLS security and fault tolerance, refer to our test documentation:
- [Test 1: TLS Secure Communication](tests/test_tls_security.md)
- [Test 2: Node Resilience (Fault Tolerance)](tests/test_node_resilience.md)

*(Note: Advanced privacy features such as Homomorphic Encryption (TenSEAL) and Differential Privacy (Opacus) are currently planned for future phases and have placeholders in the codebase).*
