from django.contrib.auth.models import User
from django.db import models
from authentication.roles import roles
from tagging.registry import register


# Specifies the role of the user.
class UserRole(models.Model):
    user = models.OneToOneField(User, related_name='role')
    name = models.CharField(max_length=100, choices=roles.choices)

    @property
    def profile(self):
        if not self.child:
            return None
        return getattr(self, self.child)

    def __eq__(self, other):
        return self.name == other.name

    def __unicode__(self):
        return self.name


# Specifies the profile of the charity
class CharityProfile(models.Model):
    user = models.OneToOneField(User, related_name='charity_profile')
    location = models.CharField(max_length=100, null=True)
    goal = models.CharField(max_length=255, null=True)
    description = models.TextField(max_length=1000, null=True)

# Register the charity profile for tagging purpose
register(CharityProfile)


# Sets the role of a specific user
def set_user_role(user, role, profile=None):
    if profile:
        try:
            UserRole.objects.get(user=user).delete()
        except UserRole.DoesNotExist:
            pass
        profile.user = user
        profile.name = role.name

    else:
        try:
            profile = UserRole.objects.get(user=user)
        except UserRole.DoesNotExist:
            profile = UserRole(user=user, name=role.name)
        else:
            profile.name = role.name

    profile.save()