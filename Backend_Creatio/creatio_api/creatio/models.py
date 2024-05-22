from django.db import models

class Claim(models.Model):
    customer_id = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')
    date_created = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Claim ID: {self.id}, Customer ID: {self.customer_id}, Amount: {self.amount}, Status: {self.status}"
    

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_registered = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class FraudulentClaim(models.Model):
    claim_id = models.IntegerField(unique=True)
    description = models.TextField()
    date_detected = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Fraudulent Claim ID: {self.claim_id}"
    
