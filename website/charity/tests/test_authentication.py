from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
import json


class AuthenticationViewTestCase(TestCase):

    client = Client()
    response = None

    def setUp(self):
        self.response = self.client.post("/api/auth/register/", {"username": "Heffalumps",
                                                                 "password": "Woozles",
                                                                 "user_type": "user"})
        self.response_charity = self.client.post("/api/auth/register/", {"username": "Charity1",
                                                                         "password": "Woozles123",
                                                                         "user_type": "charity",
                                                                         "location": "Monaco",
                                                                         "goal": "To save lonely kittens."})

    def test_create_account(self):
        response_content = json.loads(self.response.content.decode('utf-8'))
        self.assertEqual("Heffalumps", response_content["username"], "Response should contain the username.")
        self.assertGreater(len(response_content["token"]), 0, "Response should contain the token.")

        latest_account = User.objects.latest('date_joined')
        self.assertEqual("Charity1", latest_account.username, "The username must be present in the database.")

    def test_unauthorised_access(self):
        response = self.client.post("/api/auth/get_token/", {"username": "Mango", "password": "Apple"})
        self.assertEqual(response.status_code, 400, "There shouldn't be a token received.")

        response = self.client.post("/api/auth/authenticated/", {}, HTTP_AUTHORIZATION='JWT {}'.format("bad token"))
        self.assertEqual(response.status_code, 401, "There shouldn't be access granted.")

    def test_authorised_access(self):
        response = self.client.post("/api/auth/get_token/", {"username": "Heffalumps", "password": "Woozles"})
        self.assertEqual(response.status_code, 200, "The token should be successfully returned.")

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        response = self.client.post("/api/auth/authenticated/", {}, HTTP_AUTHORIZATION='JWT {}'.format(token))
        response_content = json.loads(response.content.decode('utf-8'))

        self.assertTrue(response_content["authenticated"], "The user should be able to access this endpoint.")

    def test_authorised_access_via_login(self):
        response = self.client.post("/api/auth/login/", {"username": "Heffalumps", "password": "Woozles"})
        self.assertEqual(response.status_code, 200, "The token should be successfully returned.")

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        response = self.client.post("/api/auth/authenticated/", {}, HTTP_AUTHORIZATION='JWT {}'.format(token))
        response_content = json.loads(response.content.decode('utf-8'))

        self.assertTrue(response_content["authenticated"], "The user should be able to access this endpoint.")

    def test_charity_access_via_login(self):
        response = self.client.post("/api/auth/login/", {"username": "Charity1", "password": "Woozles123"})
        self.assertEqual(response.status_code, 200, "The token should be successfully returned.")

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        response = self.client.post("/api/auth/authenticated_charity/", {}, HTTP_AUTHORIZATION='JWT {}'.format(token))
        response_content = json.loads(response.content.decode('utf-8'))

        self.assertTrue(response_content["authenticated"], "The user should be able to access this endpoint.")

    def test_charity_profile_exists(self):
        charity = User.objects.get(username="Charity1")
        charity_profile = charity.charity_profile

        self.assertEqual(charity_profile.goal, "To save lonely kittens.")
        self.assertEqual(charity_profile.description, None)

    def test_charity_profile_update(self):
        response = self.client.post("/api/auth/login/", {"username": "Charity1", "password": "Woozles123"})
        self.assertEqual(response.status_code, 200, "The token should be successfully returned.")

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        charity = User.objects.get(username="Charity1")
        charity_profile = charity.charity_profile
        self.assertEqual(charity_profile.phone_number, None)

        response = self.client.post("/api/auth/charity_profile/", {"charity_name": "Mister Charity",
                                                                   "location": "Budapest",
                                                                   "goal": "To improve the city.",
                                                                   "address": "Budapest 1 2 3",
                                                                   "phone_number": "0123456789"}, HTTP_AUTHORIZATION='JWT {}'.format(token))

        charity = User.objects.get(username="Charity1")
        charity_profile = charity.charity_profile
        self.assertEqual(charity_profile.phone_number, "0123456789")

