"""FedMed Streamlit dashboard built around the existing FL implementation."""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

import matplotlib.pyplot as plt
import pandas as pd
import plotly.express as px
import streamlit as st

from backend.federated.config import BEST_MODEL_PATH, CHECKPOINT_DIR, DATASET_ROOT, METRICS_FILE, NUM_CLIENTS
from backend.federated.model import create_model
from launch_federated import launch_simulation

PROJECT_ROOT = Path(__file__).resolve().parent
HOSPITALS = ["St. Jude", "Mayo Clinic", "Charité"]
st.set_page_config(page_title="FedMed | Federated Learning", page_icon="🧠", layout="wide")

def inject_styles() -> None:
    st.markdown("""<style>.block-container{max-width:1300px;padding-top:2rem}.hero{padding:2.2rem;border-radius:18px;color:white;background:linear-gradient(120deg,#0b2545,#176b87)}[data-testid="stMetric"]{background:#f6f8fc;border:1px solid #e5e9f2;border-radius:12px;padding:14px}</style>""", unsafe_allow_html=True)

@st.cache_data(ttl=3)
def load_metrics() -> dict[str, Any]:
    if not METRICS_FILE.exists(): return {"rounds": [], "best_dice_score": None, "num_rounds_completed": 0}
    try:
        with METRICS_FILE.open(encoding="utf-8") as file: return json.load(file)
    except (OSError, json.JSONDecodeError): return {"rounds": []}

def metrics_frame(metrics: dict[str, Any]) -> pd.DataFrame:
    return pd.DataFrame(metrics.get("rounds", []), columns=["round", "val_loss", "dice_score", "active_clients"]).dropna(axis=1, how="all")

def model_checkpoint() -> Path | None:
    if BEST_MODEL_PATH.exists(): return BEST_MODEL_PATH
    candidates = sorted(CHECKPOINT_DIR.glob("global_model_round_*.pth"))
    return candidates[-1] if candidates else None

def run_federated_training(rounds: int, log_box: Any, progress: Any) -> None:
    """Delegate orchestration to the repository's existing Flower launcher."""
    log_box.code("Starting existing FedMed Flower launcher…", language="text")
    progress.progress(5, text="Starting Flower server and hospital clients")
    launch_simulation(num_clients=NUM_CLIENTS, num_rounds=rounds)
    progress.progress(100, text="Federated training finished")
    log_box.code("Training completed. Reloading exported metrics…", language="text")
    load_metrics.clear()

def run_centralized_training(log_box: Any, progress: Any) -> None:
    progress.progress(10, text="Preparing centralized training")
    result = subprocess.run([sys.executable, "-m", "backend.federated.train"], cwd=PROJECT_ROOT, capture_output=True, text=True, check=False)
    log_box.code(((result.stdout + "\n" + result.stderr).strip())[-10000:] or "Training process produced no output.", language="text")
    progress.progress(100, text="Centralized training process finished")

def render_metrics(metrics: dict[str, Any]) -> None:
    frame = metrics_frame(metrics)
    current = frame.iloc[-1] if not frame.empty else {}
    dice = current.get("dice_score") if not frame.empty else None
    columns = st.columns(4)
    columns[0].metric("FL round", int(current.get("round", 0)) if not frame.empty else "—")
    columns[1].metric("Global model accuracy (Dice)", f"{dice:.2%}" if pd.notna(dice) else "—")
    columns[2].metric("Validation loss", f"{current.get('val_loss', 0):.4f}" if not frame.empty else "—")
    columns[3].metric("Aggregation status", "Complete" if not frame.empty else "Waiting for training")
    if frame.empty:
        st.info("No exported FL metrics yet. Run federated training to populate the dashboard."); return
    left, right = st.columns(2)
    left.plotly_chart(px.line(frame, x="round", y="dice_score", markers=True, title="Global Dice accuracy by round", labels={"dice_score":"Dice accuracy"}), use_container_width=True)
    right.plotly_chart(px.line(frame, x="round", y="val_loss", markers=True, title="Validation loss by round", labels={"val_loss":"Loss"}), use_container_width=True)

def render_prediction() -> None:
    st.subheader("MRI prediction")
    st.caption("Upload the four BraTS modality volumes (T1c, T1n, T2f, T2w). Inference uses the existing FedMed 3D U-Net and trained checkpoint.")
    uploads = st.file_uploader("MRI modality volumes (.nii or .nii.gz)", type=["nii", "gz"], accept_multiple_files=True)
    checkpoint = model_checkpoint()
    if checkpoint: st.success(f"Model checkpoint ready: `{checkpoint.relative_to(PROJECT_ROOT)}`")
    else: st.warning("No trained checkpoint found. Run training or place an existing global checkpoint in `checkpoints/`.")
    if st.button("Run prediction", type="primary", disabled=not checkpoint):
        if len(uploads or []) != 4: st.error("Please upload exactly four MRI modality volumes."); return
        try:
            import torch
            from monai.transforms import Compose, EnsureChannelFirstd, LoadImaged, NormalizeIntensityd
            with tempfile.TemporaryDirectory() as directory:
                paths = []
                for uploaded in uploads:
                    target = Path(directory) / uploaded.name; target.write_bytes(uploaded.getbuffer()); paths.append(str(target))
                sample = Compose([LoadImaged(keys="image"), EnsureChannelFirstd(keys="image"), NormalizeIntensityd(keys="image", nonzero=True, channel_wise=True)])({"image": paths})
                image = sample["image"].unsqueeze(0); model = create_model()
                state = torch.load(checkpoint, map_location="cpu"); model.load_state_dict(state.get("model_state_dict", state)); model.eval()
                with torch.no_grad(): probabilities = torch.softmax(model(image), dim=1)
                st.success("Segmentation inference completed."); st.metric("Mean voxel confidence", f"{float(probabilities.max(dim=1).values.mean()):.2%}")
                st.caption("The prediction mask is computed in memory; patient images are not retained by the app.")
        except Exception as error: st.error(f"Prediction could not run: {error}")

def render_evaluation_metrics() -> None:
    st.subheader("Evaluation metrics")
    st.caption("The current engine exports Dice score and validation loss only. Precision, recall, F1, and a confusion matrix cannot be calculated honestly without saved per-class labels and predictions.")
    for col, label in zip(st.columns(3), ["Precision", "Recall", "F1 score"]): col.metric(label, "Not exported")
    figure, axis = plt.subplots(figsize=(5, 3)); axis.text(.5, .5, "Confusion matrix unavailable\n(no saved class predictions/labels)", ha="center", va="center"); axis.set_axis_off(); st.pyplot(figure, clear_figure=True)

def home_page() -> None:
    st.markdown("""<div class="hero"><h1>FedMed</h1><p>Privacy-preserving brain tumour segmentation through cross-silo federated learning.</p></div>""", unsafe_allow_html=True)
    st.write("FedMed lets hospitals train one global MONAI 3D U-Net while MRI data stays inside each hospital. Flower coordinates weighted FedAvg updates instead of collecting patient scans.")
    for col, label, value in zip(st.columns(3), ["Hospital clients", "Data sharing", "Model"], [NUM_CLIENTS, "None", "MONAI 3D U-Net"]): col.metric(label, value)
    st.subheader("Workflow"); st.code("Private MRI data → local hospital training → weight update → FedAvg aggregation → global model", language="text")

def dataset_page() -> None:
    st.title("Dataset"); st.write("BraTS 2023 multi-modal MRI data is discovered by the existing dataset loader and deterministically partitioned across hospitals."); st.code(str(DATASET_ROOT), language="text")
    if DATASET_ROOT.exists(): st.success(f"Dataset directory found with {len([path for path in DATASET_ROOT.iterdir() if path.is_dir()])} patient folders.")
    else: st.warning("Dataset directory is not available in this deployment. Set `FEDMED_DATASET_ROOT` locally before training; do not upload patient data to a public deployment.")
    st.dataframe(pd.DataFrame({"Hospital":HOSPITALS, "Client ID":range(NUM_CLIENTS), "Partition":["Deterministic, non-overlapping"] * NUM_CLIENTS}), use_container_width=True, hide_index=True)

def training_page() -> None:
    st.title("Training"); method = st.radio("Training mode", ["Federated learning", "Centralized baseline"], horizontal=True); rounds = st.slider("Federated rounds", 1, 10, 3, disabled=method != "Federated learning")
    st.info("Training uses the existing project code and may take substantial compute. Community Cloud is intended for dashboard viewing, not long-running clinical training.")
    if st.button("Start training", type="primary"):
        progress, log_box = st.progress(0), st.empty()
        try:
            if method == "Federated learning": run_federated_training(rounds, log_box, progress)
            else: run_centralized_training(log_box, progress)
        except Exception as error: st.error(f"Training could not start: {error}")

def dashboard_page() -> None:
    st.title("Federated learning dashboard"); metrics = load_metrics(); render_metrics(metrics)
    st.subheader("Connected hospitals"); frame = metrics_frame(metrics); active = int(frame.iloc[-1].get("active_clients", 0)) if not frame.empty else 0
    st.dataframe(pd.DataFrame({"Hospital":HOSPITALS, "Status":["Connected" if index < active else "Awaiting training" for index in range(NUM_CLIENTS)], "Local client accuracy":["Not exported by client"] * NUM_CLIENTS}), use_container_width=True, hide_index=True)
    st.subheader("Training logs"); st.json(metrics); render_evaluation_metrics(); render_prediction()

def about_page() -> None:
    st.title("About FedMed"); st.markdown("FedMed is a final-year academic project demonstrating privacy-conscious collaborative model training for brain tumour MRI segmentation. It uses MONAI for 3D U-Net segmentation and Flower for cross-silo FedAvg orchestration.")
    st.subheader("Architecture"); st.code("Central Flower Server\n  ├── Hospital 1: St. Jude (private partition)\n  ├── Hospital 2: Mayo Clinic (private partition)\n  └── Hospital 3: Charité (private partition)", language="text"); st.caption("Research prototype only — not a clinical decision-support device.")

def main() -> None:
    inject_styles()
    with st.sidebar:
        st.title("🧠 FedMed"); page = st.radio("Navigate", ["Home", "Dataset", "Training", "Prediction", "Dashboard", "About"])
        if st.button("Refresh metrics"): load_metrics.clear(); st.rerun()
    {"Home":home_page, "Dataset":dataset_page, "Training":training_page, "Prediction":render_prediction, "Dashboard":dashboard_page, "About":about_page}[page]()

if __name__ == "__main__": main()
