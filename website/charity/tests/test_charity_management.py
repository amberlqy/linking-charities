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

    # Tests if we can successfully search for charity profiles using tags
    def test_search_for_charity_with_tags(self):

        # Cat charity
        response_cat_charity = self.client.post("/auth/api/register/", {"username": "CatCharity",
                                                    "password": "Woozles123",
                                                    "user_type": "charity",
                                                    "location": "Monaco",
                                                    "goal": "To save lonely kittens."})

        cat_response_content = json.loads(response_cat_charity.content.decode('utf-8'))
        cat_token = cat_response_content["token"]

        self.client.post("/charity/api/charity_tags/", {"tags": "kitten cat soft"},
                                        HTTP_AUTHORIZATION='JWT {}'.format(cat_token))

        # Dog charity
        response_dog_charity = self.client.post("/auth/api/register/", {"username": "DogCharity",
                                                     "password": "Woozles123",
                                                     "user_type": "charity",
                                                     "location": "Monaco",
                                                     "goal": "To save lonely doggies."})

        dog_response_content = json.loads(response_dog_charity.content.decode('utf-8'))
        dog_token = dog_response_content["token"]

        self.client.post("/charity/api/charity_tags/", {"tags": "doggie dog soft"},
                         HTTP_AUTHORIZATION='JWT {}'.format(dog_token))

        # Search with tags
        search_result_response = self.client.get("/charity/api/charity_search/", {"tags": "dog doggie"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 1)
        self.assertEqual(search_result_response_content["charity_profiles"][0]["goal"], "To save lonely doggies.")

        # Search for dogs and cats
        search_result_response = self.client.get("/charity/api/charity_search/", {"tags": "dog cat"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 2)

        # Dog 2 charity
        response_dog_charity = self.client.post("/auth/api/register/", {"username": "Dog2Charity",
                                                                        "password": "Woozles123",
                                                                        "user_type": "charity",
                                                                        "location": "Monaco",
                                                                        "goal": "To save lonely doggies."})

        dog_response_content = json.loads(response_dog_charity.content.decode('utf-8'))
        dog_token = dog_response_content["token"]

        self.client.post("/charity/api/charity_tags/", {"tags": "dog"},
                         HTTP_AUTHORIZATION='JWT {}'.format(dog_token))

        # Search for dogs
        search_result_response = self.client.get("/charity/api/charity_search/", {"tags": "dog"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 2)




