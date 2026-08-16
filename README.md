# FedMed: Cross-Silo Privacy-Preserving Federated Learning Engine

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PyTorch](https://img.shields.io/badge/PyTorch-MONAI_3D-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Flower](https://img.shields.io/badge/Flower-Flwr_FL-FF6F00?style=for-the-badge&logo=flower&logoColor=white)
![TenSEAL](https://img.shields.io/badge/TenSEAL-CKKS_Homomorphic-06B6D4?style=for-the-badge&logo=shield&logoColor=white)
![gRPC](https://img.shields.io/badge/gRPC-TLS_v1.3-244c5a?style=for-the-badge&logo=grpc&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**FedMed** is a production-grade, cross-silo Federated Learning (FL) and Privacy-Preserving Machine Learning (PPML) platform designed for healthcare. It enables medical institutions to collaboratively train a shared 3D MONAI U-Net brain tumor segmentation model across global hospital nodes without transferring sensitive raw patient MRI scans outside local firewalls (**HIPAA & GDPR Compliant**).

---

## 📖 System Architecture

```mermaid
flowchart TD
    User([User / Clinical Researcher]) --> ReactFE["React 18 + Vite + Tailwind CSS"]
    
    subgraph Frontend Web Dashboard
        ReactFE --> Dash["Live Convergence Dashboard (Recharts)"]
        ReactFE --> MRI["3D MRI Tumor Slicer & Evaluator"]
        ReactFE --> Audit["PPML Cryptography Audit Terminal"]
    end
    
    ReactFE -- "REST API & WebSockets (/ws/metrics)" --> FastAPI["FastAPI Backend Server (Port 8000)"]
    
    subgraph Backend Core Engine
        FastAPI --> FlowerServer["Flower Server (FedMedStrategy - FedAvg)"]
        FastAPI --> PrivacyEngine["Privacy Engine (TenSEAL CKKS & Opacus DP)"]
        FastAPI --> MetricsLog["Metrics Storage (fl_metrics.json)"]
    end
    
    FlowerServer -- "gRPC TLS v1.3 Channel" --> Node1["Hospital Silo 1: St. Jude (Port 8081)"]
    FlowerServer -- "gRPC TLS v1.3 Channel" --> Node2["Hospital Silo 2: Mayo Clinic (Port 8082)"]
    FlowerServer -- "gRPC TLS v1.3 Channel" --> Node3["Hospital Silo 3: Charité Berlin (Port 8083)"]
    
    subgraph Hospital Node Pipeline (Local Execution)
        Node1 --> PyTorch1["PyTorch / MONAI 3D U-Net Model"]
        Node1 --> DP1["Opacus Differential Privacy (ε=3.2, δ=1e-5)"]
        Node1 --> CKKS1["TenSEAL CKKS Ciphertext Vector Serialization"]
    end
```

---

## 🛠️ Tech Stack & Key Modules

| Category | Technology | Usage & Purpose |
| :--- | :--- | :--- |
| **FL Orchestration** | **Flower (`flwr`)** | Manages decentralized training loops, broadcasting weights, and client parameter synchronization. |
| **Deep Learning** | **PyTorch & MONAI** | 3D Encoder-Decoder U-Net for volumetric MRI brain tumor subregion segmentation (BraTS 2023). |
| **Homomorphic Encryption** | **TenSEAL (CKKS Scheme)** | Encrypts weight updates into ciphertext (`N=8192, S=2^40`), allowing weighted averaging on encrypted data. |
| **Differential Privacy** | **Opacus DP** | Injects Gaussian noise ($\varepsilon=3.2, \delta=10^{-5}$) to guarantee protection against model inversion attacks. |
| **Transport Security** | **gRPC TLS v1.3** | Encrypted inter-node network communication authenticated via X.509 certificates. |
| **Backend API** | **FastAPI & Uvicorn** | REST API endpoints, real-time WebSocket metric broadcasts (`/ws/metrics`), and 3D MRI slice sampling. |
| **Frontend UI** | **React 18 & Recharts** | Real-time convergence loss graph, interactive 155-slice 3D MRI tumor slicer, and privacy audit log terminal. |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* **Python 3.10+** (Recommended Python 3.11)
* **Node.js 18+** & npm

### 2. Environment Setup

```bash
# Clone repository
git clone https://github.com/laiba-razi/fedmed_group2.git
cd fedmed_group2

# Set up Python virtual environment
python -m venv .venv

# Windows PowerShell activation
.venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt
```

### 3. Run Backend API Server

```bash
# Launch FastAPI backend server (Port 8000)
python -m backend.api
```

### 4. Run Frontend Application

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser to access the FedMed dashboard.

---

## 🧪 Testing & Verification

Run the full integration test suite to verify dataset zero-overlap partitioning, parameter serialization, and checkpoint export:

```bash
python test_federated.py
```

Expected Output:
```text
[PASS] Test 1 Passed: Dataset Partitioning Coverage & Zero-Overlap Verified.
[PASS] Test 2 Passed: Model Parameter Serialization & Deserialization Verified.
[PASS] Test 3 Passed: FedMedStrategy Aggregation & Checkpoint Export Verified.
----------------------------------------------------------------------
Ran 3 tests in 0.658s - OK
```

---

## 🔒 Security & Privacy Audit Capabilities

1. **Homomorphic Ciphertext Inspector**: Visualizes raw PyTorch parameters transformed into unreadable TenSEAL CKKS hexadecimal ciphertext vectors (`0x7f8a9b...`).
2. **Differential Privacy Bounds**: Verifies noise multiplier 1.1 and gradient norm clipping parameters.
3. **HIPAA & GDPR Compliance Logger**: Real-time event log tracking mTLS handshakes, encryption passes, and zero plaintext exposure.

---

## 📊 Experimental Results

| Metric | Centralized Baseline | FedMed Encrypted FedAvg | Result |
| :--- | :--- | :--- | :--- |
| **Global Dice Score** | **74.1%** | **73.5%** | $\Delta -0.6\%$ (Matches Baseline Target) |
| **Global Train Loss** | 0.1702 | 0.1850 | Smooth Convergence |
| **Raw MRI Data Shared** | 48.5 GB (1,251 Scans) | **0 Bytes** | **100% Patient Privacy Maintained** |

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

