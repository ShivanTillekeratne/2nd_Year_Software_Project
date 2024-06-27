from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, CreateInvestigatorView, CurrentUserView, CustomTokenObtainPairView, TokenVerifyView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/create_investigator/", CreateInvestigatorView.as_view(), name="create_investigator"),
    path("api/user/current_user/", CurrentUserView.as_view(), name="current_user"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),  # Add the token verify endpoint
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("mdb.urls")),
]


