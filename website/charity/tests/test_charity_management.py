from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
import json

from charity.models.charity_activity import CharityActivity
from charity.models.charity_profile import CharityProfile


class CharityManagementViewTestCase(TestCase):

    client = Client()
    response = None

    def setUp(self):
        self.response = self.client.post("/api/auth/register/", {"username": "Heffalumps",
                                                                 "password": "Woozles",
                                                                 "user_type": "user"})
        self.response_charity = self.client.post("/api/auth/register/", {"username": "Charity1",
                                                                         "password": "Woozles123",
                                                                         "user_type": "charity",
                                                                         "goal": "To save lonely kittens.",
                                                                         "charity_name": "Save the kittens, quick"})

    # Tests if we can successfully associate tags with a charity
    def test_upload_tags(self):
        response = self.client.post("/api/auth/login/", {"username": "Charity1", "password": "Woozles123"})

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        tag_response = self.client.post("/api/charity/charity_tags/", {"tags": "kitten cat soft"}, HTTP_AUTHORIZATION='JWT {}'.format(token))
        charity = User.objects.get(username="Charity1")
        charity_tags = charity.charity_profile.tags

        charity_tags_strings = [tag.name for tag in charity_tags]
        self.assertIn("kitten", charity_tags_strings)
        self.assertIn("cat", charity_tags_strings)

    # Tests if we can successfully search for charity profiles using tags
    def test_search_for_charity_with_tags(self):

        # Cat charity
        response_cat_charity = self.client.post("/api/auth/register/", {"username": "CatCharity",
                                                    "password": "Woozles123",
                                                    "user_type": "charity",
                                                    "goal": "To save lonely kittens."})

        cat_response_content = json.loads(response_cat_charity.content.decode('utf-8'))
        cat_token = cat_response_content["token"]

        self.client.post("/api/charity/charity_tags/", {"tags": "kitten cat soft"},
                                        HTTP_AUTHORIZATION='JWT {}'.format(cat_token))

        # Dog charity
        response_dog_charity = self.client.post("/api/auth/register/", {"username": "DogCharity",
                                                     "password": "Woozles123",
                                                     "user_type": "charity",
                                                     "goal": "To save lonely doggies."})

        dog_response_content = json.loads(response_dog_charity.content.decode('utf-8'))
        dog_token = dog_response_content["token"]

        self.client.post("/api/charity/charity_tags/", {"tags": "doggie dog soft"},
                         HTTP_AUTHORIZATION='JWT {}'.format(dog_token))

        # Search with tags
        search_result_response = self.client.get("/api/charity/charity_search/", {"tags": "dog doggie"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 1)
        self.assertEqual(search_result_response_content["charity_profiles"][0]["goal"], "To save lonely doggies.")

        # Search for dogs and cats
        search_result_response = self.client.get("/api/charity/charity_search/", {"tags": "dog cat"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 2)

        # Dog 2 charity
        response_dog_charity = self.client.post("/api/auth/register/", {"username": "Dog2Charity",
                                                                        "password": "Woozles123",
                                                                        "user_type": "charity",
                                                                        "goal": "To save lonely doggies."})

        dog_response_content = json.loads(response_dog_charity.content.decode('utf-8'))
        dog_token = dog_response_content["token"]

        self.client.post("/api/charity/charity_tags/", {"tags": "dog"},
                         HTTP_AUTHORIZATION='JWT {}'.format(dog_token))

        # Search for dogs
        search_result_response = self.client.get("/api/charity/charity_search/", {"tags": "dog"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 2)

    # Search for charities using various fields
    def test_search_for_charity_with_fields(self):
        # Cat charity
        self.client.post("/api/auth/register/", {"username": "CatCharity",
                                                                        "password": "Woozles123",
                                                                        "user_type": "charity",
                                                                        "goal": "To save lonely kittens.",
                                                                        "country": "Hungary",
                                                                        "city": "Budapest"})

        # Dog charity
        self.client.post("/api/auth/register/", {"username": "DogCharity",
                                                                        "password": "Woozles123",
                                                                        "user_type": "charity",
                                                                        "goal": "To save lonely doggies."})

        search_result_response = self.client.get("/api/charity/charity_search/", {"country": "Hun"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 1)


    # Tests if anyone can get all charity profiles
    def test_get_all_charity_profiles(self):
        get_charity_response = self.client.get("/api/charity/charity_search/", {"all": True})
        get_charity_response_obj = json.loads(get_charity_response.content.decode('utf-8'))

        self.assertEqual(len(get_charity_response_obj["charity_profiles"]), 1)

    # Tests if anyone can get the profile of a charity based on the ID of the charity
    def test_get_charity_profile(self):
        charity = User.objects.get(username="Charity1")
        charity_profile = charity.charity_profile
        charity_profile_id = charity_profile.id
        get_charity_response = self.client.get("/api/charity/charity_search/", {"id": charity_profile_id})

        get_charity_response_obj = json.loads(get_charity_response.content.decode('utf-8'))
        self.assertEqual(get_charity_response_obj["charity_profile"]["goal"], "To save lonely kittens.")
        self.assertEqual(get_charity_response_obj["charity_profile"]["description"], None)

    # Tests if anyone can get the list of charity-profile names
    def test_get_all_charity_names(self):
        get_charity_response = self.client.get("/api/charity/charity_search/", {"name": "all"})
        get_charity_response_names = json.loads(get_charity_response.content.decode('utf-8'))
        self.assertEqual(len(get_charity_response_names["charity_names"]), 1)
        self.assertEqual(get_charity_response_names["charity_names"][0], "Save the kittens, quick")

    # Tests if a user profile can like a charity profile
    def test_liking_a_charity(self):

        # Log in as a user
        response = self.client.post("/api/auth/login/", {"username": "Heffalumps", "password": "Woozles"})
        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        # Get the ID of the already created charity
        existing_charity = User.objects.get(username="Charity1")
        existing_charity_profile = existing_charity.charity_profile

        self.client.post("/api/charity/charity_like/", {"id": existing_charity_profile.id},
                                        HTTP_AUTHORIZATION='JWT {}'.format(token))

        self.assertEqual(len(existing_charity_profile.likes.all()), 1)

        # Try liking the same charity again. We expect this to have no effect.
        self.client.post("/api/charity/charity_like/", {"id": existing_charity_profile.id},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        self.assertEqual(len(existing_charity_profile.likes.all()), 1)

        # Log in as a charity
        response = self.client.post("/api/auth/login/", {"username": "Charity1", "password": "Woozles123"})
        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        # Try liking the same charity again. We expect this to have no effect.
        self.client.post("/api/charity/charity_like/", {"id": existing_charity_profile.id},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        self.assertEqual(len(existing_charity_profile.likes.all()), 1)

        # Register a second user and like the same charity
        user_registration_response = self.client.post("/api/auth/register/", {"username": "SecondUser",
                                                                 "password": "1234",
                                                                 "user_type": "user"})

        user_registration_response_content = json.loads(user_registration_response.content.decode('utf-8'))
        token = user_registration_response_content["token"]

        self.client.post("/api/charity/charity_like/", {"id": existing_charity_profile.id},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        # We expect the charity to have 2 likes now
        self.assertEqual(len(existing_charity_profile.likes.all()), 2)

    # Tests if we can read the 5 most popular charities
    def test_5_most_popular_charities(self):
        for i in range(0,6):
            self.register_charity("PopularCharity" + str(i))

        random_charity = User.objects.get(username="PopularCharity4")
        random_charity_profile = random_charity.charity_profile
        random_charity_profile_id = random_charity_profile.id

        # Log in as a user
        response = self.client.post("/api/auth/login/", {"username": "Heffalumps", "password": "Woozles"})
        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        # Like this random charity
        self.client.post("/api/charity/charity_like/", {"id": random_charity_profile_id},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        # Get 5 most popular charities
        response = self.client.get("/api/charity/popular_charities/")
        response_content = json.loads(response.content.decode('utf-8'))
        charity_profiles = response_content["charity_profiles"]

        self.assertEqual(len(charity_profiles), 5)

        most_popular_charity_profile = charity_profiles[0]
        self.assertEqual(most_popular_charity_profile["charity_name"], "PopularCharity4")

    # Tests if we can upload an activity as a charity
    def test_upload_activity_as_a_charity(self):

        # Log in as a charity
        response = self.client.post("/api/auth/login/", {"username": "Charity1", "password": "Woozles123"})
        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        # Like this random charity
        self.client.post("/api/charity/activity/", {"name": "Awesome event"},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        # Check if the activity exists
        charity_activities = CharityActivity.objects.all()
        self.assertEqual(len(charity_activities), 1)

        charity_user = User.objects.get(username="Charity1")
        charity_profile = charity_user.charity_profile
        charity_profile_id = charity_profile.id

        # Get activities of charity as a regular visitor
        response = self.client.get("/api/charity/get_activity/", {"id": charity_profile_id})
        response_content = json.loads(response.content.decode('utf-8'))
        charity_activities = response_content["charity_activities"]

        self.assertEqual(len(charity_activities), 1)


    # Helper method to register charities
    def register_charity(self, name):
        self.client.post("/api/auth/register/", {"username": name,
                                                 "password": "Woozles123",
                                                 "charity_name": name,
                                                 "user_type": "charity",
                                                 "goal": "To save lonely kittens."})
