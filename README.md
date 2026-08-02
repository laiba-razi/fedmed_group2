# FedMed — Federated Brain Tumour Segmentation

FedMed is a final-year project demonstrating cross-silo federated learning for 3D brain tumour MRI segmentation. Three hospitals train locally on private BraTS data; Flower aggregates model-weight updates with FedAvg, so raw patient images never leave their originating hospital. The model is a MONAI 3D U-Net.

> **Research use only.** FedMed is not a clinical decision-support device.

## Streamlit dashboard

`app.py` is the deployment-ready dashboard for the existing training pipeline. It provides Home, Dataset, Training, Prediction, Dashboard, and About views. It reads the existing `logs/fl_metrics.json` export and checkpoints, launches existing federated/centralized training, and uses the existing 3D U-Net for inference.

### Screenshots

Capture the **Home** and **Federated learning dashboard** views from the deployed app and add them to the final report. The UI is intentionally not shown with patient imagery in the public repository.

## Installation

Python 3.10 or later is recommended.

```bash
git clone https://github.com/laiba-razi/fedmed_group2.git
cd fedmed_group2
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Set the local BraTS 2023 directory before training. The default is the project-relative `datasets/BraTS2023`.

```bash
# macOS/Linux
export FEDMED_DATASET_ROOT="/path/to/BraTS2023"
# Windows PowerShell
$env:FEDMED_DATASET_ROOT="C:\path\to\BraTS2023"
```

## Run locally

```bash
streamlit run app.py
```

The Training page invokes existing code. You may also run:

```bash
python launch_federated.py 3
python test_federated.py
```

## Deploy with Streamlit Community Cloud

1. Push this repository to GitHub.
2. In [Streamlit Community Cloud](https://share.streamlit.io/), select **Create app**, choose the repository and branch, and set the main file to `app.py`.
3. Deploy. Do not upload protected medical data to a public app. Community Cloud is appropriate for dashboard viewing; training and local data paths belong on local/private infrastructure.

## Folder structure

```text
fedmed_group2/
├── app.py                         # Streamlit entry point
├── backend/federated/
│   ├── client.py                  # Flower hospital client
│   ├── dataset.py                 # BraTS discovery and partitioning
│   ├── model.py                   # MONAI 3D U-Net factory
│   ├── strategy.py                # FedAvg, checkpoints, metrics export
│   └── train.py                   # Existing centralized workflow
├── checkpoints/                   # Generated global model checkpoints
├── logs/fl_metrics.json           # Generated per-round metrics
├── launch_federated.py            # Existing multi-process FL launcher
└── requirements.txt
```

## Outputs

- `checkpoints/global_model_round_<N>.pth`: aggregated global checkpoints.
- `checkpoints/best_model.pth`: best/current checkpoint.
- `logs/fl_metrics.json`: per-round validation loss and global Dice score.

The original project exports Dice and loss only. Precision, recall, F1 and a confusion matrix are intentionally marked unavailable until evaluation exports per-class labels and predictions.
