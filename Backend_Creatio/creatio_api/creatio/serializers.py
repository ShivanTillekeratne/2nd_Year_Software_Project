# serializers.py
from rest_framework import serializers
from .models import Claim, Customer, FraudulentClaim

class ClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = Claim
        fields = '__all__'

class FraudCheckSerializer(serializers.Serializer):
    additional_data = serializers.CharField(required=False)

class CustomerSerializer(serializers.ModelSerializer):
    claims = ClaimSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'name', 'email', 'claims']


class SocialNetworkAnalysisSerializer(serializers.Serializer):
    insights = serializers.JSONField()
    analysis_results = serializers.JSONField()

class FraudulentClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = FraudulentClaim
        fields = '__all__'