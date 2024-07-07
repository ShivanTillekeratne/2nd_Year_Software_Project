from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
    # path("add/", views.add_person),
    path("show/", views.get_all),
    path("claims_claimantid/", views.get_claims_by_claimant_id),
    path("claims_claimid/", views.get_claims_by_claim_id),
    path("check_claim_validity/", views.check_claim_validity),
    path("get_latest_result/", views.get_latest_result),
    path("save_final_results/", views.save_final_results),
    path("fetch_summary_data/", views.fetch_summary_data),
    path("monthly_claims_trend/", views.monthly_claims_trend),
    path("reversed_claims_over_time/", views.reversed_claims_over_time),
    path("claims_by_type/", views.claims_by_type),
    path("claims_by_age_group/", views.claims_by_age_group)
]
