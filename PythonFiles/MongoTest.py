import pymongo
from faker import Faker
import random
from datetime import datetime, timedelta
import string

# Connect to MongoDB
url = 'mongodb+srv://supanhan_new:MedInsProject2024@cluster0.unugazk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
client = pymongo.MongoClient(url)
db = client['MedInsAnalysis']
collection = db['Claims']

# Initialize Faker
fake = Faker()

# List of claim types and plan types
claim_types = ['Medical', 'Dental', 'Vision', 'Pharmacy', 'Behavioral Health']
plan_types = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP']


# Generate random data for valid claims
def generate_claims_data(num_claimants=1000):
    data = []
    for _ in range(num_claimants):
        claimant_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))  # Generate a 5-character unique ID
        dob = fake.date_of_birth(minimum_age=18, maximum_age=90)
        dob = datetime.combine(dob, datetime.min.time())  # Keep as datetime object
        gender = random.choice(['Male', 'Female', 'Other'])
        num_claims = random.randint(1, 25)  # Random number of claims for each claimant
        for _ in range(num_claims):
            claim_date = fake.date_this_decade()
            claim_date = datetime.combine(claim_date, datetime.min.time())  # Keep as datetime object
            service_date = fake.date_between_dates(date_start=dob, date_end=claim_date)
            service_date = datetime.combine(service_date, datetime.min.time())  # Keep as datetime object
            billed_amount = round(random.uniform(100, 10000), 2)
            allowed_amount = round(billed_amount * random.uniform(0.5, 1.0), 2)
            paid_amount = round(allowed_amount * random.uniform(0.5, 1.0), 2)
            claim_type = random.choice(claim_types)
            plan_type = random.choice(plan_types)

            claim = {
                'claim_id': fake.uuid4(),
                'claim_date': claim_date,
                'claim_type': claim_type,
                'claimant_id': claimant_id,
                'date_of_birth': dob,
                'gender': gender,
                'provider_id': ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
                'provider_name': fake.company(),
                'service_date': service_date,
                'service_code': ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
                'billed_amount': billed_amount,
                'allowed_amount': allowed_amount,
                'paid_amount': paid_amount,
                'primary_diagnosis_code': fake.bothify(text='??###'),
                'plan_type': plan_type
            }
            data.append(claim)
    return data


# Function to insert data in batches
def insert_data_in_batches(data, batch_size=1000):
    for i in range(0, len(data), batch_size):
        batch = data[i:i+batch_size]
        collection.insert_many(batch)
        print(f"Inserted batch {i // batch_size + 1}")


# Function to generate invalid claims
# Function to generate invalid claims
def generate_invalid_claims():
    data = []
    for _ in range(200):  # Generate multiple invalid claims for each rule
        claimant_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
        dob = fake.date_of_birth(minimum_age=18, maximum_age=90)
        dob = datetime.combine(dob, datetime.min.time())
        gender = random.choice(['Male', 'Female', 'Other'])

        # Claim date in the future
        claim_date_future = datetime.now() + timedelta(days=30)
        service_date_future = claim_date_future - timedelta(days=10)
        claim_future = {
            'claim_id': fake.uuid4(),
            'claim_date': claim_date_future,
            'claim_type': random.choice(claim_types),
            'claimant_id': claimant_id,
            'date_of_birth': dob,
            'gender': gender,
            'provider_id': ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
            'provider_name': fake.company(),
            'service_date': service_date_future,
            'service_code': ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
            'billed_amount': 1000,
            'allowed_amount': 800,
            'paid_amount': 750,
            'primary_diagnosis_code': fake.bothify(text='??###'),
            'plan_type': 'InvalidPlanType'  # Invalid plan type
        }
        data.append(claim_future)

        # Service date after claim date
        claim_date = datetime.now() - timedelta(days=10)
        service_date_after_claim = claim_date + timedelta(days=5)
        claim_service_after = {
            'claim_id': fake.uuid4(),
            'claim_date': claim_date,
            'claim_type': random.choice(claim_types),
            'claimant_id': claimant_id,
            'date_of_birth': dob,
            'gender': gender,
            'provider_id': ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
            'provider_name': fake.company(),
            'service_date': service_date_after_claim,
            'service_code': ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
            'billed_amount': 1000,
            'allowed_amount': 800,
            'paid_amount': 750,
            'primary_diagnosis_code': fake.bothify(text='??###'),
            'plan_type': random.choice(plan_types)
        }
        data.append(claim_service_after)

        # Service date before date of birth
        service_date_before_dob = dob - timedelta(days=10)
        claim_service_before_dob = {
            'claim_id': fake.uuid4(),
            'claim_date': claim_date,
            'claim_type': random.choice(claim_types),
            'claimant_id': claimant_id,
            'date_of_birth': dob,
            'gender': gender,
            'provider_id': ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
            'provider_name': fake.company(),
            'service_date': service_date_before_dob,
            'service_code': ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
            'billed_amount': 1000,
            'allowed_amount': 800,
            'paid_amount': 750,
            'primary_diagnosis_code': fake.bothify(text='??###'),
            'plan_type': random.choice(plan_types)
        }
        data.append(claim_service_before_dob)

        # Invalid claim type
        invalid_claim_type = {
            'claim_id': fake.uuid4(),
            'claim_date': claim_date,
            'claim_type': 'InvalidClaimType',  # Invalid claim type
            'claimant_id': claimant_id,
            'date_of_birth': dob,
            'gender': gender,
            'provider_id': ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
            'provider_name': fake.company(),
            'service_date': service_date_after_claim,
            'service_code': ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
            'billed_amount': 1000,
            'allowed_amount': 800,
            'paid_amount': 750,
            'primary_diagnosis_code': fake.bothify(text='??###'),
            'plan_type': random.choice(plan_types)
        }
        data.append(invalid_claim_type)

        # Billed amount exceeds 1.5 times allowed amount
        billed_exceeds_allowed = {
            'claim_id': fake.uuid4(),
            'claim_date': claim_date,
            'claim_type': random.choice(claim_types),
            'claimant_id': claimant_id,
            'date_of_birth': dob,
            'gender': gender,
            'provider_id': ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
            'provider_name': fake.company(),
            'service_date': service_date_after_claim,
            'service_code': ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
            'billed_amount': 1500,
            'allowed_amount': 800,
            'paid_amount': 750,
            'primary_diagnosis_code': fake.bothify(text='??###'),
            'plan_type': random.choice(plan_types)
        }
        data.append(billed_exceeds_allowed)

        # Paid amount exceeds allowed amount
        paid_exceeds_allowed = {
            'claim_id': fake.uuid4(),
            'claim_date': claim_date,
            'claim_type': random.choice(claim_types),
            'claimant_id': claimant_id,
            'date_of_birth': dob,
            'gender': gender,
            'provider_id': ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
            'provider_name': fake.company(),
            'service_date': service_date_after_claim,
            'service_code': ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)),
            'billed_amount': 1000,
            'allowed_amount': 800,
            'paid_amount': 850,
            'primary_diagnosis_code': fake.bothify(text='??###'),
            'plan_type': random.choice(plan_types)
        }
        data.append(paid_exceeds_allowed)

    return data



# Generate and insert valid claims into the collection
claims_data = generate_claims_data()
insert_data_in_batches(claims_data)

# Insert invalid claims into the collection
invalid_claims_data = generate_invalid_claims()
insert_data_in_batches(invalid_claims_data, batch_size=len(invalid_claims_data))

print("Data insertion completed.")
