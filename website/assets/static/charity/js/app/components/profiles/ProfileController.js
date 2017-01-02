
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', 'Profile', '$scope', 'profilePrepService', 'ratingPrepService', '$http'];

    function ProfileController($location, Profile, $scope, profilePrepService, ratingPrepService, $http) {
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
                console.log(ratingPrepService.data);
                if (rateInfo != undefined && rateInfo != null) {
                    vm.profile.rate = rateInfo.average_rate == null ? 0 : rateInfo.average_rate;
                    vm.profile.total_users = rateInfo.total_users;
                    vm.profile.userRate = rateInfo.rate_by_user;
                } else {
                    vm.profile.rate = "0";
                    vm.profile.total_users = "0";
                    vm.profile.userRate = "0";
                }
                // $http.get('/api/charity/charity_rating_aggregates/', {params: {"charity_name": vm.profile.name}}).then(getSuccessFn, getErrorFn);
                //
                // function getSuccessFn(data, status, headers, config) {
                //     var rate = data.data;
                //     vm.profile.rate = rate.average_rate == null ? 0 : rate.average_rate;
                //     vm.profile.total_users = rate.total_users;
                //     vm.profile.userRate = rate.rate_by_user;
                // }
                //
                // function getErrorFn(data, status, headers, config) {
                //     console.error('Getting Search failed! ' + status);
                // }
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
                    vm.profile.rate = updateRating.average_rate == null ? 0 : updateRating.average_rate;
                    vm.profile.total_users = updateRating.total_users;
                });
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Getting Search failed! ' + status);
            }
        }

        // TODO : Set donateKey and send to payment controller
        vm.donate = function(){
            var donateKey = {name: vm.profile.name,
                              paypal_email: null,
                              paypal_token: null // etc.
                            };
            $location.url('/payment');
        }
    }
})();