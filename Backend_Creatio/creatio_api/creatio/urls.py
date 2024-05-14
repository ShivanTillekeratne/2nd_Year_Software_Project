from django.contrib import admin
from django.urls import path
from creatio import views
urlpatterns = [
    path('claims/<int:claim_id>/', views.GetClaimDetails.as_view(), name='get-claim-details'),
    path('claims/<int:claim_id>/check_fraud/', views.CheckFraud.as_view(), name='check-fraud'),
     path('customers/<int:customer_id>/claims/', views.GetCustomerClaims.as_view(), name='get-customer-claims'),
     path('customers/<int:customer_id>/social_network_analysis/', views.SocialNetworkAnalysis.as_view(), name='social-network-analysis'),
     path('fraudulent_claims/', views.FraudulentClaimList.as_view(), name='fraudulent-claims'),
     path('creatiosoftware/integrate/', views.CreatioIntegration.as_view(), name='creatio-integrate'),
]
