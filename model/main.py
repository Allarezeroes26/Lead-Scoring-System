import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model_loader import ModelService
from schema import Customer

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model into the app state on startup
    try:
        app.state.model = ModelService()
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
    yield
    # Clean up on shutdown
    del app.state.model

app = FastAPI(title="ML Prediction Service", lifespan=lifespan)

# Security: Pull the frontend URL from environment variables
# On Render, you will set ALLOWED_ORIGINS to https://your-frontend.com
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": hasattr(app.state, "model")}

@app.get("/")
def root():
    return {"message": "ML Service is running"}

@app.post("/predict")
def predict(input_data: Customer):
    try:
        return app.state.model.predict(input_data.dict())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict_batch")
def predict_batch(inputs: list[Customer]):
    try:
        return app.state.model.predict_batch([i.dict() for i in inputs])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/weights")
def get_weights():
    try:
        m = app.state.model
        weights_list = []
        for name, weight in zip(m.feature_names, m.w.tolist()):
            display_name = name.replace("_", " ").title()
            weights_list.append({
                "feature": display_name,
                "weight": float(weight),
                "type": "Categorical" if "_" in name else "Numerical"
            })
        weights_list.sort(key=lambda x: abs(x["weight"]), reverse=True)
        return {
            "weights": weights_list,
            "threshold": m.threshold,
            "bias": float(m.b)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/settings/update")
def update_settings(settings: dict):
    if "threshold" not in settings:
        raise HTTPException(status_code=400, detail="Missing threshold")
    app.state.model.threshold = float(settings["threshold"])
    return {"status": "success", "new_threshold": app.state.model.threshold}

@app.post("/settings/reset")
def reset_settings():
    try:
        app.state.model = ModelService()
        return {"status": "success", "threshold": app.state.model.threshold}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))