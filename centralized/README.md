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
