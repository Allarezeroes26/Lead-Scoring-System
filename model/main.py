from fastapi import FastAPI, HTTPException
from model_loader import ModelService
from schema import Customer
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
def predict(input_data: Customer):
    try:
        return model.predict(input_data.dict())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
@app.post("/predict_batch")
def predict_batch(inputs: list[Customer]):
    try:
        return model.predict_batch([input.dict() for input in inputs])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.get("/weights")
def get_weights():
    try:
        weights_list = []
        for name, weight in zip(model.feature_names, model.w.tolist()):
            # Replace underscores with spaces for the UI
            display_name = name.replace("_", " ").title()
            
            weights_list.append({
                "feature": display_name,
                "weight": float(weight),
                "type": "Categorical" if "_" in name else "Numerical"
            })
        
        weights_list.sort(key=lambda x: abs(x["weight"]), reverse=True)
        
        return {
            "weights": weights_list,
            "threshold": model.threshold,
            "bias": float(model.b)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))