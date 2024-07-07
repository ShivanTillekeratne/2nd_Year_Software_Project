import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
import joblib

# Load the CSV file
csv_file_path = os.path.join('files', 'claims_with_patt3.csv')
df = pd.read_csv(csv_file_path)

# Drop rows with missing values
df.dropna(inplace=True)

# Convert dates to datetime format
df['claim_date'] = pd.to_datetime(df['claim_date'])
df['date_of_birth'] = pd.to_datetime(df['date_of_birth'])
df['service_date'] = pd.to_datetime(df['service_date'])

# Calculate the age of the claimant at the time of the service
df['age_at_service'] = df['service_date'].dt.year - df['date_of_birth'].dt.year

# Drop original date columns if they are not needed
df.drop(columns=['claim_date', 'date_of_birth', 'service_date'], inplace=True)

# Drop UUID columns if they are not needed
df.drop(columns=['claim_id', 'claimant_id', 'provider_id'], inplace=True)

# Identify the cardinality of categorical features
categorical_columns = ['claim_type', 'gender', 'provider_name', 'plan_type', 'primary_diagnosis_code', 'service_code']

# Function for frequency encoding
def frequency_encode(df, col):
    freq = df[col].value_counts() / len(df)
    df[col + '_freq_encode'] = df[col].map(freq)
    return df

# Frequency encode high-cardinality columns
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

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42, stratify=Y)

# Apply SMOTE to handle class imbalance
smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)

# Initialize the StandardScaler
scaler = StandardScaler()

# Fit and transform the training data
X_train_scaled = scaler.fit_transform(X_train_smote)

# Transform the testing data
X_test_scaled = scaler.transform(X_test)

# Save the scaler to a file
scaler_save_path = os.path.join('files', 'scaler_rf.pkl')
os.makedirs(os.path.dirname(scaler_save_path), exist_ok=True)
joblib.dump(scaler, scaler_save_path)
print(f'Scaler saved to {scaler_save_path}')

# Train a Random Forest Classifier
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train_smote)

# Evaluate the model on the test data
y_pred = rf_model.predict(X_test_scaled)
y_pred_proba = rf_model.predict_proba(X_test_scaled)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)

print(f'Test Accuracy: {accuracy}')
print(f'Test ROC AUC: {roc_auc}')
print(classification_report(y_test, y_pred))

# Save the model to a file
model_save_path = os.path.join('files', 'fraud_detection_rf_model.pkl')
joblib.dump(rf_model, model_save_path)
print(f'Model saved to {model_save_path}')
