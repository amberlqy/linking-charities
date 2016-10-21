from django.contrib.auth.models import User
from django.db import models


# Specifies the profile of the charity
class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='user_profile')
    introduction = models.TextField(max_length=1000, null=True)