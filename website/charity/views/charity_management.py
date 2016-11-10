import csv
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
from urllib.request import urlopen
import dateutil.parser
from django.utils import timezone
from django.utils.http import urlencode

from assets import settings
from charity.models.charity_activity import CharityActivity
from charity.models.charity_data import CharityData
from charity.models.charity_profile import CharityProfile
from charity.roles import roles
from tagging.models import Tag, TaggedItem

from charity.serializers.charity_activity_serializer import CharityActivitySerializer
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
    def get(self, request):

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

        # If the request contains an "all" parameter with "True", return all charity profiles.
        return_all = request.GET.get('all', None)
        if return_all:
            charity_profiles = CharityProfile.objects.all()
            charity_profile_serializer = CharityProfileSerializer(charity_profiles, many=True)
            return_dictionary = {"charity_profiles": charity_profile_serializer.data}
            json_charity_profiles = JSONRenderer().render(return_dictionary)

            return HttpResponse(json_charity_profiles, content_type='application/json')

        # If the request contains a set of tags (separated  by whitespace), return all charity profiles with a match.
        tags = request.GET.get('tags', None)

        # Search for all relevant charities
        charity_profiles = list(TaggedItem.objects.get_union_by_model(CharityProfile, tags))

        charity_profile_serializer = CharityProfileSerializer(charity_profiles, many=True)
        return_dictionary = {"charity_profiles": charity_profile_serializer.data}
        json_charity_profiles = JSONRenderer().render(return_dictionary)

        return HttpResponse(json_charity_profiles, content_type='application/json')


# Manages the activities of charities
class CharityActivityView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    # Creates a new activity
    def post(self, request, format=None):

        user = request.user
        if user.role == roles.user:
            response_data = json.dumps({"error": "You are not authorised to like a charity. "})
            return HttpResponse(response_data, content_type='application/json')

        # Read required parameters
        data = request.data
        name = data.get('name', None)
        description = data.get('description', None)
        start_time = data.get('start_time', None)
        if start_time:
            start_time = timezone.make_aware(dateutil.parser.parse(start_time), timezone.get_current_timezone())
        end_time = data.get('end_time', None)
        if end_time:
            end_time = timezone.make_aware(dateutil.parser.parse(end_time), timezone.get_current_timezone())
        files = request.FILES
        if files:
            image = files['image']
        else:
            image = None

        CharityActivity.objects.create(charity_profile=user.charity_profile, name=name, description=description, start_time=start_time, end_time=end_time, image=image)

        return Response({'success': True}, status=status.HTTP_201_CREATED)


# Returns the activities of charities
class CharityActivitySearchView(APIView):
    permission_classes = (permissions.AllowAny,)

    # Returns specific charity activities
    def get(self, request):

        charity_profile_id = request.GET.get('id', None)
        charity_profile = CharityProfile.objects.get(id=charity_profile_id)
        charity_activities = charity_profile.activities

        charity_activity_serializer = CharityActivitySerializer(charity_activities, many=True)
        return_dictionary = {"charity_activities": charity_activity_serializer.data}
        json_charity_activities = JSONRenderer().render(return_dictionary)

        return HttpResponse(json_charity_activities, content_type='application/json')


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

        file_path = os.path.join(settings.MEDIA_ROOT, 'charity\\data\\csv\\extract_main_charity.csv')
        reader = csv.DictReader(open(file_path))

        # Bulk create all charity data objects
        charity_data_objects = []
        for row in reader:
            regno = row['regno']
            email = row['email']
            new_charity_data = CharityData(regno=regno, email=email)
            charity_data_objects.append(new_charity_data)

        CharityData.objects.bulk_create(charity_data_objects)

        return Response({'success': True}, status=status.HTTP_201_CREATED)


# Responsible for confirming the payments previously made by the user
class PaymentConfirmationView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):

        data = request.data
        transaction_id = data.get('transaction_id', "8C641029PY664850G")
        identity_token = data.get('identity_token', "net1NjmYwfzb2%2bmzaO5BC8jcei1NKXYbGptrF2ZV0px5RrXXDcUpN34zDFDdHiHAyJ7zqZskgNTViYLgVn8Qky6fxhP%2fx%2bRjS7RBFEKmCOWos%2becbOmQCFKELntlxvjoQim%2faEXgTdwc8E686EH8LM0%2fTLvflqNHo7nY%2bBsR090%3d4")

        post_data = [('tx', transaction_id), ("at", identity_token), ("cmd", "_notify-synch"),]
        post_data_bytes = urlencode(post_data).encode("utf-8")
        result = urlopen('https://www.paypal.com/cgi-bin/webscr', post_data_bytes).read().decode('UTF-8')

        json_reponse = JSONRenderer().render({"success": result})

        return HttpResponse(json_reponse, content_type='application/json')
