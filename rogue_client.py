import flwr as fl
import numpy as np

class DummyClient(fl.client.NumPyClient):
    pass

fl.client.start_numpy_client(server_address="127.0.0.1:8080", client=DummyClient())
