
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', 'Authentication', 'Profile', '$modal','$scope'];

    function ProfileController($location, Authentication, Profile, $modal,$scope) {
        var vm = this;
        vm.isCharity = true;
        vm.profile = {};

        activate();

        function activate() {
            // TODO Check if login and correct user login
            vm.isAuthenticated = Authentication.isAuthenticated();
            var authenticatedAccount = Authentication.getAuthenticatedAccount();
            if (!authenticatedAccount) {
                $location.url('/login');
                //Snackbar.error('You are not authorized to view this page.');
            } else {
                if (authenticatedAccount != undefined){
                    vm.user = authenticatedAccount.username;
                }
            }

            var user_role = Profile.getAuthenticatedAccount().userRole;
            console.log("User role: " + user_role);
            vm.isCharity = user_role == "charity";

            // Get current charity profile data
            Profile.getCurrent().then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                console.log(data);
                var charity_profile = data.data["charity_profile"];
                vm.profile.name = charity_profile["charity_name"];
                vm.profile.goal = charity_profile["goal"];
                vm.profile.description = charity_profile["description"];
                vm.profile.address = charity_profile["address"];
                vm.profile.city = charity_profile["city"];
                vm.profile.country = charity_profile["country"];
                vm.profile.postcode = charity_profile["postcode"];
                vm.profile.phone_number = charity_profile["phone_number"];
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Getting current profile failed! ' + status);
            }
        }

        vm.preview = function(){
            var modalInstance = $modal.open({
                templateUrl: '/static/charity/js/app/components/preview/previewprofile.html',
                 controller: 'PreviewProfileController',
                scope: $scope,
                size:'lg',
                resolve: {} // empty storage
            });
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
                "email": null,
                "phone_number": vm.profile.phone_number
            };
            Profile.update(profile);
        }
    }
})();