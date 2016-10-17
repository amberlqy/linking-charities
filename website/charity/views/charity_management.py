from rest_framework import status, permissions
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.http.response import HttpResponse
import json

from authentication.models import CharityProfile
from authentication.roles import roles
from tagging.models import Tag, TaggedItem

from authentication.serializers import CharityProfileSerializer


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

    # Search for charities based on tags
    def get(self, request, format=None):

        # Read basic GET parameters
        tags = request.GET.get('tags', None)

        # Search for all relevant charities
        charity_profiles = list(TaggedItem.objects.get_union_by_model(CharityProfile, tags))

        charity_profile_serializer = CharityProfileSerializer(charity_profiles, many=True)
        return_dictionary = {"charity_profiles": charity_profile_serializer.data}
        json_charity_profiles = JSONRenderer().render(return_dictionary)

        return HttpResponse(json_charity_profiles, content_type='application/json')
