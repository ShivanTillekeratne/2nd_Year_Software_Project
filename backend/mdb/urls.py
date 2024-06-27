from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
    # path("add/", views.add_person),
    path("show/", views.get_all),
    path("claims_claimantid/", views.get_claims_by_claimant_id),
    path("claims_claimid/", views.get_claims_by_claim_id),
    path("check_claim_validity/", views.check_claim_validity),
    path("get_all_results/", views.get_all_results)
]
