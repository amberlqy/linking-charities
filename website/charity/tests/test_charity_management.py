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
                                                                 "email": "heffalumps@woozles.com",
                                                                 "password": "Woozles",
                                                                 "user_type": "user"})
        self.response_charity = self.client.post("/api/auth/register/", {"username": "Charity1",
                                                                         "email": "heffalumps2@woozles2.com",
                                                                         "password": "Woozles123",
                                                                         "user_type": "charity",
                                                                         "goal": "To save lonely kittens."})

    # Tests the settings endpoints of charity profiles
    def test_charity_settings(self):
        response = self.client.post("/api/auth/login/", {"username": "Charity1", "password": "Woozles123"})

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        self.client.post("/api/charity/settings/", {"tags": "kitten,cat,soft", "paypal_email": "marci@new.hu"},
                                        HTTP_AUTHORIZATION='JWT {}'.format(token))

        tag_response = self.client.get("/api/charity/settings/", {},
                                       HTTP_AUTHORIZATION='JWT {}'.format(token))

        tag_response_content = json.loads(tag_response.content.decode('utf-8'))
        tags = tag_response_content["tags"]
        self.assertIn("kitten", tags)
        self.assertEqual("marci@new.hu", tag_response_content["paypal_email"])

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

    # Tests if we can successfully get tags associated with a charity profile
    def test_get_tags(self):
        response = self.client.post("/api/auth/login/", {"username": "Charity1", "password": "Woozles123"})

        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        tag_response = self.client.post("/api/charity/charity_tags/", {"tags": "kitten cat soft"},
                                        HTTP_AUTHORIZATION='JWT {}'.format(token))

        charity = User.objects.get(username="Charity1")
        charity_profile = charity.charity_profile
        charity_profile_id = charity_profile.id

        tag_response = self.client.get("/api/charity/charity_tags/", {"mode": "specific", "id": charity_profile_id},
                                        HTTP_AUTHORIZATION='JWT {}'.format(token))

        tag_response_content = json.loads(tag_response.content.decode('utf-8'))
        tags = tag_response_content["tags"]
        self.assertIn("kitten", tags)
        self.assertIn("cat", tags)
        self.assertIn("soft", tags)

    # Tests if we can successfully search for charity profiles using tags
    def test_advanced_search_for_charity(self):

        # Cat charity
        response_cat_charity = self.client.post("/api/auth/register/", {
                                                    "username": "CatCharity",
                                                    "email": "cat@woozles.com",
                                                    "password": "Woozles123",
                                                    "user_type": "charity",
                                                    "goal": "To save lonely kittens."})

        cat_response_content = json.loads(response_cat_charity.content.decode('utf-8'))
        cat_token = cat_response_content["token"]

        self.client.post("/api/charity/charity_tags/", {"tags": "kitten,cat,soft"},
                                        HTTP_AUTHORIZATION='JWT {}'.format(cat_token))

        # Dog charity
        response_dog_charity = self.client.post("/api/auth/register/", {
                                                     "username": "DogCharity",
                                                     "email": "dog@woozles.com",
                                                     "password": "Woozles123",
                                                     "user_type": "charity",
                                                     "goal": "To save lonely doggies."})

        dog_response_content = json.loads(response_dog_charity.content.decode('utf-8'))
        dog_token = dog_response_content["token"]

        self.client.post("/api/charity/charity_tags/", {"tags": "doggie,dog,soft"},
                         HTTP_AUTHORIZATION='JWT {}'.format(dog_token))

        # Search with tags
        search_result_response = self.client.get("/api/charity/charity_advanced_search/", {"tags": "dog,doggie"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 1)
        self.assertEqual(search_result_response_content["charity_profiles"][0]["goal"], "To save lonely doggies.")

        # Search for dogs and cats
        search_result_response = self.client.get("/api/charity/charity_advanced_search/", {"tags": "dog,cat"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 2)

        # Dog 2 charity
        response_dog_charity = self.client.post("/api/auth/register/", {"username": "Dog2Charity",
                                                                        "email": "dog2@woozles.com",
                                                                        "password": "Woozles123",
                                                                        "user_type": "charity",
                                                                        "goal": "To save lonely doggies."})

        dog_response_content = json.loads(response_dog_charity.content.decode('utf-8'))
        dog_token = dog_response_content["token"]

        self.client.post("/api/charity/charity_tags/", {"tags": "dog"},
                         HTTP_AUTHORIZATION='JWT {}'.format(dog_token))

        # Search for dogs
        search_result_response = self.client.get("/api/charity/charity_advanced_search/", {"tags": "dog"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 2)

        # Search for dogs
        search_result_response = self.client.get("/api/charity/charity_advanced_search/", {"name": "dog"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 2)

    # Search for charities using various fields
    def test_search_for_charity_with_fields(self):
        # Cat charity
        self.client.post("/api/auth/register/", {"username": "CatCharity",
                                                 "email": "cat2@woozles.com",
                                                 "password": "Woozles123",
                                                 "user_type": "charity",
                                                 "goal": "To save lonely kittens.",
                                                 "country": "Hungary",
                                                 "city": "Budapest"})

        # Dog charity
        self.client.post("/api/auth/register/", {"username": "DogCharity",
                                                 "email": "dog2@woozles.com",
                                                 "password": "Woozles123",
                                                 "user_type": "charity",
                                                 "goal": "To save lonely doggies."})

        search_result_response = self.client.get("/api/charity/charity_advanced_search/", {"country": "Hun"})
        search_result_response_content = json.loads(search_result_response.content.decode('utf-8'))
        self.assertEqual(len(search_result_response_content["charity_profiles"]), 1)


    # Tests if anyone can get all charity profiles
    def test_get_all_charity_profiles(self):
        get_charity_response = self.client.get("/api/charity/get_charity/", {"all": True})
        get_charity_response_obj = json.loads(get_charity_response.content.decode('utf-8'))

        self.assertEqual(len(get_charity_response_obj["charity_profiles"]), 1)

    # Tests if anyone can get the profile of a charity based on the ID of the charity
    def test_get_charity_profile(self):
        charity = User.objects.get(username="Charity1")
        charity_profile = charity.charity_profile
        charity_profile_username = charity_profile.user.username
        get_charity_response = self.client.get("/api/charity/get_charity/", {"name": charity_profile_username})

        get_charity_response_obj = json.loads(get_charity_response.content.decode('utf-8'))
        self.assertEqual(get_charity_response_obj["charity_profile"]["goal"], "To save lonely kittens.")
        self.assertEqual(get_charity_response_obj["charity_profile"]["description"], None)

    # Tests if anyone can get the list of charity-profile names
    def test_get_all_charity_names(self):
        get_charity_response = self.client.get("/api/charity/get_charity/", {"all": True})
        get_charity_response_names = json.loads(get_charity_response.content.decode('utf-8'))
        self.assertEqual(len(get_charity_response_names["charity_profiles"]), 1)
        self.assertEqual(get_charity_response_names["charity_profiles"][0]["charity_name"], "Charity1")

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
        user_registration_response = self.client.post("/api/auth/register/", {
                                                     "username": "SecondUser",
                                                    "email": "second_user@woozles.com",
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
            self.register_charity("PopularCharity" + str(i), "popular_charity_" + str(i) + "@gmail.com")

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

    # Tests if a user profile can rate a charity profile
    def test_rating_a_charity(self):

        # Log in as a user
        response = self.client.post("/api/auth/login/", {"username": "Heffalumps", "password": "Woozles"})
        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        # Get the already created charity
        existing_charity = User.objects.get(username="Charity1")
        existing_charity_profile = existing_charity.charity_profile

        self.client.post("/api/charity/charity_rating/", {"charity_name": "Charity1", "rate_by_user": 4.5},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        self.assertEqual(len(existing_charity_profile.ratings.all()), 1)
        self.assertEqual(existing_charity_profile.ratings.first().rate_by_user, 4.5)

        # Rate again
        self.client.post("/api/charity/charity_rating/", {"charity_name": "Charity1", "rate_by_user": 3.5},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        self.assertEqual(len(existing_charity_profile.ratings.all()), 1)
        self.assertEqual(existing_charity_profile.ratings.first().rate_by_user, 3.5)

        # Remove rating
        self.client.post("/api/charity/charity_rating/", {"charity_name": "Charity1", "rate_by_user": 0.0},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        self.assertEqual(len(existing_charity_profile.ratings.all()), 0)

    # Tests if we can successfully get ratings of charity profiles
    def test_get_charity_ratings(self):
        # Log in as a user
        response = self.client.post("/api/auth/login/", {"username": "Heffalumps", "password": "Woozles"})
        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        self.client.post("/api/charity/charity_rating/", {"charity_name": "Charity1", "rate_by_user": 3.0},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        # Register a second user
        self.response = self.client.post("/api/auth/register/", {"username": "Marci5",
                                                                 "email": "marci5@woozles.com",
                                                                 "password": "Woozles",
                                                                 "user_type": "user"})

        # Log in as another user
        response = self.client.post("/api/auth/login/", {"username": "Marci5", "password": "Woozles"})
        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        self.client.post("/api/charity/charity_rating/", {"charity_name": "Charity1", "rate_by_user": 5.0},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        # Get ratings of the charity profile as a non-logged in user
        response = self.client.get("/api/charity/charity_rating_aggregates/", {"charity_name": "Charity1"})
        response_content = json.loads(response.content.decode('utf-8'))
        rate_by_user = response_content["rate_by_user"]
        average_rate = response_content["average_rate"]
        total_users = response_content["total_users"]

        self.assertEqual(rate_by_user, 0.0)
        self.assertEqual(average_rate, 4.0)
        self.assertEqual(total_users, 2)

        # Get ratings of the charity profile as a logged in user
        response = self.client.get("/api/charity/charity_rating_aggregates/", {"charity_name": "Charity1"},
                                   HTTP_AUTHORIZATION='JWT {}'.format(token))
        response_content = json.loads(response.content.decode('utf-8'))
        rate_by_user = response_content["rate_by_user"]
        average_rate = response_content["average_rate"]
        total_users = response_content["total_users"]

        self.assertEqual(rate_by_user, 5.0)
        self.assertEqual(average_rate, 4.0)
        self.assertEqual(total_users, 2)

    # Tests if we can upload an activity as a charity
    def test_upload_activity_as_a_charity(self):

        # Log in as a charity
        response = self.client.post("/api/auth/login/", {"username": "Charity1", "password": "Woozles123"})
        response_content = json.loads(response.content.decode('utf-8'))
        token = response_content["token"]

        # Upload a new activity
        details = json.dumps({"name": 'Awesome event'})
        self.client.post("/api/charity/activity/", {"model": details},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        # Check if the activity exists
        charity_activities = CharityActivity.objects.all()
        self.assertEqual(len(charity_activities), 1)

        # Get activities of charity as a regular visitor
        response = self.client.get("/api/charity/get_activity/", {"name": "Charity1"})
        response_content = json.loads(response.content.decode('utf-8'))
        charity_activities = response_content["charity_activities"]

        self.assertEqual(len(charity_activities), 1)

        # Test editing as well
        latest_activity = CharityActivity.objects.latest("uploaded_at")
        id = latest_activity.id
        details = json.dumps({"name": 'Not Awesome event', "id": id})
        self.client.post("/api/charity/activity/", {"model": details},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))

        charity_activities = CharityActivity.objects.all()
        self.assertEqual(len(charity_activities), 1)

        # Get activities of charity as a charity
        response = self.client.get("/api/charity/get_activity/", {"name": "Charity1"},
                         HTTP_AUTHORIZATION='JWT {}'.format(token))
        response_content = json.loads(response.content.decode('utf-8'))
        charity_activity = response_content["charity_activities"][0]

        self.assertEqual(charity_activity["name"], "Not Awesome event")

    # Helper method to register charities
    def register_charity(self, name, email):
        self.client.post("/api/auth/register/", {"username": name,
                                                 "email": email,
                                                 "password": "Woozles123",
                                                 "charity_name": name,
                                                 "user_type": "charity",
                                                 "goal": "To save lonely kittens."})
