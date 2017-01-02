from django.db import models

from charity.models.charity_activity import CharityActivity
from charity.models.charity_profile import CharityProfile


# Stores information about payments made by users to charities
class Volunteer(models.Model):
    charity_activity = models.ForeignKey(CharityActivity, related_name='volunteers')
    date = models.IntegerField(null=True)
    forename = models.CharField(max_length=255, null=True)
    surname = models.CharField(max_length=255, null=True)
    email = models.CharField(max_length=255, null=True)
    phone = models.CharField(max_length=255, null=True)