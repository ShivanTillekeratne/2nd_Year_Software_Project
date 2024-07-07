from django.shortcuts import render
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer, InvestigatorSerializer
from .models import CustomUser
from .permissions import IsRoleAdmin
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class CreateInvestigatorView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = InvestigatorSerializer
    permission_classes = [permissions.IsAuthenticated, IsRoleAdmin]

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = CustomUser.objects.get(username=request.data['username'])
        user.last_login = timezone.now()
        user.save()
        return response

class TokenVerifyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"detail": "Token is valid"}, status=status.HTTP_200_OK)
