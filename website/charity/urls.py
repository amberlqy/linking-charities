from django.conf.urls import patterns, url
from charity.views.charity_management import CharityTagsView, CharitySearchView


urlpatterns = patterns(
    '',
    url(r'^api/charity_tags/$', CharityTagsView.as_view(), name='charity_tags'),
    url(r'^api/charity_search/$', CharitySearchView.as_view(), name='charity_search'),
)
