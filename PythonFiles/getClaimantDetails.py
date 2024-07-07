import pymongo
import pandas as pd
import json

# Connect to MongoDB
url = 'mongodb+srv://supanhan_new:MedInsProject2024@cluster0.unugazk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = pymongo.MongoClient(url)
db = client['MedInsAnalysis']
collection = db['Claims']

# Aggregate unique claimant_id, date_of_birth, and gender
pipeline = [
    {
        "$group": {
            "_id": "$claimant_id",
            "date_of_birth": {"$first": "$date_of_birth"},
            "gender": {"$first": "$gender"}
        }
    },
    {
        "$project": {
            "_id": 0,
            "claimant_id": "$_id",
            "date_of_birth": 1,
            "gender": 1
        }
    }
]

unique_claimants = list(collection.aggregate(pipeline))

# Convert to JSON and save to file
json_file_path = 'files/getClaimantDetails.json'
with open(json_file_path, 'w') as file:
    json.dump(unique_claimants, file, indent=4)

print(f"JSON file saved at: {json_file_path}")
