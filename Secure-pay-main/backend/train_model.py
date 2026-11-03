import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.datasets import make_classification
import joblib
import os

def create_synthetic_data(num_samples=10000):
    # Generate a challenging dataset natively requiring machine learning
    # Features: amount_scaled, device_score_scaled, is_weekend, time_of_day_scaled
    X, y = make_classification(
        n_samples=num_samples, 
        n_features=4, 
        n_informative=4, 
        n_redundant=0,
        n_classes=2, 
        weights=[0.95, 0.05], # 5% fraud rate
        random_state=42
    )
    
    df = pd.DataFrame(X, columns=['amount', 'device_score', 'is_weekend', 'time_of_day'])
    
    # Scale to realistic, non-rule-based distributions
    df['amount'] = np.abs(df['amount'] * 15000) + 100
    df['device_score'] = (df['device_score'] - df['device_score'].min()) / (df['device_score'].max() - df['device_score'].min())
    df['is_weekend'] = np.where(df['is_weekend'] > 0, 1, 0)
    df['time_of_day'] = np.abs((df['time_of_day'] * 5).astype(int)) % 24
    
    df['is_fraud'] = y
    return df

def train_and_save_model():
    print("Generating pure ML synthetic data using make_classification...")
    df = create_synthetic_data(10000)
    
    X = df[['amount', 'device_score', 'is_weekend', 'time_of_day']]
    y = df['is_fraud']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Random Forest
    print("Initializing state-of-the-art Random Forest Classifier...")
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    
    # XGBoost
    print("Initializing XGBoost Classifier...")
    xgb_model = XGBClassifier(eval_metric='logloss', use_label_encoder=False, random_state=42, max_depth=6)
    
    # Ensemble (Voting Classifier)
    print("Training Random Forest & XGBoost Ensemble Model...")
    ensemble_model = VotingClassifier(
        estimators=[('rf', rf_model), ('xgb', xgb_model)],
        voting='soft'
    )
    
    ensemble_model.fit(X_train, y_train)
    
    # Evaluation
    y_pred_probs = ensemble_model.predict_proba(X_test)[:, 1]
    y_pred = (y_pred_probs > 0.5).astype(int)
    
    print("Ensemble Model Evaluation:")
    print(classification_report(y_test, y_pred))
    
    # Save Model
    model_path = os.path.join(os.path.dirname(__file__), 'fraud_model.pkl')
    joblib.dump(ensemble_model, model_path)
    print(f"Ensemble Model successfully saved to {model_path}!")

if __name__ == "__main__":
    train_and_save_model()
