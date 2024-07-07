from datetime import datetime

claim_types = ['Medical', 'Dental', 'Vision', 'Pharmacy', 'Behavioral Health']
plan_types = ['HMO', 'PPO', 'EPO', 'POS', 'HDHP']

def parse_date(date):
    if isinstance(date, datetime):
        return date
    return datetime.strptime(date, '%Y-%m-%dT%H:%M:%S')

# Define rule conditions and actions
rules = [
    # Check if claim date is not in the future
    {
        "condition": lambda item: parse_date(item['claim_date']) <= datetime.now(),
        "action": lambda item: item.update({'valid': True}),
        "failure_message": "Claim date is in the future."
    },
    # Check if service date is not after claim date
    {
        "condition": lambda item: parse_date(item['service_date']) <= parse_date(item['claim_date']),
        "action": lambda item: item.update({'valid': True}),
        "failure_message": "Service date is after claim date."
    },
    # Check if service date is not before date of birth
    {
        "condition": lambda item: (parse_date(item['service_date']) - parse_date(item['date_of_birth'])).days > 0,
        "action": lambda item: item.update({'valid': True}),
        "failure_message": "Service date is before date of birth."
    },
    # Check if plan type is valid
    {
        "condition": lambda item: item['plan_type'] in plan_types,
        "action": lambda item: item.update({'covered': True}),
        "failure_message": "Plan type is not valid."
    },
    # Check if claim type is valid
    {
        "condition": lambda item: item['claim_type'] in claim_types,
        "action": lambda item: item.update({'claim_valid': True}),
        "failure_message": "Claim type is not valid."
    },
    # Check if billed amount does not exceed 1.5 times allowed amount
    {
        "condition": lambda item: item['billed_amount'] <= 1.8 * item['allowed_amount'],
        "action": lambda item: item.update({'financially_valid': True}),
        "failure_message": "Billed amount exceeds 1.8 times allowed amount."
    },
    # Check if paid amount does not exceed allowed amount
    {
        "condition": lambda item: item['paid_amount'] <= item['allowed_amount'],
        "action": lambda item: item.update({'payment_valid': True}),
        "failure_message": "Paid amount exceeds allowed amount."
    }
]

class RuleEngine:
    def __init__(self, rules):
        self.rules = rules

    def evaluate(self, item):
        results = []
        for rule in self.rules:
            condition = rule['condition']
            action = rule['action']
            failure_message = rule['failure_message']
            if condition(item):
                action(item)
            else:
                results.append(failure_message)
        return results

