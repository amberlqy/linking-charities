from charity.models.charity_activity import CharityActivity
from rest_framework import serializers


class CharityActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = CharityActivity
        fields = ('id', 'name', 'description', 'start_time', 'end_time', 'image', 'uploaded_at',)