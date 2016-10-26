
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$location', '$routeParams', 'Profile', 'Snackbar'];

    function ProfileController($scope, $location, $routeParams, Profile) {
        var vm = this;
        vm.isCharity = true;
        vm.profile = {};

        activate();

        function activate() {

            var user_role = Profile.getAuthenticatedAccount().userRole;
            console.log("User role: " + user_role);
            vm.isCharity = user_role == "charity";

            // Get current charity profile data
            Profile.getCurrent().then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                console.log(data);
                var charity_profile = data.data["charity_profile"];
                vm.profile.name = charity_profile["charity_name"];
                vm.profile.location = charity_profile["location"];
                vm.profile.description = charity_profile["description"];
                vm.profile.address = charity_profile["address"];
                vm.profile.phone_number = charity_profile["phone_number"];
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Getting current profile failed! ' + status);
            }
        }

        // Called when the user clicks on Update profile
        vm.update = function(){
            var profile = {
                "charity_name": vm.profile.name,
                "location": vm.profile.location,
                "description": vm.profile.description,
                "address": vm.profile.address,
                "phone_number": vm.profile.phone_number
            };
            Profile.update(profile);
        }
    }
})();