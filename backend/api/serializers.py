from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # Remove 'role' from the fields list
        fields = ['id', 'username', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Default new registrations from the public registration endpoint to 'Admin'
        validated_data['role'] = CustomUser.Role.ADMIN
        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class InvestigatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        # New users created by admins are always Investigators
        validated_data['role'] = CustomUser.Role.INVESTIGATOR
        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
