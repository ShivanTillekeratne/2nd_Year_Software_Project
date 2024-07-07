import pandas as pd
import numpy as np
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import kerastuner as kt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Load the CSV file
csv_file_path = os.path.join('files', 'claims_with_patt3.csv')
df = pd.read_csv(csv_file_path)

# Drop rows with missing values
df.dropna(inplace=True)

# Convert dates to datetime format
df['claim_date'] = pd.to_datetime(df['claim_date'])
df['date_of_birth'] = pd.to_datetime(df['date_of_birth'])
df['service_date'] = pd.to_datetime(df['service_date'])

# Ensure dates are in the required ISO format
df['claim_date'] = df['claim_date'].dt.strftime('%Y-%m-%dT%H:%M:%S')
df['date_of_birth'] = df['date_of_birth'].dt.strftime('%Y-%m-%dT%H:%M:%S')
df['service_date'] = df['service_date'].dt.strftime('%Y-%m-%dT%H:%M:%S')

# Calculate the age of the claimant at the time of the service
df['age_at_service'] = pd.to_datetime(df['service_date']).dt.year - pd.to_datetime(df['date_of_birth']).dt.year

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
X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# Initialize the StandardScaler
scaler = StandardScaler()

# Fit and transform the training data
X_train_scaled = scaler.fit_transform(X_train)

# Transform the testing data
X_test_scaled = scaler.transform(X_test)

# Save the scaler to a file
scaler_save_path = os.path.join('files', 'scaler3.pkl')
os.makedirs(os.path.dirname(scaler_save_path), exist_ok=True)
joblib.dump(scaler, scaler_save_path)
print(f'Scaler saved to {scaler_save_path}')


# Define a function for building the model
def build_model(hp):
    model = Sequential()
    model.add(Dense(units=hp.Int('units_input', min_value=32, max_value=512, step=32), activation='relu',
                    input_dim=X_train.shape[1]))

    for i in range(hp.Int('num_layers', 1, 5)):
        model.add(Dense(units=hp.Int('units_' + str(i), min_value=32, max_value=512, step=32), activation='relu'))

    model.add(Dense(1, activation='sigmoid'))

    model.compile(
        optimizer=hp.Choice('optimizer', values=['adam', 'rmsprop']),
        loss='binary_crossentropy',
        metrics=['accuracy'])

    return model


# Create a tuner
tuner = kt.RandomSearch(
    build_model,
    objective='val_accuracy',
    max_trials=10,  # Number of models to try
    executions_per_trial=2,  # Number of times to train each model
    directory='my_dir',
    project_name='fraud_detection')

# Perform the search
tuner.search(X_train_scaled, y_train, epochs=50, validation_split=0.2)

# Get the optimal hyperparameters
best_hps = tuner.get_best_hyperparameters(num_trials=1)[0]

# Build the model with the optimal hyperparameters and train it
model = tuner.hypermodel.build(best_hps)
history = model.fit(X_train_scaled, y_train, epochs=50, validation_split=0.2)

# Evaluate the model on the test data
loss, accuracy = model.evaluate(X_test_scaled, y_test)
print(f'Test Loss: {loss}')
print(f'Test Accuracy: {accuracy}')

# Save the model in the native Keras format
model_save_path = os.path.join('files', 'fraud_detection_model_optimal.keras')
model.save(model_save_path)
print(f'Model saved to {model_save_path}')
