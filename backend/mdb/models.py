from django.db import models
from db_connection import db

# Existing reference to the 'Person' collection
person_collection = db['Person']

# New reference to the 'Claims' collection
claims_collection = db['Claims']

# New reference to the 'Customers' collection
customers_collection = db['Customers']

# New reference to the 'Results' collection
results_collection = db['Results']
