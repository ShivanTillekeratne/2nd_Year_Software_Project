import pymongo
import pandas as pd
from faker import Faker
import json

# Initialize Faker
fake = Faker()

# Connect to MongoDB
url = 'mongodb+srv://supanhan_new:MedInsProject2024@cluster0.unugazk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = pymongo.MongoClient(url)
db = client['MedInsAnalysis']
customers_collection = db['Customers']

# Load claimant details from JSON file
json_file_path = 'files/getClaimantDetails.json'
with open(json_file_path, 'r') as file:
    claimant_details = json.load(file)

# Add additional fake data for each claimant
for claimant in claimant_details:
    claimant['first_name'] = fake.first_name()
    claimant['last_name'] = fake.last_name()
    claimant['address'] = fake.address()
    claimant['phone_number'] = fake.phone_number()
    claimant['email'] = fake.email()
    claimant['ssn'] = fake.ssn()
    claimant['weight'] = fake.random_int(min=50, max=150)  # Weight in kg
    claimant['height'] = fake.random_int(min=150, max=200)  # Height in cm
    claimant['job'] = fake.job()
    claimant['company'] = fake.company()
    claimant['marital_status'] = fake.random_element(elements=('single', 'married', 'divorced', 'widowed'))
    claimant['number_of_children'] = fake.random_int(min=0, max=5)

# Insert the enriched data into the Customers collection
customers_collection.insert_many(claimant_details)

print("Customer details have been added to the Customers collection.")
