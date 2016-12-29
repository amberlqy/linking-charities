
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', 'Authentication', 'Profile', '$modal', '$scope', 'profilePrepService', 'Payment', '$http'];

    function ProfileController($location, Authentication, Profile, $modal, $scope, profilePrepService, Payment, $http) {
        var vm = this;
        // vm.isCharity = true;
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

            // TODO: Temporary GET function (Will move to service after test)
            function getRating() {
                $http.get('/api/charity/charity_rating_aggregates/', {params: {"charity_name": vm.profile.name}}).then(getSuccessFn, getErrorFn);

                function getSuccessFn(data, status, headers, config) {
                    var rate = data.data;
                    console.log(rate.average_rate);
                    console.log(rate.total_users);
                    console.log(rate.rate_by_user);
                    vm.profile.rate = rate.rate_by_user == null ? 0 : rate.rate_by_user;
                    vm.profile.total_users = rate.total_users;
                    vm.profile.userRate = rate.rate_by_user;
                }

                function getErrorFn(data, status, headers, config) {
                    console.error('Getting Search failed! ' + status);
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

        // TODO : Set donateKey and send to payment controller
        vm.donate = function(){
            var donateKey = {name: "TEST NAME",
                              paypal_email: null,
                              paypal_token: null // etc.
                            };
            var donateInfo = Payment.donateInfo();
            donateInfo.setDonateInfo(donateKey);
            $location.path('/payment');
        }

        // TODO: Temporary POST function (Will move to service after test)
        vm.rateChange = function(){
            // alert(angular.element('#rateCharity').val());
            var rate = angular.element('#rateCharity').val() + '.0';
            var setRate = {
                "charity_name": vm.profile.name,
                "rate_by_user": rate
            };
            $http.post('/api/charity/charity_rating/', setRate);
        }
    }
})();