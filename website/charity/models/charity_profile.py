import uuid

from django.contrib.auth.models import User
from django.db import models
from tagging.registry import register
from charity.models.user_profile import UserProfile


# Gives a unique name to each file
def content_file_name(instance, filename):
    return 'charity/profile_images/' + str(uuid.uuid4()) + str(instance.id) + filename


# Specifies the profile of the charity
class CharityProfile(models.Model):
    likes = models.ManyToManyField(UserProfile, related_name='likes')
    user = models.OneToOneField(User, related_name='charity_profile')
    charity_name = models.CharField(max_length=100, null=True)
    goal = models.CharField(max_length=255, null=True)
    address = models.CharField(max_length=255, null=True)
    city = models.CharField(max_length=255, null=True)
    country = models.CharField(max_length=255, null=True)
    postcode = models.CharField(max_length=255, null=True)
    phone_number = models.CharField(max_length=255, null=True)
    email = models.CharField(max_length=255, null=True)
    description = models.TextField(max_length=1000, null=True)

    verified = models.BooleanField(default=False)

    paypal_email = models.CharField(max_length=255, null=True)
    paypal_identity_token = models.CharField(max_length=255, null=True)

    profile_image = models.FileField(upload_to=content_file_name, null=True)

    website = models.CharField(max_length=255, null=True)

# Register the charity profile for tagging purpose
register(CharityProfile)


