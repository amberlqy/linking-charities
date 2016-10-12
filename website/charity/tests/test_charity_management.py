from django.test import TestCase
from django.contrib.auth.models import User
from authentication.models import CharityProfile
from django.test import Client
import json


class CharityManagementViewTestCase(TestCase):

    client = Client()
    response = None

    def setUp(self):
        self.response = self.client.post("/auth/api/register/", {"username": "Heffalumps",
                                                                 "password": "Woozles",
                                                                 "user_type": "user"})
        self.response_charity = self.client.post("/auth/api/register/", {"username": "Charity1",
                                                                         "password": "Woozles123",
                                                                         "user_type": "charity",
                                                                         "location": "Monaco",
                                                                         "goal": "To save lonely kittens."})

    # Tests if we can successfully associate tags with a charity
    def test_upload_tags(self):
        response = self.client.post("/auth/api/login/", {"username": "Charity1", "password": "Woozles123"})

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        tag_response = self.client.post("/charity/api/charity_tags/", {"tags": "kitten cat soft"}, HTTP_AUTHORIZATION='JWT {}'.format(token))
        charity = User.objects.get(username="Charity1")
        charity_tags = charity.charity_profile.tags

        charity_tags_strings = [tag.name for tag in charity_tags]
        self.assertIn("kitten", charity_tags_strings)
        self.assertIn("cat", charity_tags_strings)

