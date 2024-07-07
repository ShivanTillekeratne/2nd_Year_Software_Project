import pymongo
import pandas as pd

# Connect to MongoDB
url = 'mongodb+srv://supanhan_new:MedInsProject2024@cluster0.unugazk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = pymongo.MongoClient(url)
db = client['MedInsAnalysis']
collection = db['Claims']

# Retrieve all unique claimant_id
unique_claimant_ids = collection.distinct('claimant_id')

# Convert to DataFrame
df = pd.DataFrame(unique_claimant_ids, columns=['claimant_id'])

# Save to CSV
csv_file_path = 'files/getClaimantIDs.csv'
df.to_csv(csv_file_path, index=False)

print(f"CSV file saved at: {csv_file_path}")
