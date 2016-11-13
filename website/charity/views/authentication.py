from rest_framework import status, permissions
from rest_framework.renderers import JSONRenderer
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
from charity.serializers.charity_profile_serializer import CharityProfileSerializer
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
                goal = data.get('goal', None)
                description = data.get('description', None)
                address = data.get('address', None)
                city = data.get('city', None)
                country = data.get('country', None)
                postcode = data.get('postcode', None)
                email = data.get('email', None)
                phone_number = data.get('phone_number', None)
                CharityProfile.objects.create(charity_name=charity_name,
                                              goal=goal,
                                              description=description,
                                              address=address,
                                              city=city,
                                              country=country,
                                              postcode=postcode,
                                              email=email,
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
                'username': user.username,
                'user_role': user.role.name
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
            goal = data.get('goal', None)
            description = data.get('description', None)
            address = data.get('address', None)
            city = data.get('city', None)
            country = data.get('country', None)
            postcode = data.get('postcode', None)
            email = data.get('email', None)
            phone_number = data.get('phone_number', None)

            charity_profile = user.charity_profile
            charity_profile.charity_name = charity_name
            charity_profile.goal = goal
            charity_profile.address = address
            charity_profile.city = city
            charity_profile.country = country
            charity_profile.postcode = postcode
            charity_profile.email = email
            charity_profile.phone_number = phone_number
            charity_profile.description = description
            charity_profile.save()

            response_data = json.dumps({"success": True})
            return HttpResponse(response_data, content_type='application/json')
        else:
            response_data = json.dumps({"authenticated": False})
            return HttpResponse(response_data, content_type='application/json')

    # Returns the profile of the logged in user
    def get(self, request):

        user = request.user
        if user.role == roles.charity:
            charity_profile = user.charity_profile

            charity_profile_serializer = CharityProfileSerializer(charity_profile)
            return_dictionary = {"charity_profile": charity_profile_serializer.data}
            json_charity_profile = JSONRenderer().render(return_dictionary)

            return HttpResponse(json_charity_profile, content_type='application/json')
        else:
            # TODO: return user profile
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

                    user_role = user.role

                    return Response({
                        'token': token,
                        'username': user.username,
                        'user_role': user_role.name
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