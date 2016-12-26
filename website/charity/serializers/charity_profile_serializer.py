from charity.models.charity_profile import CharityProfile
from rest_framework import serializers


class CharityProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharityProfile
        fields = ('id', 'charity_name', 'goal', 'address', 'phone_number', 'country', 'city', 'postcode', 'email',
                  'description', 'verified', 'paypal_email', 'paypal_identity_token')