from django.db import models

from charity.models.charity_profile import CharityProfile


# Specifies an activity (event) organised by a charity
class CharityActivity(models.Model):
    charity_profile = models.ForeignKey(CharityProfile, related_name='activities')
    name = models.CharField(max_length=100, null=False)
    description = models.CharField(max_length=255, null=True)
    date = models.CharField(max_length=10, null=True)
    image = models.FileField(upload_to='charity/activity_images/', null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)