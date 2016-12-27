from charity.models.charity_activity import CharityActivity
from rest_framework import serializers


class CharityActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = CharityActivity
        fields = ('id', 'name', 'description', 'date', 'image', 'uploaded_at',)