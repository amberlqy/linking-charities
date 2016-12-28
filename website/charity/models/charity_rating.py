from django.contrib.auth.models import User
from django.db import models
from charity.models.charity_profile import CharityProfile


# Specifies the many-to-many "Rated By" relationship between users and charities
class CharityRating(models.Model):
    user = models.ForeignKey(User, related_name='ratings')
    charity_profile = models.ForeignKey(CharityProfile, related_name='ratings')
    rate_by_user = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)


