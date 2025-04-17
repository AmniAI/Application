import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def train_model():
    # Update the data path
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'fetal_health.csv')
    data = pd.read_csv(data_path)
    
    # Separate features and target
    X = data.drop('fetal_health', axis=1)
    y = data['fetal_health']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    
    # Train the model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Save the model and scaler
    model_path = os.path.join(os.path.dirname(__file__), 'model')
    if not os.path.exists(model_path):
        os.makedirs(model_path)
    
    joblib.dump(model, os.path.join(model_path, 'fetal_health_model.joblib'))
    joblib.dump(scaler, os.path.join(model_path, 'fetal_health_scaler.joblib'))
    
    return model, scaler

if __name__ == "__main__":
    train_model()