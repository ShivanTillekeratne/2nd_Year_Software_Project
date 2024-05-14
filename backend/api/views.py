from django.shortcuts import render
from rest_framework import generics
from rest_framework import permissions  # Add this line at the top of your views.py
from .serializers import UserSerializer, InvestigatorSerializer
from .models import CustomUser
from .permissions import IsRoleAdmin  # Import the custom permission class

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    # Use the custom role-based permission
    permission_classes = [permissions.AllowAny]

class CreateInvestigatorView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = InvestigatorSerializer
    # Use the custom role-based permission
    permission_classes = [permissions.IsAuthenticated, IsRoleAdmin]
