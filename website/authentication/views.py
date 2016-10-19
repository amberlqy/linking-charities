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
from authentication.models import UserRole, CharityProfile, UserProfile


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
                location = data.get('location', None)
                goal = data.get('goal', None)
                description = data.get('description', None)
                CharityProfile.objects.create(location=location, goal=goal, description=description, user=user)

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