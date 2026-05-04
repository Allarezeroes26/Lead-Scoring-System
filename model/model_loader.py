import numpy as np
import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

class ModelService:
    def __init__(self):
        self.w = np.load(BASE_DIR / 'weights.npy')
        self.b = np.load(BASE_DIR / 'bias.npy')
        
        self.mean = np.load(BASE_DIR / 'mean.npy')
        self.std = np.load(BASE_DIR / 'std.npy')
        
        self.col_idx = np.load(BASE_DIR / 'col_idx.npy')
        
        self.threshold = float(np.load(BASE_DIR / 'threshold.npy')[0])
        
        with open(BASE_DIR / "feature_names.json") as f:
            self.feature_names = json.load(f)
        
        self.feature_index = {
            name: i for i, name in enumerate(self.feature_names)
        }
        
    def normalize_value(self, value):
        if isinstance(value, str):
            value = value.lower()
            if value == "yes":
                return 1
            if value == "no":
                return 0
        return value
            
    def preprocess(self, input_dict):
        x = np.zeros(len(self.feature_names))
        
        REQUIRED_FIELDS = ["age", "balance", "duration"]
        
        for field in REQUIRED_FIELDS:
            if field not in input_dict:
                raise ValueError(f"Missing required field: {field}")

        for key, value in input_dict.items():

            value = self.normalize_value(value)

            if key in self.feature_index:
                try:
                    x[self.feature_index[key]] = float(value)
                except:
                    raise ValueError(f"Invalid numeric value for {key}: {value}")

            else:
                col_name = f"{key}_{value}"

                if col_name in self.feature_index:
                    x[self.feature_index[col_name]] = 1
                else:
                    print(f"Skipping unknown feature: {key}={value}")
                    
        return x
    
    
    def scale(self, x):
        x_scaled = x.copy()
        x_scaled[self.col_idx] = (x_scaled[self.col_idx] - self.mean) / self.std
        return x_scaled
    
    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -500, 500)))
    
    def predict(self, input_dict):
        x = self.preprocess(input_dict)
        x = self.scale(x)
        
        z = np.dot(x, self.w) + self.b
        proba = self.sigmoid(z)
        
        return {
            "score": float(proba),
            "status": (
                "Hot" if proba >= self.threshold else
                "Warm" if proba >= 0.4 else
                "Cold"
            )
        }
        
    def predict_batch(self, inputs: list):
        return [self.predict(item) for item in inputs]