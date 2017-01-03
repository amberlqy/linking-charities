from charity.models.charity_activity import CharityActivity
from rest_framework import serializers

from charity.serializers.charity_activity_image_serializer import CharityActivityImageSerializer


class CharityActivitySerializer(serializers.ModelSerializer):
    images = CharityActivityImageSerializer(many=True)
    volunteer_count = serializers.IntegerField(
        source='volunteers.count',
        read_only=True
    )

    class Meta:
        model = CharityActivity
        fields = ('id', 'name', 'description', 'date', 'images', 'spending', 'uploaded_at', 'volunteers', 'volunteer_count')