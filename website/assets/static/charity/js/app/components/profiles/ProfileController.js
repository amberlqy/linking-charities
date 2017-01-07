
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', 'Profile', 'profilePrepService', 'ratingPrepService', '$http', 'activityPrepService', '$scope', '$route'];

    function ProfileController($location, Profile, profilePrepService, ratingPrepService, $http, activityPrepService, $scope, $route) {
        var vm = this;
        vm.profile = {};

        activate();

        function activate() {
            // initial value
            vm.isMatched = false;
            // Get current charity profile data
            setProfile();
            // Get rating
            getRating();
            // Get Activity
            getActivity();
            // Get finance
            getFinance();

            var user_role = Profile.getAuthenticatedAccount();
            if (user_role != undefined && user_role != null) {
                vm.isCharity = user_role.userRole == "charity";
                vm.isMatched = user_role.username == vm.profile.name;
                vm.user = user_role.username;
            }

            function setProfile() {
                var charity_profile = profilePrepService.data.charity_profile;
                if (charity_profile == undefined || charity_profile == null || charity_profile.charity_name == "") {
                    alert("Page Not Found. We could not find the page you requested.");
                    $location.url('/home');
                    return;
                }
                vm.profile.name = charity_profile.charity_name;
                vm.profile.goal = charity_profile.goal;
                vm.profile.description = charity_profile.description;
                vm.profile.address = charity_profile.address
                vm.profile.city = charity_profile.city;
                vm.profile.country = charity_profile.country;
                vm.profile.postcode = charity_profile.postcode;
                vm.profile.email = charity_profile.email;
                vm.profile.phone_number = charity_profile.phone_number;
                vm.profile.profile_image = charity_profile.profile_image;
            }

            // Get rate information
            function getRating() {
                var rateInfo = ratingPrepService.data;
                if (rateInfo != undefined && rateInfo != null) {
                    var rateAverage = Math.round(rateInfo.average_rate * 10) / 10;
                    vm.profile.rate = rateInfo.average_rate == null ? 0 : rateAverage;
                    vm.profile.total_users = rateInfo.total_users;
                    vm.profile.userRate = rateInfo.rate_by_user;
                } else {
                    vm.profile.rate = "0";
                    vm.profile.total_users = "0";
                    vm.profile.userRate = "0";
                }
            }

            function getActivity() {
                var charityActivity = activityPrepService.data.charity_activities;
                vm.profile.spendAmount = 0;
                vm.profile.volunteer = 0;
                if (charityActivity != undefined && charityActivity != null) {
                    if (charityActivity.length > 0) {
                        // Last Activity
                        var activity = charityActivity[charityActivity.length-1];
                        vm.profile.activityId = activity.id;
                        vm.profile.activityName = activity.name;
                        // Date format
                        var pattern = /(\d{4})(\d{2})(\d{2})/; // date pattern
                        var strDate = activity.date.toString();
                        vm.profile.date = new Date(strDate.replace(pattern, '$1-$2-$3'));
                        // last image
                        var images = activity.images;
                        if (images.length > 0) {
                            vm.profile.activityImage = images[images.length-1].image;
                        }

                        // Spending and volunteer
                        var activityName = [];
                        var spending = [];

                        for (var i = 0; i < charityActivity.length; i++) {
                            // For finance section
                            if (charityActivity[i].spending > 0) {
                                activityName.push(charityActivity[i].name);
                                spending.push(charityActivity[i].spending);
                                vm.profile.spendAmount += charityActivity[i].spending;
                            }
                            // Sum volunteer in the charity
                            vm.profile.volunteer += charityActivity[i].volunteer_count;
                        }

                        // For pie chart
                        vm.profile.labels = activityName;
                        vm.profile.spendingdata = spending;
                    }
                }
            }

            // Get financial information
            function getFinance() {
                $http.get('/api/charity/donation_statistics/', {params: {"charity_name": vm.profile.name}}).then(getSuccessFn, getErrorFn);

                function getSuccessFn(data, status, headers, config) {
                    var finance = data.data;
                    vm.profile.donatedAmount = finance.donation_sum == null ? 0 : finance.donation_sum;
                }

                function getErrorFn(data, status, headers, config) {
                    console.error('Getting finance failed! ' + status);
                }
            }
        }

        $scope.files = [];

        // listen for the file selected event which is raised from directive
        $scope.$on("seletedFile", function (event, args) {
            $scope.$apply(function () {
                //add the file object to the scope's files collection
                $scope.files.push(args.file);
            });
        });

        // TODO : update profile
        vm.update = function(){
            var profileObj = {
                "charity_name": vm.profile.name,
                "goal": null,
                "description": vm.profile.description,
                "address": vm.profile.address,
                "city": vm.profile.city,
                "country": vm.profile.country,
                "postcode": vm.profile.postcode,
                "email": vm.profile.email,
                "phone_number": vm.profile.phone_number
            };

            $http({
                method: 'POST',
                url: "/api/auth/charity_profile/",
                headers: { 'Content-Type': undefined },
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("model", angular.toJson(data.model));
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i]);
                    }
                    return formData;
                },
                data: { model: profileObj, files: $scope.files }
            }).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                // $route.reload();
                // $location.url('/profile/' + vm.profile.name + '/');
                location.reload(true);
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Update profile failed! ' + status);
            }
        }

        // Rate update
        vm.rateChange = function(){
            var rate = vm.profile.userRate + '.0';
            var setRate = {
                "charity_name": vm.profile.name,
                "rate_by_user": rate
            };
            $http.post('/api/charity/charity_rating/', setRate).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                Profile.getRating(vm.profile.name).then(function(result) {
                    var updateRating = result.data;
                    var rateAverage = Math.round(updateRating.average_rate * 10) / 10;
                    vm.profile.rate = updateRating.average_rate == null ? 0 : rateAverage;
                    vm.profile.total_users = updateRating.total_users;
                });
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Getting rank failed! ' + status);
            }
        }

        // share facebook
        vm.share = function() {
            FB.ui(
                {
                    method: 'feed',
                    name: vm.profile.name,
                    description: vm.profile.description,
                    link: 'http://ec2-54-194-73-253.eu-west-1.compute.amazonaws.com:8000/charity/profile/' + vm.profile.name,
                    // picture: 'https://s23.postimg.org/mj3shxr97/Charity_Icon.jpg',
                    picture: 'http://ec2-54-194-73-253.eu-west-1.compute.amazonaws.com:8000' + vm.profile.profile_image,
                    caption: 'Welcome to our charity'
                });
        }
    }
})();