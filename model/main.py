from fastapi import FastAPI, HTTPException
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

@app.get("/")
def root():
    return {"message": "ML Service is running"}

@app.post("/predict")
def predict(input_data: dict):
    try:
        return model.predict(input_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@app.post("/predict_batch")
def predict_batch(inputs: list):
    try:
        return model.predict_batch(inputs)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))