from charity.models.charity_rating import CharityRating
from rest_framework import serializers
from charity.serializers.account_serializer import AccountSerializer
from charity.serializers.charity_profile_serializer import CharityProfileSerializer


class CharityRatingSerializer(serializers.ModelSerializer):
    user = AccountSerializer(many=True)
    charity_profile = CharityProfileSerializer

    class Meta:
        model = CharityRating
        fields = ('id', 'account', 'charity_profile', 'rate_by_user', 'created_at')