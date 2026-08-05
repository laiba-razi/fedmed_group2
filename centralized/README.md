# FedMed 

## Overview

FedMed is a privacy-preserving healthcare AI system that enables multiple hospitals to collaboratively train a machine learning model without sharing sensitive patient data. Instead of transferring raw medical images to a central server, each hospital trains the model locally on its own dataset and sends only the model parameters (weights) to a central aggregation server.

The central server combines these encrypted model updates using the Federated Averaging (FedAvg) algorithm to produce a global model while ensuring complete data privacy. This approach complies with healthcare privacy regulations such as HIPAA and GDPR and demonstrates how federated learning can be applied in real-world medical environments.

The project simulates three independent hospital nodes collaborating to train a brain tumor segmentation model using MRI images. It also includes a web dashboard for monitoring the training process, communication between distributed nodes, and optional privacy enhancements such as Homomorphic Encryption and Differential Privacy.

## Features

- Privacy-preserving Federated Learning
- Multiple simulated hospital clients
- Central aggregation server using Flower
- Deep Learning model built with PyTorch
- Medical image processing using MONAI
- Federated Averaging (FedAvg) algorithm
- Real-time training metrics dashboard
- Secure communication between server and clients
- Optional Homomorphic Encryption (TenSEAL)
- Differential Privacy support (optional)

## Tech Stack

- Python
- PyTorch
- Flower
- MONAI
- React.js
- Recharts
- gRPC
- WebSocket
- TenSEAL (Optional)
- Docker (Optional)

## Project Workflow

1. The central server initializes a global model.
2. The model is distributed to all participating hospitals.
3. Each hospital trains the model locally using its private MRI dataset.
4. Only the updated model weights are sent back to the server.
5. The server aggregates all updates using the FedAvg algorithm.
6. The updated global model is redistributed for the next training round.
7. The process repeats until the model converges.

Throughout the process, no raw patient data leaves the hospital, ensuring complete data privacy.

## Objective

The primary goal of FedMed is to demonstrate how Federated Learning can enable collaborative AI development in healthcare while preserving patient privacy. The project showcases distributed machine learning, secure model aggregation, and scalable healthcare AI architecture.

## Running the Centralized Baseline Model

To establish a baseline accuracy metric before moving to federated learning, you can train a standard centralized 3D U-Net model on your MRI dataset (e.g., BraTS).

### Instructions

1. **Activate the environment**:
   Make sure your `axlero` environment is activated:
   ```bash
   pyenv activate axlero
   ```

2. **Configure Data Path & Epochs**:
   In `centralized/train.py`, locate the following line (around line 15) and edit the `data_dir` and `max_epochs` parameters to point to your real dataset and desired training duration:
   ```python
   def main(data_dir="/path/to/your/real/dataset", max_epochs=50, val_ratio=0.2, test_ratio=0.1, num_train_subset=800):
   ```

3. **Run Training**:
   Run the training script from the `centralized` directory:
   ```bash
   cd centralized
   python train.py
   ```
   
This will train the model, save the best weights as `best_metric_model.pth`, and run a final evaluation on the test split at the end.
