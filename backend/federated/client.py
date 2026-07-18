"""
Flower Client

Represents one hospital participating in
federated learning.
"""


class HospitalClient:
    """Represents a simulated hospital node."""

    def __init__(self, hospital_id: str):
        self.hospital_id = hospital_id

    def load_dataset(self):
        print(f"[{self.hospital_id}] Loading dataset...")

    def load_model(self):
        print(f"[{self.hospital_id}] Loading model...")

    def train(self):
        print(f"[{self.hospital_id}] Local training started.")

    def evaluate(self):
        print(f"[{self.hospital_id}] Evaluating local model.")


if __name__ == "__main__":
    client = HospitalClient("Hospital-1")

    client.load_dataset()
    client.load_model()
    client.train()
    client.evaluate()