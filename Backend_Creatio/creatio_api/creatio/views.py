from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
    
from rest_framework.views import APIView
from rest_framework import status
from .models import Claim, Customer, FraudulentClaim
from .serializers import ClaimSerializer, FraudCheckSerializer, CustomerSerializer,  FraudulentClaimSerializer

class GetClaimDetails(APIView):
    def get(self, request, claim_id):
        try:
            claim = Claim.objects.get(id=claim_id)
            serializer = ClaimSerializer(claim)
            return Response(serializer.data)
        except Claim.DoesNotExist:
            return Response({'error': 'Claim not found'}, status=status.HTTP_404_NOT_FOUND)

class CheckFraud(APIView):
    def post(self, request, claim_id):
        serializer = FraudCheckSerializer(data=request.data)
        if serializer.is_valid():
            additional_data = serializer.validated_data.get('additional_data', '')
            # Perform fraud check logic here using ML model and rules engine
            # Example response indicating fraud status
            fraud_status = {
                'claim_id': claim_id,
                'fraudulent': False,
                'details': 'Fraud check successful. Claim is not fraudulent.',
                'additional_data': additional_data
            }
            return Response(fraud_status)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class GetCustomerClaims(APIView):
    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(id=customer_id)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

        
class FraudulentClaimList(APIView):
    def get(self, request):
        fraudulent_claims = FraudulentClaim.objects.all()
        serializer = FraudulentClaimSerializer(fraudulent_claims, many=True)
        return Response(serializer.data)
    
