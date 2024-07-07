import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
import joblib
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers import Adam

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
scaler_save_path = os.path.join('files', 'scaler_optimal.pkl')
os.makedirs(os.path.dirname(scaler_save_path), exist_ok=True)
joblib.dump(scaler, scaler_save_path)
print(f'Scaler saved to {scaler_save_path}')

# Build the neural network model based on the optimal hyperparameters
model = Sequential()
model.add(Dense(256, input_dim=X_train_scaled.shape[1], activation='relu'))
model.add(Dense(96, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

# Compile the model with a lower learning rate
optimizer = Adam(learning_rate=0.001)
model.compile(loss='binary_crossentropy', optimizer=optimizer, metrics=['accuracy'])

# Use EarlyStopping to prevent overfitting
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# Train the model
history = model.fit(X_train_scaled, y_train_smote, epochs=50, batch_size=64, validation_split=0.2, callbacks=[early_stopping])

# Evaluate the model on the test data
loss, accuracy = model.evaluate(X_test_scaled, y_test)
print(f'Test Loss: {loss}')
print(f'Test Accuracy: {accuracy}')

# Make predictions on the test data to inspect probability outputs
predictions = model.predict(X_test_scaled)
print(f'Prediction probabilities: {predictions[:10]}')  # Print first 10 predictions for inspection

# Save the model in the native Keras format
model_save_path = os.path.join('files', 'fraud_detection_model_optimal.keras')
model.save(model_save_path)
print(f'Model saved to {model_save_path}')
