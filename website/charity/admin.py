from django.contrib import admin

from charity.models.charity_activity_image import CharityActivityImage
from charity.models.charity_profile import CharityProfile
from charity.models.charity_rating import CharityRating
from charity.models.user_profile import UserProfile
from charity.models.user_role import UserRole
from charity.models.charity_data import CharityData
from charity.models.charity_activity import CharityActivity

# Register your models here.
admin.site.register(UserRole)
admin.site.register(CharityProfile)
admin.site.register(UserProfile)
admin.site.register(CharityData)
admin.site.register(CharityActivity)
admin.site.register(CharityActivityImage)
admin.site.register(CharityRating)