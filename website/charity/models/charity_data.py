from django.db import models


# Specifies the basic data of all charities
class CharityData(models.Model):
    regno = models.CharField(max_length=100, null=False)
    email = models.CharField(max_length=255, null=True)
    # Used for verification after the profile has been created
    token = models.CharField(max_length=255, null=True)