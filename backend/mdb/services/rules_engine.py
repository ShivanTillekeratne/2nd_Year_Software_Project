from datetime import datetime
from pymongo import MongoClient

# Rule definitions
rules = [
    {
        "condition": "datetime.strptime(item['claim_date'], '%Y-%m-%dT%H:%M:%S') <= datetime.now()",
        "action": "item['valid'] = True",
        "failure_message": "Claim date {item[claim_date]} is in the future."
    },
    {
        "condition": "datetime.strptime(item['service_date'], '%Y-%m-%dT%H:%M:%S') <= datetime.strptime(item['claim_date'], '%Y-%m-%dT%H:%M:%S')",
        "action": "item['valid'] = True",
        "failure_message": "Service date {item[service_date]} is after claim date {item[claim_date]}."
    },
    {
        "condition": "(datetime.strptime(item['service_date'], '%Y-%m-%dT%H:%M:%S') - datetime.strptime(item['date_of_birth'], '%Y-%m-%dT%H:%M:%S')).days > 0",
        "action": "item['valid'] = True",
        "failure_message": "Service date {item[service_date]} is before date of birth {item[date_of_birth]}."
    },
    {
        "condition": "item['plan_type'] in plan_types",
        "action": "item['covered'] = True",
        "failure_message": "Plan type {item[plan_type]} is not valid."
    },
    {
        "condition": "item['claim_type'] in claim_types",
        "action": "item['claim_valid'] = True",
        "failure_message": "Claim type {item[claim_type]} is not valid."
    },
    {
        "condition": "item['billed_amount'] <= 1.5 * item['allowed_amount']",
        "action": "item['financially_valid'] = True",
        "failure_message": "Billed amount {item[billed_amount]} exceeds 1.5 times allowed amount {item[allowed_amount]}."
    },
    {
        "condition": "item['paid_amount'] <= item['allowed_amount']",
        "action": "item['payment_valid'] = True",
        "failure_message": "Paid amount {item[paid_amount]} exceeds allowed amount {item[allowed_amount]}."
    }
]

claim_types = ['Medical', 'Dental', 'Vision', 'Pharmacy', 'Behavioral Health']
plan_types = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP']

class RuleEngine:
    def __init__(self, rules):
        self.rules = rules

    def evaluate(self, item):
        messages = []
        for rule in self.rules:
            condition = rule['condition']
            action = rule['action']
            failure_message = rule['failure_message']
            if eval(condition, {}, {'item': item, 'datetime': datetime, 'plan_types': plan_types, 'claim_types': claim_types}):
                exec(action, {}, {'item': item})
            else:
                messages.append(failure_message.format(item=item))
        return messages
