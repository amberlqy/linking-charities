
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', 'Profile', '$scope', 'profilePrepService', 'ratingPrepService', '$http', 'activityPrepService'];

    function ProfileController($location, Profile, $scope, profilePrepService, ratingPrepService, $http, activityPrepService) {
        var vm = this;
        vm.profile = {};

        $scope.labels = ["Voluntary £", "Trading to raise funds £", "Investment £"];
        $scope.incomedata = [1234 , 201, 100];
        $scope.spendingdata = [265, 1200, 8];

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
                console.log(charity_profile);
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
                if (charityActivity != undefined && charityActivity != null) {
                    if (charityActivity.length > 0) {
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

        // Called when the user clicks on Update profile
        vm.update = function(){
            var profile = {
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
            Profile.update(profile);
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
                console.error('Getting Search failed! ' + status);
            }
        }
    }
})();