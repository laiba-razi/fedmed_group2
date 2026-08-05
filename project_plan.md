## Project 2 - "FedMed": Cross-Silo Federated Learning Engine

**Domain:** Privacy-Preserving Machine Learning (PPML) & Healthcare

**Problem Statement:** Training highly accurate ML models for rare diseases requires massive patient datasets. However, strict data privacy laws (HIPAA/GDPR) prevent hospitals from sharing raw patient data with centralized servers.

**Use Case:** Researchers at three different global hospitals collaborate to train a brain tumor segmentation model using MRI scans. Instead of pooling their private data, they deploy FedMed nodes. The central server sends the untrained PyTorch model to each hospital. The models train locally on private data, and only the encrypted weight updates are sent back and aggregated (using Secure Multi-Party Computation) to update the global model, preserving absolute patient privacy.

### Key Modules:
* **Federated Learning Framework (Flower / PySyft):** Orchestrates the decentralized training loop, managing the communication between the central server and isolated client nodes.
* **Computer Vision Model (PyTorch / MONAI):** A 3D U-Net architecture designed specifically for segmenting medical imagery (e.g., MRI or CT scans).
* **Privacy & Encryption (TenSEAL):** Implements Homomorphic Encryption, allowing the central server to aggregate the model weights while they remain mathematically encrypted.
* **Training Dashboard (React / Recharts):** A monitoring UI showing the global model's convergence and accuracy metrics across different distributed epochs.

### Week-wise Development Plan:

| Week | PPML Engineering (PyTorch, Flower, TenSEAL) | Distributed Systems (gRPC, React) |
| :--- | :--- | :--- |
| **Week 1** | **Centralized Baseline:** Train a standard 3D U-Net model on a public MRI dataset (e.g., BraTS) to establish a baseline accuracy metric. | **Node Scaffolding:** Set up the Flower framework. Configure 3 distinct mock "Hospital Nodes" running on separate local ports. |
| **Week 2** | **Federated Training Loop:** Partition the dataset across the 3 nodes. Implement the logic for the central server to broadcast weights, wait for local training, and aggregate the results (FedAvg). | **Secure Communication:** Implement gRPC with TLS certificates to ensure the network traffic between the server and nodes is secure. |
| **Mid-Project Review** | **Federated Audit:** Prove the federated model converges and approaches the accuracy of the centralized baseline without ever exposing raw data to the central server. | **Node Resilience:** Ensure the training round survives if one of the 3 hospital nodes drops offline mid-epoch. |
| **Week 3** | **Homomorphic Encryption:** Integrate TenSEAL. Encrypt the PyTorch tensors on the client side before sending them to the server, requiring the server to perform mathematical aggregation on ciphertext. | **Live Metrics:** Stream the loss and accuracy metrics from the central aggregator to a WebSocket endpoint. |
| **Week 4** | **Differential Privacy:** Add controlled statistical noise to the weight updates before transmission to mathematically guarantee protection against model inversion attacks. | **Refine & Polish:** Build the React dashboard to visualize the training loss curve and the final MRI tumor segmentation masks. |
| **Final Review** | A masterclass in cryptography and decentralized deep learning. | A compliant, privacy-first healthcare AI architecture. |

---