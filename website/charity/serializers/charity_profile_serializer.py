from charity.models.charity_profile import CharityProfile
from rest_framework import serializers


class CharityProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharityProfile
        fields = ('id', 'charity_name', 'location', 'goal', 'address', 'phone_number', 'description',)