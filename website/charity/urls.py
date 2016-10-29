from django.conf.urls import patterns, url
from charity.views.charity_management import CharityTagsView, CharitySearchView, CharityLikeView, CharityPopularityView
from charity.views.authentication import LoginView, LogoutView, RestrictedView, CharityRestrictedView, RegistrationView, CharityProfileView


urlpatterns = patterns(
    '',
    url(r'^charity/charity_tags/$', CharityTagsView.as_view(), name='charity_tags'),
    url(r'^charity/charity_search/$', CharitySearchView.as_view(), name='charity_search'),
    url(r'^charity/charity_like/$', CharityLikeView.as_view(), name='charity_like'),
    url(r'^charity/popular_charities/$', CharityPopularityView.as_view(), name='popular_charity_profiles'),

    # Authentication
    url(r'^auth/register/$', RegistrationView.as_view(), name='register'),
    url(r'^auth/login/$', LoginView.as_view(), name='login'),
    url(r'^auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^auth/get_token/$', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^auth/authenticated/$', RestrictedView.as_view(), name='test_token'),
    url(r'^auth/charity_profile/$', CharityProfileView.as_view(), name='charity_profile'),
    # For testing purpose only
    url(r'^auth/authenticated_charity/$', CharityRestrictedView.as_view(), name='test_authorisation_token'),
)
