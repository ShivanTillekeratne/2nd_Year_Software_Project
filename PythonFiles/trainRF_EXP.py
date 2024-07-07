import pandas as pd
import joblib

# Load the dataset
df = pd.read_csv('files/claims_with_patt3.csv')

# Load the scaler
scaler = joblib.load('files/scaler_rf.pkl')

# Load the model
rf_model = joblib.load('files/fraud_detection_rf_model.pkl')

# Preprocess the dataset
df.dropna(inplace=True)

# Convert dates to datetime format
df['claim_date'] = pd.to_datetime(df['claim_date'])
df['date_of_birth'] = pd.to_datetime(df['date_of_birth'])
df['service_date'] = pd.to_datetime(df['service_date'])

# Calculate the age of the claimant at the time of the service
df['age_at_service'] = df['service_date'].dt.year - df['date_of_birth'].dt.year

# Drop original date columns
df.drop(columns=['claim_date', 'date_of_birth', 'service_date'], inplace=True)

# Drop UUID columns
df.drop(columns=['claim_id', 'claimant_id', 'provider_id'], inplace=True)

# Frequency encode high-cardinality columns
def frequency_encode(df, col):
    freq = df[col].value_counts() / len(df)
    df[col + '_freq_encode'] = df[col].map(freq)
    return df

high_cardinality_cols = ['provider_name', 'primary_diagnosis_code', 'service_code']
for col in high_cardinality_cols:
    df = frequency_encode(df, col)

# One-hot encode low-cardinality columns
low_cardinality_cols = ['claim_type', 'gender', 'plan_type']
df = pd.get_dummies(df, columns=low_cardinality_cols)

# Drop the original high-cardinality columns
df.drop(columns=high_cardinality_cols, inplace=True)

# Separate features (X) and target (Y)
X = df.drop(columns=['is_fraud'])
Y = df['is_fraud']

# Scale the data
X_scaled = scaler.transform(X)

import matplotlib.pyplot as plt
import numpy as np

# Get feature importances
importances = rf_model.feature_importances_
indices = np.argsort(importances)[::-1]

# Plot the feature importances
plt.figure(figsize=(10, 6))
plt.title("Feature Importances")
plt.bar(range(X.shape[1]), importances[indices], align="center")
plt.xticks(range(X.shape[1]), X.columns[indices], rotation=90)
plt.xlim([-1, X.shape[1]])
plt.show()

from sklearn.inspection import _partial_dependence
from sklearn.inspection import PartialDependenceDisplay
features = [0, 1, 2]  # Replace with indices of important features
# Create the partial dependence plot
PartialDependenceDisplay.from_estimator(rf_model, X_scaled, features, feature_names=X.columns, grid_resolution=50)
plt.show()


import shap

explainer = shap.TreeExplainer(rf_model)
shap_values = explainer.shap_values(X_scaled)

# Summary plot for feature importance
shap.summary_plot(shap_values, X)

# Force plot for the first prediction
shap.force_plot(explainer.expected_value[1], shap_values[1][0], X.iloc[0])


import lime
import lime.lime_tabular

explainer = lime.lime_tabular.LimeTabularExplainer(X_scaled, feature_names=X.columns, class_names=['Not Fraud', 'Fraud'], discretize_continuous=True)

i = 0  # Index of the instance to explain
exp = explainer.explain_instance(X_scaled[i], rf_model.predict_proba, num_features=10)
exp.show_in_notebook(show_all=False)

