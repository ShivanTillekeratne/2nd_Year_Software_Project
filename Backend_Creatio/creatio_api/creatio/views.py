from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
    
from rest_framework.views import APIView
from rest_framework import status
from .models import Claim, Customer, FraudulentClaim
from .serializers import ClaimSerializer, FraudCheckSerializer, CustomerSerializer, SocialNetworkAnalysisSerializer, FraudulentClaimSerializer
import facebook

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

class SocialNetworkAnalysis(APIView):
    def get(self, request, customer_id):
        try:
            customer = Customer.objects.get(id=customer_id)
            # Perform social network analysis using Facebook API
            # This is just an example, need to replace it with actual Facebook API integration code
            graph = facebook.GraphAPI(access_token='YOUR_FACEBOOK_ACCESS_TOKEN', version='2.12')
            insights = graph.get_object(id='me', fields='id,name,insights.metric(post_impressions,period(lifetime))')
            analysis_results = {'data': 'Sample analysis results'}
            
            serializer = SocialNetworkAnalysisSerializer(data={'insights': insights, 'analysis_results': analysis_results})
            if serializer.is_valid():
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        
class FraudulentClaimList(APIView):
    def get(self, request):
        fraudulent_claims = FraudulentClaim.objects.all()
        serializer = FraudulentClaimSerializer(fraudulent_claims, many=True)
        return Response(serializer.data)
    
class CreatioIntegration(APIView):
    def post(self, request):
        # Process the request body and perform integration with Creatio
        request_data = request.data
        # Example integration logic
        if 'data' in request_data:
            # Process data and integrate with Creatio
            return Response({'message': 'Integration successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Data format not valid'}, status=status.HTTP_400_BAD_REQUEST)