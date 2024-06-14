from django.contrib import admin
from django.urls import path
from creatio import views
urlpatterns = [
    path('claims/<int:claim_id>/', views.GetClaimDetails.as_view(), name='get-claim-details'),
    path('claims/<int:claim_id>/check_fraud/', views.CheckFraud.as_view(), name='check-fraud'),
     path('customers/<int:customer_id>/claims/', views.GetCustomerClaims.as_view(), name='get-customer-claims'),
     path('fraudulent_claims/', views.FraudulentClaimList.as_view(), name='fraudulent-claims'),
]
