import numpy as np
import json

class ModelService:
    def __init__(self):
        self.w = np.load('weights.npy')
        self.b = np.load('bias.npy')
        
        self.mean = np.load('mean.npy')
        self.std = np.load('std.npy')
        
        self.col_idx = np.load('col_idx.npy')
        
        self.threshold = float(np.load('threshold.npy'))
        
        with open("feature_names.json") as f:
            self.feature_names = json.load(f)
            
    def preprocess(self, input_dict):
        x = np.zeros(len(self.feature_names))
        
        for i, col in enumerate(self.feature_names):
            if col in input_dict:
                x[i] = input_dict[col]
            
        return x
    
    def scale(self, x):
        x[self.col_idx] = (x[self.col_idx] - self.mean) / self.std
        return x
    
    def sigmoid(self, z):
        return 1 / (1 + np.exp(-z))
    
    def predict(self, input_dict):
        x = self.preprocess(input_dict)
        x = self.scale(x)
        
        z = np.dot(x, self.w) + self.b
        proba = self.sigmoid(z)
        
        return {
            "Probability": proba,
            "Prediction": int(proba >= self.threshold)
        }