import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib
import pymongo

# Define file paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scaler_path = os.path.join(BASE_DIR, 'services', 'scaler_rf.pkl')
model_path = os.path.join(BASE_DIR, 'services', 'fraud_detection_rf_model.pkl')

# Load the scaler
scaler = joblib.load(scaler_path)

# Ensure the scaler is an instance of StandardScaler
if not isinstance(scaler, StandardScaler):
    raise ValueError("Loaded scaler is not an instance of StandardScaler")

# Load the model
model = joblib.load(model_path)

def make_predictions(valid_claims):
    new_claims_df = pd.DataFrame(valid_claims)

    # Convert date fields to datetime format
    new_claims_df['claim_date'] = pd.to_datetime(new_claims_df['claim_date'])
    new_claims_df['date_of_birth'] = pd.to_datetime(new_claims_df['date_of_birth'])
    new_claims_df['service_date'] = pd.to_datetime(new_claims_df['service_date'])

    # Calculate the age of the claimant at the time of the service
    new_claims_df['age_at_service'] = new_claims_df['service_date'].dt.year - new_claims_df['date_of_birth'].dt.year

    # Drop original date columns if they are not needed
    new_claims_df.drop(columns=['claim_date', 'date_of_birth', 'service_date'], inplace=True)

    # Function for frequency encoding
    def frequency_encode(df, col):
        freq = df[col].value_counts() / len(df)
        df[col + '_freq_encode'] = df[col].map(freq)
        return df

    # Frequency encode high-cardinality columns
    high_cardinality_cols = ['provider_name', 'primary_diagnosis_code', 'service_code']
    for col in high_cardinality_cols:
        new_claims_df = frequency_encode(new_claims_df, col)

    # One-hot encode low-cardinality columns
    low_cardinality_cols = ['claim_type', 'gender', 'plan_type']
    new_claims_df = pd.get_dummies(new_claims_df, columns=low_cardinality_cols)

    # Ensure the new data has the same columns as the training data
    required_columns = ['billed_amount', 'allowed_amount', 'paid_amount', 'age_at_service',
                        'provider_name_freq_encode', 'primary_diagnosis_code_freq_encode',
                        'service_code_freq_encode', 'claim_type_Behavioral Health',
                        'claim_type_Dental', 'claim_type_Medical', 'claim_type_Pharmacy',
                        'claim_type_Vision', 'gender_Female', 'gender_Male', 'gender_Other',
                        'plan_type_EPO', 'plan_type_HDHP', 'plan_type_HMO', 'plan_type_POS',
                        'plan_type_PPO']

    # Add any missing columns with default value 0
    for col in required_columns:
        if col not in new_claims_df.columns:
            new_claims_df[col] = 0

    # Reorder columns to match the training data
    new_claims_df = new_claims_df[required_columns]

    # Scale the new claims data
    new_claims_scaled = scaler.transform(new_claims_df)

    # Make predictions
    probabilities = model.predict_proba(new_claims_scaled)[:, 1]
    predictions = (probabilities > 0.5).astype(int)

    # Add predictions to the original data and keep only necessary columns
    output_data = []
    for i, prediction in enumerate(predictions):
        result = {
            'claim_id': valid_claims[i]['claim_id'],
            'claimant_id': valid_claims[i]['claimant_id'],
            'provider_id': valid_claims[i]['provider_id'],
            'is_fraud': bool(prediction),
            'probability': float(probabilities[i])
        }
        output_data.append(result)

    return output_data
