from charity.models.charity_activity_image import CharityActivityImage
from rest_framework import serializers


class CharityActivityImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = CharityActivityImage
        fields = ('id', 'image', 'created_at')