import os

from rest_framework import status, permissions
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.http.response import HttpResponse
from django.template import loader
from django.db import models
import json

from assets import settings
from charity.models.charity_profile import CharityProfile
from charity.roles import roles
from tagging.models import Tag, TaggedItem

from charity.utilities.zip_to_csv_converter import import_zip

from charity.serializers.charity_profile_serializer import CharityProfileSerializer


# Returns the default home page
class IndexView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request):
        template = loader.get_template('charity/index.html')

        return HttpResponse(template.render())


class CharityTagsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    # Adds tags to the profile of a charity. The 'tags' parameter has so be a string with words seperated by commans/spaces.
    def post(self, request, format=None):

        # Check the user's role
        user = request.user
        if user.role != roles.charity:
            response_data = json.dumps({"authorised": False})
            return HttpResponse(response_data, content_type='application/json')

        # Read required parameters
        data = request.data
        tags = data.get('tags', None)
        Tag.objects.update_tags(user.charity_profile, tags)

        return Response({'success': True}, status=status.HTTP_201_CREATED)


class CharitySearchView(APIView):
    permission_classes = (permissions.AllowAny,)

    # Search for charities based on an ID or tags
    def get(self, request, format=None):

        # If the request contains a single ID, return only one charity profile.
        charity_id = request.GET.get('id', None)
        if charity_id:
            charity_profile = CharityProfile.objects.get(id=charity_id)

            charity_profile_serializer = CharityProfileSerializer(charity_profile)
            return_dictionary = {"charity_profile": charity_profile_serializer.data}
            json_charity_profiles = JSONRenderer().render(return_dictionary)

            return HttpResponse(json_charity_profiles, content_type='application/json')

        # If the request contains a "name" parameter with "all", return all charity names.
        charity_name = request.GET.get('name', None)
        if charity_name == "all":
            charity_names = CharityProfile.objects.values_list('charity_name', flat=True)
            return_dictionary = {"charity_names": charity_names}
            json_charity_names = JSONRenderer().render(return_dictionary)

            return HttpResponse(json_charity_names, content_type='application/json')

        # If the request contains a set of tags (separated  by whitespace), return all charity profiles with a match.
        tags = request.GET.get('tags', None)

        # Search for all relevant charities
        charity_profiles = list(TaggedItem.objects.get_union_by_model(CharityProfile, tags))

        charity_profile_serializer = CharityProfileSerializer(charity_profiles, many=True)
        return_dictionary = {"charity_profiles": charity_profile_serializer.data}
        json_charity_profiles = JSONRenderer().render(return_dictionary)

        return HttpResponse(json_charity_profiles, content_type='application/json')


class CharityLikeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    # Search for charities based on tags
    def post(self, request, format=None):

        user = request.user
        if user.role == roles.charity:
            response_data = json.dumps({"error": "You are not authorised to like a charity. "})
            return HttpResponse(response_data, content_type='application/json')

        # Read required parameters
        data = request.data
        charity_profile_id = data.get('id', None)

        charity_profile = CharityProfile.objects.get(id=charity_profile_id)
        charity_profile.likes.add(user.user_profile)

        return Response({'success': True}, status=status.HTTP_201_CREATED)


# Responsible for returning data related to the popularity of charities
class CharityPopularityView(APIView):
    permission_classes = (permissions.AllowAny,)

    # Get the 5 most popular charities
    def get(self, request):

        top_charity_profiles = CharityProfile.objects.annotate(likes_count=models.Count('likes')).order_by('-likes_count')[:5]

        charity_profile_serializer = CharityProfileSerializer(top_charity_profiles, many=True)
        return_dictionary = {"charity_profiles": charity_profile_serializer.data}
        json_charity_profiles = JSONRenderer().render(return_dictionary)

        return HttpResponse(json_charity_profiles, content_type='application/json')


# Responsible for saving and processing charity related data
class CharityDataProcessorView(APIView):
    permission_classes = (permissions.AllowAny,)

    # Get the 5 most popular charities
    def get(self, request):

        zip_file = os.path.join(settings.MEDIA_ROOT, 'charity\\data\\zip\\RegPlusExtract_September_2016.zip')
        new_path = os.path.join(settings.MEDIA_ROOT, 'charity\\data\\csv')

        import_zip(zip_file=zip_file, output_folder_name=new_path)


        return Response({'success': True}, status=status.HTTP_201_CREATED)
