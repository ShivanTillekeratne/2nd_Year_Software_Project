from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
from .models import person_collection, claims_collection, customers_collection, results_collection
import json
from bson import ObjectId
from datetime import datetime
from bson.json_util import dumps, loads
from .services.ml_model import make_predictions
from .services.rules_engine import RuleEngine, rules
import os
from datetime import datetime, timedelta
from dateutil.parser import parse as parse_date
import logging

def index(request):
    return HttpResponse("<h1>App is Running</h1>")

# Custom JSON encoder to handle ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)
    
@csrf_exempt
@require_http_methods(["POST"])
def save_final_results(request):
    try:
        final_results = json.loads(request.body)
        batch_result = {
            "timestamp": datetime.now().isoformat(),  # Add timestamp
            "results": final_results
        }
        results_collection.insert_one(batch_result)
        return JsonResponse({"message": "Results saved successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_latest_result(_request):
    try:
        latest_results = list(results_collection.find().sort("timestamp", -1).limit(10))  # Fetch the latest 10 results
        if latest_results:
            json_results = json.loads(dumps(latest_results, cls=JSONEncoder))  # Convert BSON to JSON with custom encoder
            return JsonResponse(json_results, safe=False, status=200)
        else:
            return JsonResponse({"error": "No results found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_all(request):
    try:
        persons = list(person_collection.find({}, {"_id": 0}))  # Exclude the '_id' field
        return JsonResponse(persons, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


logging.basicConfig(level=logging.INFO)

def parse_iso_datetime(date_str):
    if isinstance(date_str, datetime):
        return date_str  # If it's already a datetime object, return it
    if not isinstance(date_str, str):
        raise ValueError("parse_iso_datetime() argument must be a str or datetime object")  # Ensure the input is a string
    # Remove milliseconds and 'Z'
    if date_str.endswith('Z'):
        date_str = date_str[:-1]
    if '.' in date_str:
        date_str = date_str.split('.')[0]
    return datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S')

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
        parsed_claim_date_start = parse_iso_datetime(claim_date_start)
        parsed_claim_date_end = parse_iso_datetime(claim_date_end)
        logging.info(f"Parsed claim_date_start: {parsed_claim_date_start}, claim_date_end: {parsed_claim_date_end}")
        query['claim_date'] = {"$gte": parsed_claim_date_start, "$lte": parsed_claim_date_end}
    elif claim_date_start:
        parsed_claim_date_start = parse_iso_datetime(claim_date_start)
        logging.info(f"Parsed claim_date_start: {parsed_claim_date_start}")
        query['claim_date'] = {"$gte": parsed_claim_date_start}
    elif claim_date_end:
        parsed_claim_date_end = parse_iso_datetime(claim_date_end)
        logging.info(f"Parsed claim_date_end: {parsed_claim_date_end}")
        query['claim_date'] = {"$lte": parsed_claim_date_end}
    if claim_types:
        query['claim_type'] = {"$in": claim_types}
    if genders:
        query['gender'] = {"$in": genders}
    if service_date_start and service_date_end:
        parsed_service_date_start = parse_iso_datetime(service_date_start)
        parsed_service_date_end = parse_iso_datetime(service_date_end)
        logging.info(f"Parsed service_date_start: {parsed_service_date_start}, service_date_end: {parsed_service_date_end}")
        query['service_date'] = {"$gte": parsed_service_date_start, "$lte": parsed_service_date_end}
    elif service_date_start:
        parsed_service_date_start = parse_iso_datetime(service_date_start)
        logging.info(f"Parsed service_date_start: {parsed_service_date_start}")
        query['service_date'] = {"$gte": parsed_service_date_start}
    elif service_date_end:
        parsed_service_date_end = parse_iso_datetime(service_date_end)
        logging.info(f"Parsed service_date_end: {parsed_service_date_end}")
        query['service_date'] = {"$lte": parsed_service_date_end}
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

    logging.info(f"Constructed query: {query}")

    try:
        claims = list(claims_collection.find(query, {"_id": 0}))
        logging.info(f"Number of claims found: {len(claims)}")
        if min_age or max_age:
            filtered_claims = []
            for claim in claims:
                dob = claim['date_of_birth']
                if isinstance(dob, str):
                    dob = datetime.fromisoformat(dob)
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
        logging.error(f"Error occurred: {str(e)}")
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
                "is_fraud": None,
                "probability": None,  # Add probability
                "is_reversed": False  # Default to False
            }

            # Ensure the dates in claim are strings before processing
            if 'claim_date' in claim and isinstance(claim['claim_date'], datetime):
                claim['claim_date'] = claim['claim_date'].strftime('%Y-%m-%dT%H:%M:%S')
            if 'service_date' in claim and isinstance(claim['service_date'], datetime):
                claim['service_date'] = claim['service_date'].strftime('%Y-%m-%dT%H:%M:%S')
            if 'date_of_birth' in claim and isinstance(claim['date_of_birth'], datetime):
                claim['date_of_birth'] = claim['date_of_birth'].strftime('%Y-%m-%dT%H:%M:%S')

            reasons = engine.evaluate(claim)
            
            if not reasons:
                claim_result["status"] = "Valid"
                valid_claims.append(claim)
            else:
                claim_result["reasons"] = reasons

            results.append(claim_result)

        # If there are valid claims, process them with the ML model
        if valid_claims:
            predictions = make_predictions(valid_claims)
            for prediction in predictions:
                for result in results:
                    if result["claim_id"] == prediction["claim_id"]:
                        result["is_fraud"] = prediction["is_fraud"]
                        result["probability"] = prediction["probability"]

        return JsonResponse({"results": results}, safe=False, status=200)
    except Exception as e:
        print("Exception occurred:", e)  # Debug statement
        return JsonResponse({"error": str(e)}, status=400)




@csrf_exempt
@require_http_methods(["GET"])
def fetch_summary_data(request):
    try:
        time_period = request.GET.get('time_period', 'all')

        # Determine the time range for filtering
        end_time = datetime.now()
        if time_period == 'hourly':
            start_time = end_time - timedelta(hours=1)
        elif time_period == 'daily':
            start_time = end_time - timedelta(days=1)
        elif time_period == 'weekly':
            start_time = end_time - timedelta(weeks=1)
        elif time_period == 'monthly':
            start_time = end_time - timedelta(days=30)
        else:
            start_time = None

        # Log the time range being used for filtering
        print(f"Time period: {time_period}")
        if start_time:
            print(f"Filtering from {start_time} to {end_time}")
        else:
            print("No time filtering applied")

        # Adjust the time filtering to match the ISO date format used in the database
        match_stage = {}
        if start_time:
            start_time_iso = start_time.isoformat()
            end_time_iso = end_time.isoformat()
            match_stage["timestamp"] = {"$gte": start_time_iso, "$lte": end_time_iso}

        print(f"Match stage: {match_stage}")

        # Fetch documents to see what matches
        matched_documents = list(results_collection.find(match_stage))
        print(f"Matched documents: {len(matched_documents)}")
        for doc in matched_documents:
            print(doc)

        # Total analyzed claims in the Results collection
        total_analyzed_claims = results_collection.aggregate([
            {"$match": match_stage},
            {"$unwind": "$results"},
            {"$group": {"_id": None, "count": {"$sum": 1}}}
        ])
        total_analyzed_claims_count = next(total_analyzed_claims, {"count": 0})["count"]
        print(f"Total analyzed claims count: {total_analyzed_claims_count}")

        # Approved claims
        approved_claims = results_collection.aggregate([
            {"$match": match_stage},
            {"$unwind": "$results"},
            {"$match": {
                "$or": [
                    {"results.status": "Valid", "results.is_fraud": False, "results.is_reversed": False},
                    {"results.is_reversed": True}
                ]
            }},
            {"$group": {"_id": None, "count": {"$sum": 1}}}
        ])
        approved_claims_count = next(approved_claims, {"count": 0})["count"]
        print(f"Approved claims count: {approved_claims_count}")

        # Rejected claims by rules engine (status = "Invalid")
        rejected_by_rules = results_collection.aggregate([
            {"$match": match_stage},
            {"$unwind": "$results"},
            {"$match": {"results.status": "Invalid"}},
            {"$group": {"_id": None, "count": {"$sum": 1}}}
        ])
        rejected_by_rules_count = next(rejected_by_rules, {"count": 0})["count"]
        print(f"Rejected by rules count: {rejected_by_rules_count}")

        # Rejected claims by ML model (is_fraud = True)
        rejected_by_ml = results_collection.aggregate([
            {"$match": match_stage},
            {"$unwind": "$results"},
            {"$match": {"results.is_fraud": True}},
            {"$group": {"_id": None, "count": {"$sum": 1}}}
        ])
        rejected_by_ml_count = next(rejected_by_ml, {"count": 0})["count"]
        print(f"Rejected by ML count: {rejected_by_ml_count}")

        # Reversed claims (is_reversed = True)
        reversed_claims = results_collection.aggregate([
            {"$match": match_stage},
            {"$unwind": "$results"},
            {"$match": {"results.is_reversed": True}},
            {"$group": {"_id": None, "count": {"$sum": 1}}}
        ])
        reversed_claims_count = next(reversed_claims, {"count": 0})["count"]
        print(f"Reversed claims count: {reversed_claims_count}")

        # Claims by type
        claims_by_type = results_collection.aggregate([
            {"$match": match_stage},
            {"$unwind": "$results"},
            {"$group": {"_id": "$results.claim_type", "count": {"$sum": 1}}}
        ])
        claims_by_type_data = {claim_type['_id']: claim_type['count'] for claim_type in claims_by_type}
        print(f"Claims by type: {claims_by_type_data}")

        # Claims by age group
        claims_by_age_group = results_collection.aggregate([
            {"$match": match_stage},
            {"$unwind": "$results"},
            {"$lookup": {
                "from": "claimants",
                "localField": "results.claimant_id",
                "foreignField": "claimant_id",
                "as": "claimant_info"
            }},
            {"$unwind": "$claimant_info"},
            {"$addFields": {
                "age": {"$subtract": [
                    {"$year": "$$NOW"},
                    {"$year": "$claimant_info.date_of_birth"}
                ]}
            }},
            {"$bucket": {
                "groupBy": "$age",
                "boundaries": [0, 18, 30, 45, 60, 75, 100],
                "default": "Other",
                "output": {"count": {"$sum": 1}}
            }}
        ])
        claims_by_age_group_data = {f"{bucket['_id']}-{bucket['_id'] + 17}": bucket['count'] for bucket in claims_by_age_group}
        print(f"Claims by age group: {claims_by_age_group_data}")

        summary_data = {
            "total_analyzed_claims": total_analyzed_claims_count,
            "approved_claims": approved_claims_count,
            "rejected_by_rules": rejected_by_rules_count,
            "rejected_by_ml": rejected_by_ml_count,
            "reversed_claims": reversed_claims_count,
            "claims_by_type": claims_by_type_data,
            "claims_by_age_group": claims_by_age_group_data
        }

        # Total claims in the Claims collection
        total_claims_count = claims_collection.count_documents({})
        summary_data["total_claims"] = total_claims_count

        return JsonResponse(summary_data, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
@require_http_methods(["GET"])
def monthly_claims_trend(request):
    try:
        # Group by month and year, count the number of claims for each month
        monthly_trend = results_collection.aggregate([
            {"$unwind": "$results"},
            {"$addFields": {
                "timestamp_date": {"$dateFromString": {"dateString": "$timestamp"}}
            }},
            {"$group": {
                "_id": {
                    "year": {"$year": "$timestamp_date"},
                    "month": {"$month": "$timestamp_date"},
                    "day": {"$dayOfMonth": "$timestamp_date"}
                },
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1}}
        ])
        trend_data = [{"year": item["_id"]["year"], "month": item["_id"]["month"], "day": item["_id"]["day"], "count": item["count"]} for item in monthly_trend]

        return JsonResponse(trend_data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



@csrf_exempt
@require_http_methods(["GET"])
def reversed_claims_over_time(request):
    try:
        # Group by day, month and year, count the number of reversed claims for each day
        reversed_trend = results_collection.aggregate([
            {"$unwind": "$results"},
            {"$match": {"results.is_reversed": True}},
            {"$addFields": {
                "timestamp_date": {"$dateFromString": {"dateString": "$timestamp"}}
            }},
            {"$group": {
                "_id": {
                    "year": {"$year": "$timestamp_date"},
                    "month": {"$month": "$timestamp_date"},
                    "day": {"$dayOfMonth": "$timestamp_date"}
                },
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id.year": 1, "_id.month": 1, "_id.day": 1}}
        ])
        reversed_data = [{"year": item["_id"]["year"], "month": item["_id"]["month"], "day": item["_id"]["day"], "count": item["count"]} for item in reversed_trend]

        return JsonResponse(reversed_data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



@csrf_exempt
@require_http_methods(["GET"])
def claims_by_type(request):
    try:
        # Group by claim type and count the number of claims for each type
        type_distribution = results_collection.aggregate([
            {"$unwind": "$results"},
            {"$match": {"results.claim_type": {"$exists": True, "$ne": None}}},
            {"$group": {
                "_id": "$results.claim_type",
                "count": {"$sum": 1}
            }}
        ])
        type_data = [{"claim_type": item["_id"], "count": item["count"]} for item in type_distribution]

        return JsonResponse(type_data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)





@csrf_exempt
@require_http_methods(["GET"])
def claims_by_age_group(request):
    def calculate_age(born):
        today = datetime.today()
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

    try:
        age_distribution = results_collection.aggregate([
            {"$unwind": "$results"},
            {"$lookup": {
                "from": "claimants",
                "localField": "results.claimant_id",
                "foreignField": "claimant_id",
                "as": "claimant_info"
            }},
            {"$unwind": "$claimant_info"},
            {"$addFields": {
                "age": {
                    "$subtract": [
                        {"$year": "$$NOW"},
                        {"$year": {"$dateFromString": {"dateString": "$claimant_info.date_of_birth", "format": "%Y-%m-%dT%H:%M:%S.%LZ"}}}
                    ]
                }
            }},
            {"$bucket": {
                "groupBy": "$age",
                "boundaries": [0, 18, 30, 45, 60, 75, 100],
                "default": "Other",
                "output": {"count": {"$sum": 1}}
            }}
        ])

        age_group_data = [{"age_group": f"{bucket['_id']['min']}-{bucket['_id']['max']}", "count": bucket['count']} for bucket in age_distribution if '_id' in bucket]

        return JsonResponse(age_group_data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)






