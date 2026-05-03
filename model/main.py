from fastapi import FastAPI
from model_loader import ModelService
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
model = ModelService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict(input_dict: dict):
    return model.predict(input_dict)