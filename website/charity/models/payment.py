from django.db import models
from charity.models.user_profile import UserProfile
from charity.models.charity_profile import CharityProfile


# Stores information about payments made by users to charities
class Payment(models.Model):
    user_profile = models.ManyToManyField(UserProfile, related_name='payments', null=True)
    charity_profile = models.ManyToManyField(CharityProfile, related_name='payments')
    gross = models.IntegerField()
    currency = models.CharField(max_length=10, null=True)
    txn_id = models.CharField(max_length=100, null=False)



