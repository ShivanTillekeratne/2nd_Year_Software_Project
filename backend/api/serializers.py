from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True},
            'last_login': {'read_only': True},  # Ensure last_login is read-only
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['role'] = CustomUser.Role.ADMIN  # Default new registrations to 'Admin'
        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

class InvestigatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'last_login']
        extra_kwargs = {
            'password': {'write_only': True},
            'last_login': {'read_only': True},  # Ensure last_login is read-only
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['role'] = CustomUser.Role.INVESTIGATOR  # New users created by admins are always Investigators
        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
