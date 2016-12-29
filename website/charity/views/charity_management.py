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
from django.utils.http import urlencode
from django.db.models import Q, Avg

from assets import settings
from charity.models.charity_activity import CharityActivity
from charity.models.charity_activity_image import CharityActivityImage
from charity.models.charity_data import CharityData
from charity.models.charity_profile import CharityProfile
from charity.models.charity_rating import CharityRating
from charity.models.payment import Payment
from charity.roles import roles
from tagging.models import Tag, TaggedItem
from django.contrib.auth.models import User

from charity.serializers.charity_activity_serializer import CharityActivitySerializer
from charity.utilities.zip_to_csv_converter import import_zip

from charity.serializers.charity_profile_serializer import CharityProfileSerializer


# Returns the default home page
class IndexView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        template = loader.get_template('charity/index.html')

        return HttpResponse(template.render())


class CharitySettingsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    # Adds tags to the profile of a charity.
    # The 'tags' parameter has so be a string with words separated by commas/spaces.
    # Updates PayPal information, and password
    def post(self, request):

        # Check the user's role
        user = request.user
        if user.role != roles.charity:
            response_data = json.dumps({"authorised": False})
            return HttpResponse(response_data, content_type='application/json')

        # Read required parameters
        data = request.data
        tags = data.get('tags', None)
        Tag.objects.update_tags(user.charity_profile, tags)

        paypal_email = data.get('paypal_email', None)
        paypal_token = data.get('paypal_token', None)

        charity_profile = user.charity_profile
        charity_profile.paypal_email = paypal_email
        charity_profile.paypal_identity_token = paypal_token
        charity_profile.save()

        # TODO: update password as well

        return Response({'success': True}, status=status.HTTP_201_CREATED)

    # Gets the tags and the paypal information of a charity
    def get(self, request):

        # Check the user's role
        user = request.user
        if user.role != roles.charity:
            response_data = json.dumps({"authorised": False})
            return HttpResponse(response_data, content_type='application/json')

        charity_profile = user.charity_profile
        tags = Tag.objects.get_for_object(charity_profile)
        charity_tags_strings = [tag.name for tag in tags]
        charity_tags_string = ",".join(charity_tags_strings)

        return_dictionary = {"tags": charity_tags_string,
                             "paypal_email": charity_profile.paypal_email,
                             "paypal_token": charity_profile.paypal_identity_token}
        json_charity_profiles = JSONRenderer().render(return_dictionary)

        return HttpResponse(json_charity_profiles, content_type='application/json')


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

    # Gets the tags of a specific charity profile, or returns the overall tag usage for all charity profiles
    def get(self, request):
        mode = request.GET.get('mode', None)

        if not mode:
            response_data = json.dumps({"error": "Mode unrecognised!"})
            return HttpResponse(response_data, content_type='application/json')

        # Get usage counts for tags used by charity profiles
        if mode == "usage":
            tags_and_counts = Tag.objects.usage_for_model(CharityProfile, counts=True)
            response_data = json.dumps({"tags_and_counts": tags_and_counts})
            return HttpResponse(response_data, content_type='application/json')

        # Get the tags used by a specific charity
        id = request.GET.get('id', None)
        charity_profile = CharityProfile.objects.filter(id=id).first()
        if not charity_profile:
            response_data = json.dumps({"error": "Charity profile doesn't exist!"})
            return HttpResponse(response_data, content_type='application/json')

        tags = Tag.objects.get_for_object(charity_profile)
        charity_tags_strings = [tag.name for tag in tags]
        response_data = json.dumps({"tags": charity_tags_strings})
        return HttpResponse(response_data, content_type='application/json')


class CharitySearchView(APIView):
    permission_classes = (permissions.AllowAny,)

    # Search for charities based on an ID or tags
    def get(self, request):

        # If the request contains a single ID, return only one charity profile.
        charity_username = request.GET.get('name', None)
        if charity_username:
            # Search by matching with charity_name instead of id
            charity_profile = CharityProfile.objects.filter(user__username=charity_username).first()

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
        if tags:
            # Search for all relevant charities
            charity_profiles = list(TaggedItem.objects.get_union_by_model(CharityProfile, tags))

            charity_profile_serializer = CharityProfileSerializer(charity_profiles, many=True)
            return_dictionary = {"charity_profiles": charity_profile_serializer.data}
            json_charity_profiles = JSONRenderer().render(return_dictionary)

            return HttpResponse(json_charity_profiles, content_type='application/json')

        charity_name = request.GET.get('name', "")
        goal = request.GET.get('target', "")
        country = request.GET.get('country', "")
        city = request.GET.get('city', "")
        ranking = request.GET.get('ranking', "")

        charity_profiles = CharityProfile.objects.all()
        if charity_name:
            charity_profiles = charity_profiles.filter(Q(charity_name__contains=charity_name))
        if goal:
            charity_profiles = charity_profiles.filter(Q(goal__contains=goal))
        if country:
            charity_profiles = charity_profiles.filter(Q(country__contains=country))
        if city:
            charity_profiles = charity_profiles.filter(Q(city__contains=city))

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
            response_data = json.dumps({"error": "You are not authorised to post an activity. "})
            return HttpResponse(response_data, content_type='application/json')

        # Read required parameters
        data = request.data["model"]
        model_data = json.loads(data)
        name = model_data['name']
        if not name:
            response_data = json.dumps({"error": "The activity name cannot be null. "})
            return HttpResponse(response_data, content_type='application/json')

        if "description" in model_data:
            description = model_data['description']
        else:
            description = None

        if "date" in model_data:
            date = model_data['date']
        else:
            date = None

        charity_activity = CharityActivity.objects.create(charity_profile=user.charity_profile, name=name,
                                                          description=description, date=date)

        files = request.FILES
        if files:
            for image_name in files:
                CharityActivityImage.objects.create(charity_activity=charity_activity, image=files[image_name])

        return Response({'success': True}, status=status.HTTP_201_CREATED)


# Returns the activities of charities
class CharityActivitySearchView(APIView):
    permission_classes = (permissions.AllowAny,)

    # Returns specific charity activities
    def get(self, request):

        # Get all activities belonging to a charity
        charity_username = request.GET.get('name', None)
        if charity_username:
            charity = User.objects.filter(username=charity_username).first()
            if not charity:
                response_data = json.dumps({"error": "No charity found with this username. "})
                return HttpResponse(response_data, content_type='application/json')

            charity_profile = charity.charity_profile
            charity_activities = charity_profile.activities

            charity_activity_serializer = CharityActivitySerializer(charity_activities, many=True)
            return_dictionary = {"charity_activities": charity_activity_serializer.data}
            json_charity_activities = JSONRenderer().render(return_dictionary)

            return HttpResponse(json_charity_activities, content_type='application/json')

        # Get a specific activity
        activity_id = request.GET.get('activity_id', None)
        activity = CharityActivity.objects.filter(id=activity_id).first()
        if not activity:
            response_data = json.dumps({"error": "No activity found with this ID: " + str(activity_id)})
            return HttpResponse(response_data, content_type='application/json')

        charity_activity_serializer = CharityActivitySerializer(activity)
        return_dictionary = {"charity_activity": charity_activity_serializer.data}
        json_charity_activities = JSONRenderer().render(return_dictionary)

        return HttpResponse(json_charity_activities, content_type='application/json')


class CharityLikeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    # Allows users to like a charity
    def post(self, request, format=None):
        user = request.user
        if user.role == roles.charity:
            response_data = json.dumps({"error": "You are not authorised to like a charity."})
            return HttpResponse(response_data, content_type='application/json')

        # Read required parameters
        data = request.data
        charity_profile_id = data.get('id', None)

        charity_profile = CharityProfile.objects.get(id=charity_profile_id)
        charity_profile.likes.add(user.user_profile)

        return Response({'success': True}, status=status.HTTP_201_CREATED)


class CharityRatingView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    # Allows users to rate a charity
    def post(self, request, format=None):
        user = request.user

        # Read required parameters
        data = request.data
        charity_name = data.get('charity_name', None)
        charity_user = User.objects.filter(username=charity_name).first()
        if not charity_user:
            response_data = json.dumps({"error": "No charity exists with this name."})
            return HttpResponse(response_data, content_type='application/json')

        charity_profile = charity_user.charity_profile

        rate_by_user = data.get('rate_by_user', None)
        if not rate_by_user:
            response_data = json.dumps({"error": "No rating was given."})
            return HttpResponse(response_data, content_type='application/json')

        # If the rating is 0.0, attempt to remove the already existing rating
        if float(rate_by_user) == 0.0:
            if charity_profile.ratings.filter(user=user).exists():
                existing_rating = charity_profile.ratings.filter(user=user).first()
                existing_rating.delete()
                return Response({'success': True}, status=status.HTTP_201_CREATED)
            else:
                response_data = json.dumps({"error": "Cannot remove your rating, because you haven't given one yet."})
                return HttpResponse(response_data, content_type='application/json')

        # Check if user has already rated this charity profile
        if charity_profile.ratings.filter(user=user).exists():
            existing_rating = charity_profile.ratings.filter(user=user).first()
            existing_rating.rate_by_user = rate_by_user
            existing_rating.save()
        else:
            CharityRating.objects.create(user=user, charity_profile=charity_profile, rate_by_user=rate_by_user)

        return Response({'success': True}, status=status.HTTP_201_CREATED)


# Returns ratings related information for a specific charity
class CharityRatingPublicView(APIView):
    permission_classes = (permissions.AllowAny,)

    # Returns specific charity ratings
    def get(self, request):
        charity_username = request.GET.get('charity_name', None)
        charity = User.objects.filter(username=charity_username).first()

        if not charity:
            response_data = json.dumps({"error": "No charity found with this username."})
            return HttpResponse(response_data, content_type='application/json')

        charity_profile = charity.charity_profile
        charity_ratings = charity_profile.ratings

        # Create the return values
        logged_in_user = request.user
        if not logged_in_user.is_authenticated():
            rate_by_user = 0.0
        else:
            rate_by_user = charity_ratings.filter(user=logged_in_user).first().rate_by_user

        average_rate = charity_ratings.aggregate(average_rate=Avg('rate_by_user'))["average_rate"]
        total_users = charity_ratings.count()

        return_dictionary = {"rate_by_user": rate_by_user,
                             "average_rate": average_rate,
                             "total_users": total_users}
        json_charity_activities = JSONRenderer().render(return_dictionary)

        return HttpResponse(json_charity_activities, content_type='application/json')


# Responsible for returning data related to the popularity of charities
class CharityPopularityView(APIView):
    permission_classes = (permissions.AllowAny,)

    # Get the 5 most popular charities
    def get(self, request):
        top_charity_profiles = CharityProfile.objects.annotate(likes_count=models.Count('likes')).order_by(
            '-likes_count')[:5]

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


# Responsible for confirming the payments previously made by any user
class PaymentConfirmationView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, charity_username):

        # Read parameter from the URL
        charity_profile = User.objects.filter(username=charity_username).first()
        if not charity_profile:
            response_data = json.dumps(
                {"error": "Charity profile does not exist with the provided username: " + str(charity_username)})
            return HttpResponse(response_data, content_type='application/json')

        data = request.data
        transaction_id = data.get('transaction_id', None)
        if not transaction_id:
            response_data = json.dumps({"error": "Transaction ID was not provided."})
            return HttpResponse(response_data, content_type='application/json')

        # Example: "-T0hTSFMJq_7jc_El8QNPTDRCLOmq7f4WswXwlQin6RNClH8bJAaBQbkEFa"
        charity_identity_token = charity_profile.paypal_identity_token

        post_data = [('tx', transaction_id), ("at", charity_identity_token), ("cmd", "_notify-synch"), ]
        post_data_bytes = urlencode(post_data).encode("utf-8")
        result = urlopen('https://www.sandbox.paypal.com/cgi-bin/webscr', post_data_bytes).read().decode('UTF-8')

        # Check if the user is logged in
        user = request.user
        if user:
            new_payment = Payment()
            pass

        json_reponse = JSONRenderer().render({"success": result})
        return HttpResponse(json_reponse, content_type='application/json')
