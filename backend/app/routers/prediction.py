from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import numpy as np
import joblib
import os
from typing import Dict
from app.utils.auth import get_current_user  # Updated import path

router = APIRouter()

# Load the model and scaler
model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'ml', 'model')

# Load both models
model = joblib.load(os.path.join(model_path, 'fetal_health_model.joblib'))
scaler = joblib.load(os.path.join(model_path, 'fetal_health_scaler.joblib'))
simple_model = joblib.load(os.path.join(model_path, 'simple_fetal_health_model.joblib'))
simple_scaler = joblib.load(os.path.join(model_path, 'simple_fetal_health_scaler.joblib'))

class PredictionInput(BaseModel):
    accelerations: float
    fetal_movement: float
    uterine_contractions: float
    light_decelerations: float
    severe_decelerations: float
    prolongued_decelerations: float
    abnormal_short_term_variability: float
    mean_value_of_short_term_variability: float
    percentage_of_time_with_abnormal_long_term_variability: float
    mean_value_of_long_term_variability: float
    histogram_width: float
    histogram_min: float
    histogram_max: float
    histogram_number_of_peaks: float
    histogram_number_of_zeroes: float
    histogram_mode: float
    histogram_mean: float
    histogram_median: float
    histogram_variance: float
    histogram_tendency: float

@router.post("/predict")
async def predict(data: PredictionInput, current_user: Dict = Depends(get_current_user)):
    try:
        # Convert input data to numpy array
        input_data = np.array([[
            data.accelerations,
            data.fetal_movement,
            data.uterine_contractions,
            data.light_decelerations,
            data.severe_decelerations,
            data.prolongued_decelerations,
            data.abnormal_short_term_variability,
            data.mean_value_of_short_term_variability,
            data.percentage_of_time_with_abnormal_long_term_variability,
            data.mean_value_of_long_term_variability,
            data.histogram_width,
            data.histogram_min,
            data.histogram_max,
            data.histogram_number_of_peaks,
            data.histogram_number_of_zeroes,
            data.histogram_mode,
            data.histogram_mean,
            data.histogram_median,
            data.histogram_variance,
            data.histogram_tendency
        ]])
        
        # Scale the input
        scaled_input = scaler.transform(input_data)
        
        # Make prediction
        prediction = model.predict(scaled_input)
        probabilities = model.predict_proba(scaled_input)
        
        # Map prediction to health status
        health_status = {
            1: "Normal",
            2: "Suspect",
            3: "Pathological"
        }
        
        return {
            "prediction": health_status[prediction[0]],
            "confidence": float(max(probabilities[0]) * 100),
            "probabilities": {
                "Normal": float(probabilities[0][0] * 100),
                "Suspect": float(probabilities[0][1] * 100),
                "Pathological": float(probabilities[0][2] * 100)
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SimplePredictionInput(BaseModel):
    accelerations: float
    fetal_movement: float
    uterine_contractions: float

@router.post("/predict-simple")
async def predict_simple(data: SimplePredictionInput, current_user: Dict = Depends(get_current_user)):
    try:
        input_data = np.array([[
            data.accelerations,
            data.fetal_movement,
            data.uterine_contractions,
        ]])
        
        scaled_input = simple_scaler.transform(input_data)
        prediction = simple_model.predict(scaled_input)
        probabilities = simple_model.predict_proba(scaled_input)
        
        health_status = {
            1: "Normal",
            2: "Suspect",
            3: "Pathological"
        }
        
        return {
            "prediction": health_status[prediction[0]],
            "confidence": float(max(probabilities[0]) * 100),
            "probabilities": {
                "Normal": float(probabilities[0][0] * 100),
                "Suspect": float(probabilities[0][1] * 100),
                "Pathological": float(probabilities[0][2] * 100)
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
