from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
from .models import person_collection, claims_collection, customers_collection, results_collection
import json
from bson import ObjectId
from datetime import datetime
from bson.json_util import dumps
from .services.ml_model import make_predictions
from .services.rules_engine import RuleEngine, rules
import os

def index(request):
    return HttpResponse("<h1>App is Running</h1>")

@csrf_exempt
@require_http_methods(["GET"])
def get_all_results(request):
    try:
        results = list(results_collection.find({}))
        response = JsonResponse(json.loads(dumps(results)), safe=False, status=200)
        response["Access-Control-Allow-Origin"] = "*"  # Add this line to allow all origins
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    except Exception as e:
        response = JsonResponse({"error": str(e)}, status=400)
        response["Access-Control-Allow-Origin"] = "*"  # Add this line to allow all origins
        response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

def get_all(request):
    try:
        persons = list(person_collection.find({}, {"_id": 0}))  # Exclude the '_id' field
        return JsonResponse(persons, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

def get_claims_by_claim_id(request):
    claim_id = request.GET.get('claim_id')
    claim_date_start = request.GET.get('claim_date_start')
    claim_date_end = request.GET.get('claim_date_end')
    claim_types = request.GET.getlist('claim_type')
    min_age = request.GET.get('min_age')
    max_age = request.GET.get('max_age')
    genders = request.GET.getlist('gender')
    service_date_start = request.GET.get('service_date_start')
    service_date_end = request.GET.get('service_date_end')
    min_billed_amount = request.GET.get('min_billed_amount')
    max_billed_amount = request.GET.get('max_billed_amount')
    min_allowed_amount = request.GET.get('min_allowed_amount')
    max_allowed_amount = request.GET.get('max_allowed_amount')
    min_paid_amount = request.GET.get('min_paid_amount')
    max_paid_amount = request.GET.get('max_paid_amount')
    plan_types = request.GET.getlist('plan_type')

    query = {}
    if claim_id:
        query['claim_id'] = claim_id
    if claim_date_start and claim_date_end:
        query['claim_date'] = {"$gte": datetime.fromisoformat(claim_date_start), "$lte": datetime.fromisoformat(claim_date_end)}
    elif claim_date_start:
        query['claim_date'] = {"$gte": datetime.fromisoformat(claim_date_start)}
    elif claim_date_end:
        query['claim_date'] = {"$lte": datetime.fromisoformat(claim_date_end)}
    if claim_types:
        query['claim_type'] = {"$in": claim_types}
    if genders:
        query['gender'] = {"$in": genders}
    if service_date_start and service_date_end:
        query['service_date'] = {"$gte": datetime.fromisoformat(service_date_start), "$lte": datetime.fromisoformat(service_date_end)}
    elif service_date_start:
        query['service_date'] = {"$gte": datetime.fromisoformat(service_date_start)}
    elif service_date_end:
        query['service_date'] = {"$lte": datetime.fromisoformat(service_date_end)}
    if min_billed_amount and max_billed_amount:
        query['billed_amount'] = {"$gte": float(min_billed_amount), "$lte": float(max_billed_amount)}
    elif min_billed_amount:
        query['billed_amount'] = {"$gte": float(min_billed_amount)}
    elif max_billed_amount:
        query['billed_amount'] = {"$lte": float(max_billed_amount)}
    if min_allowed_amount and max_allowed_amount:
        query['allowed_amount'] = {"$gte": float(min_allowed_amount), "$lte": float(max_allowed_amount)}
    elif min_allowed_amount:
        query['allowed_amount'] = {"$gte": float(min_allowed_amount)}
    elif max_allowed_amount:
        query['allowed_amount'] = {"$lte": float(max_allowed_amount)}
    if min_paid_amount and max_paid_amount:
        query['paid_amount'] = {"$gte": float(min_paid_amount), "$lte": float(max_paid_amount)}
    elif min_paid_amount:
        query['paid_amount'] = {"$gte": float(min_paid_amount)}
    elif max_paid_amount:
        query['paid_amount'] = {"$lte": float(max_paid_amount)}
    if plan_types:
        query['plan_type'] = {"$in": plan_types}

    try:
        claims = list(claims_collection.find(query, {"_id": 0}))
        if min_age or max_age:
            filtered_claims = []
            for claim in claims:
                dob = datetime.fromisoformat(claim['date_of_birth'])
                age = calculate_age(dob)
                if min_age and age < int(min_age):
                    continue
                if max_age and age > int(max_age):
                    continue
                claim['age'] = age  # Add age to the response
                filtered_claims.append(claim)
            claims = filtered_claims

        return JsonResponse(claims, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

def calculate_age(born):
    today = datetime.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

def get_claims_by_claimant_id(request):
    claimant_id = request.GET.get('claimant_id')
    genders = request.GET.getlist('gender')
    marital_statuses = request.GET.getlist('marital_status')
    min_children = request.GET.get('min_children')
    max_children = request.GET.get('max_children')
    min_height = request.GET.get('min_height')
    max_height = request.GET.get('max_height')
    min_weight = request.GET.get('min_weight')
    max_weight = request.GET.get('max_weight')
    min_age = request.GET.get('min_age')
    max_age = request.GET.get('max_age')

    query = {}
    if claimant_id:
        query['claimant_id'] = claimant_id
    if genders:
        query['gender'] = {"$in": genders}
    if marital_statuses:
        query['marital_status'] = {"$in": marital_statuses}
    if min_children and max_children:
        query['number_of_children'] = {"$gte": int(min_children), "$lte": int(max_children)}
    elif min_children:
        query['number_of_children'] = {"$gte": int(min_children)}
    elif max_children:
        query['number_of_children'] = {"$lte": int(max_children)}
    if min_height and max_height:
        query['height'] = {"$gte": int(min_height), "$lte": int(max_height)}
    elif min_height:
        query['height'] = {"$gte": int(min_height)}
    elif max_height:
        query['height'] = {"$lte": int(max_height)}
    if min_weight and max_weight:
        query['weight'] = {"$gte": int(min_weight), "$lte": int(max_weight)}
    elif min_weight:
        query['weight'] = {"$gte": int(min_weight)}
    elif max_weight:
        query['weight'] = {"$lte": int(max_weight)}
    
    try:
        customers = list(customers_collection.find(query, {"_id": 0}))
        if min_age or max_age:
            filtered_customers = []
            for customer in customers:
                dob = datetime.fromisoformat(customer['date_of_birth'])
                age = calculate_age(dob)
                if min_age and age < int(min_age):
                    continue
                if max_age and age > int(max_age):
                    continue
                customer['age'] = age  # Add age to the response
                filtered_customers.append(customer)
            customers = filtered_customers
        
        return JsonResponse(customers, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

# Initialize the rule engine
engine = RuleEngine(rules)

# Custom JSON encoder to handle ObjectId and datetime
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

# Helper functions
def save_results_to_file(results, filepath):
    with open(filepath, 'w') as f:
        json.dump(results, f, cls=JSONEncoder, indent=4)

def load_results_from_file(filepath):
    with open(filepath, 'r') as f:
        return json.load(f)

def insert_results_to_db(batch_result):
    if batch_result:
        print("Inserting batch_result into DB:", batch_result)  # Debug statement
        results_collection.insert_one(batch_result)
    else:
        print("batch_result is empty, nothing to insert.")  # Debug statement

@csrf_exempt
@require_http_methods(["GET"])
def check_claim_validity(request):
    claim_ids = request.GET.getlist('claim_ids')
    filters = request.GET.dict()  # Capture all filters passed in the request

    if not claim_ids:
        return JsonResponse({"error": "claim_ids parameter is required"}, status=400)

    try:
        claims = list(claims_collection.find({"claim_id": {"$in": claim_ids}}))
        if not claims:
            return JsonResponse({"error": "No claims found for the provided IDs"}, status=404)

        # Process each claim with the rules engine
        results = []
        valid_claims = []

        for claim in claims:
            claim_result = {
                "claim_id": str(claim["claim_id"]),  # Convert ObjectId to string
                "claimant_id": claim["claimant_id"],
                "provider_id": claim["provider_id"],
                "status": "Invalid",
                "reasons": [],
                "is_fraud": None
            }

            messages = engine.evaluate(claim)
            if not messages:
                claim_result["status"] = "Valid"
                valid_claims.append(claim)
            else:
                claim_result["reasons"] = messages

            results.append(claim_result)

        # If there are valid claims, process them with the ML model
        if valid_claims:
            predictions = make_predictions(valid_claims)
            for prediction in predictions:
                for result in results:
                    if result["claim_id"] == prediction["claim_id"]:
                        result["is_fraud"] = prediction["is_fraud"]

        # Create a batch result with timestamp and filters
        batch_result = {
            "timestamp": datetime.now().isoformat(),  # Convert datetime to ISO format string
            "filters": filters,
            "results": results
        }

        # Define the path for the results JSON file
        results_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'services', 'results.json')

        # Save the batch result to a JSON file
        save_results_to_file(batch_result, results_path)

        # Load results from the JSON file (optional, can be used for verification)
        results_from_file = load_results_from_file(results_path)

        # Insert the batch result into the Results collection
        insert_results_to_db(results_from_file)

        return JsonResponse(batch_result, safe=False, status=200)
    except Exception as e:
        print("Exception occurred:", e)  # Debug statement
        return JsonResponse({"error": str(e)}, status=400)




