from django.contrib import admin
from authentication.models import UserRole, CharityProfile

# Register your models here.
admin.site.register(UserRole)
admin.site.register(CharityProfile)
