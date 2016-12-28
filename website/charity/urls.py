from django.conf.urls import patterns, url

from charity.views.authentication import LoginView, LogoutView, RestrictedView, CharityRestrictedView, RegistrationView, \
    CharityProfileView, CharityVerificationView
from charity.views.charity_management import CharityTagsView, CharitySearchView, CharityLikeView, CharityPopularityView, \
    CharityDataProcessorView, CharityActivityView, CharityActivitySearchView, PaymentConfirmationView, CharityRatingView, \
    CharityRatingPublicView

urlpatterns = patterns(
    '',
    url(r'^charity/charity_tags/$', CharityTagsView.as_view(), name='charity_tags'),
    url(r'^charity/charity_search/$', CharitySearchView.as_view(), name='charity_search'),
    url(r'^charity/charity_like/$', CharityLikeView.as_view(), name='charity_like'),
    url(r'^charity/charity_rating/$', CharityRatingView.as_view(), name='charity_rating'),
    url(r'^charity/charity_rating_aggregates/$', CharityRatingPublicView.as_view(), name='charity_rating_aggregates'),
    url(r'^charity/popular_charities/$', CharityPopularityView.as_view(), name='popular_charity_profiles'),
    url(r'^charity/activity/$', CharityActivityView.as_view(), name='charity_activity_update'),
    url(r'^charity/get_activity/$', CharityActivitySearchView.as_view(), name='charity_activity_search'),

    # Authentication
    url(r'^auth/register/$', RegistrationView.as_view(), name='register'),
    url(r'^auth/login/$', LoginView.as_view(), name='login'),
    url(r'^auth/logout/$', LogoutView.as_view(), name='logout'),
    url(r'^auth/get_token/$', 'rest_framework_jwt.views.obtain_jwt_token'),
    url(r'^auth/authenticated/$', RestrictedView.as_view(), name='test_token'),
    url(r'^auth/charity_profile/$', CharityProfileView.as_view(), name='charity_profile'),
    url(r'^auth/charity_verification/$', CharityVerificationView.as_view(), name='charity_verification'),

    # Payment
    url(r'^charity/payment_confirmation/(?P<charity_username>.+)/$', PaymentConfirmationView.as_view(), name='payment_confirmation'),

    # For testing purpose only
    url(r'^auth/authenticated_charity/$', CharityRestrictedView.as_view(), name='test_authorisation_token'),
    url(r'^charity/update_charity_database/$', CharityDataProcessorView.as_view(), name='update_charity_database'),
)
