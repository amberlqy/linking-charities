from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.settings import api_settings

import json
from django.contrib.auth import logout
from django.http.response import HttpResponse
from django.http import QueryDict
from django.contrib.auth.models import User

from charity.serializers.account_serializer import AccountSerializer
from charity.roles import roles
from charity.models.charity_profile import CharityProfile
from charity.models.user_profile import UserProfile
from charity.models.user_role import UserRole


class RegistrationView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):

        # Read basic required parameters
        data = request.data
        username = data.get('username', None)
        password = data.get('password', None)
        account_data = {'username': username, 'password': password, }
        account_data_qd = QueryDict('', mutable=True)
        account_data_qd.update(account_data)
        serializer = AccountSerializer(data=account_data_qd)

        if serializer.is_valid():

            # Create the user entity and add 'user' as its role
            user = User.objects.create_user(**serializer.validated_data)
            user_type = data.get('user_type', None)
            UserRole.objects.create(name=user_type, user=user)

            if user_type == 'charity':
                # Read charity specific parameters
                charity_name = data.get('charity_name', None)
                location = data.get('location', None)
                goal = data.get('goal', None)
                description = data.get('description', None)
                address = data.get('address', None)
                phone_number = data.get('phone_number', None)
                CharityProfile.objects.create(charity_name=charity_name,
                                              location=location,
                                              goal=goal,
                                              description=description,
                                              address=address,
                                              phone_number=phone_number,
                                              user=user)

            if user_type == 'user':
                # Read user specific parameters
                introduction = data.get('introduction', "Default Introduction")
                UserProfile.objects.create(introduction=introduction, user=user)

            # Manually generate a token for the new user
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)

            response_dictionary = {
                'token': token,
                'username': user.username
            }

            return Response(response_dictionary, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class CharityProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request):

        user = request.user
        if user.role == roles.charity:
            # If the user can access this view, that means the user is authorised as a charity

            data = request.data
            charity_name = data.get('charity_name', None)
            location = data.get('location', None)
            goal = data.get('goal', None)
            description = data.get('description', None)
            address = data.get('address', None)
            phone_number = data.get('phone_number', None)

            charity_profile = user.charity_profile
            charity_profile.charity_name = charity_name
            charity_profile.location = location
            charity_profile.goal = goal
            charity_profile.address = address
            charity_profile.phone_number = phone_number
            charity_profile.description = description
            charity_profile.save()

            response_data = json.dumps({"success": True})
            return HttpResponse(response_data, content_type='application/json')
        else:
            response_data = json.dumps({"authenticated": False})
            return HttpResponse(response_data, content_type='application/json')


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = request.data

        username = data.get('username', None)
        password = data.get('password', None)

        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                if user.is_active:

                    # Manually generate a token for the new user
                    jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
                    jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
                    payload = jwt_payload_handler(user)
                    token = jwt_encode_handler(payload)

                    return Response({
                        'token': token,
                        'username': user.username
                    })
                else:
                    return Response({
                        'status': 'Unauthorized',
                        'message': 'This account has been disabled.'
                    }, status=status.HTTP_401_UNAUTHORIZED)

            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'Username/password combination invalid.'
                }, status=status.HTTP_401_UNAUTHORIZED)

        except User.DoesNotExist:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)


class RestrictedView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request):

        # If the user can access this view, that means the user is authenticated
        response_data = json.dumps({"authenticated": True})
        return HttpResponse(response_data, content_type='application/json')


class CharityRestrictedView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request):

        user = request.user
        if user.role == roles.charity:
            # If the user can access this view, that means the user is autharised as a charity
            response_data = json.dumps({"authenticated": True})
            return HttpResponse(response_data, content_type='application/json')
        else:
            response_data = json.dumps({"authenticated": False})
            return HttpResponse(response_data, content_type='application/json')