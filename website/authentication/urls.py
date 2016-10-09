from rest_framework_nested import routers
from authentication.views import LoginView, LogoutView, RestrictedView, CharityRestrictedView, RegistrationView
from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns(
    '',
    url(r'^api/register/$', RegistrationView.as_view(), name='register'),
    url(r'^api/login/$', LoginView.as_view(), name='login'),
    url(r'^api/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^api/get_token/$', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^api/authenticated/$', RestrictedView.as_view(), name='test_token'),
    # For testing purpose only
    url(r'^api/authenticated_charity/$', CharityRestrictedView.as_view(), name='test_authorisation_token'),
    url(r'^admin/', include(admin.site.urls)),
)
