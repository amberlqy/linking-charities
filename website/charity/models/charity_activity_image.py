from django.db import models
from charity.models.charity_activity import CharityActivity
import uuid


# Gives a unique name to each file
def content_file_name(instance, filename):
    return 'charity/activity_images/'.join([uuid.uuid4(), instance.charity_activity.id, filename])


# Specifies the one-to-many "Images" relation of a charity activity.
class CharityActivityImage(models.Model):
    charity_activity = models.ForeignKey(CharityActivity, related_name='images')
    image = models.FileField(upload_to=content_file_name, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


