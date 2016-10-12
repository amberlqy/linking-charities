from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.settings import api_settings

from django.contrib.auth import logout
from django.http.response import HttpResponse
import json
from django.http import QueryDict

from django.contrib.auth.models import User
from authentication.serializers import AccountSerializer
from authentication.roles import roles
from authentication.models import UserRole, CharityProfile
from django.db import transaction
from tagging.models import Tag


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
