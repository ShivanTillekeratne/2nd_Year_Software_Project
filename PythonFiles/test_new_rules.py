import pymongo
import csv
import json
from datetime import datetime
from rules_engine import RuleEngine, rules  # Assuming you have the rules_engine.py in the same directory

# Connect to MongoDB
url = 'mongodb+srv://supanhan_new:MedInsProject2024@cluster0.unugazk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = pymongo.MongoClient(url)
db = client['MedInsAnalysis']
collection = db['claims_test']

# Initialize Rule Engine
engine = RuleEngine(rules)

# Fetch all claims from the claims_test collection
claims = list(collection.find())

# Initialize counters
total_claims = len(claims)
rule_counters = {rule['failure_message']: {'satisfied': 0, 'dissatisfied': 0} for rule in rules}

# Process each claim with the rules engine
results = []

for claim in claims:
    claim_id = str(claim["claim_id"])  # Convert ObjectId to string if necessary
    evaluation_results = engine.evaluate(claim)

    for evaluation_result in evaluation_results:
        rule = evaluation_result['rule']
        status = evaluation_result['status']
        rule_counters[rule][status] += 1

    result = {
        'claim_id': claim_id,
        'evaluation_results': evaluation_results
    }

    results.append(result)

# Log results to a JSON file
with open('files/rules_engine_results.json', 'w') as json_file:
    json.dump(results, json_file, indent=4)

# Log summary to a CSV file
with open('files/rules_engine_summary.csv', 'w', newline='') as csv_file:
    fieldnames = ['Rule', 'Satisfied', 'Dissatisfied']
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)

    writer.writeheader()
    for rule, counts in rule_counters.items():
        writer.writerow({'Rule': rule, 'Satisfied': counts['satisfied'], 'Dissatisfied': counts['dissatisfied']})

print(f"Total claims tested: {total_claims}")
print("Results and summary logged in the files folder.")
