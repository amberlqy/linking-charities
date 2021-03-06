from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static

from charity.views.charity_management import IndexView

urlpatterns = patterns(
    '',
    url(r'^api/', include('charity.urls')),
    url(r'^admin/', include(admin.site.urls)),
    # url(r'/', custom_404),
    url(r'^silk/', include('silk.urls', namespace='silk')),
    (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT}),
    url('^.*$', IndexView.as_view(), name='index')
)

# Silk Profiler


# development static media server
if settings.DEBUG:
    urlpatterns += patterns(
        'django.views.static',
        (r'media/(?P<path>.*)',
        'serve',
        {'document_root': settings.MEDIA_ROOT}), )