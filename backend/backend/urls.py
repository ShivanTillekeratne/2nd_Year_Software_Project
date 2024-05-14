from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, CreateInvestigatorView  # Ensure correct import path based on your project structure
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/create_investigator/", CreateInvestigatorView.as_view(), name="create_investigator"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api-auth/", include("rest_framework.urls")),
]
