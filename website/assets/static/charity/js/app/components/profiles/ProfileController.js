
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$location', '$routeParams', 'Profile', 'Snackbar'];

    function ProfileController($scope, $location, $routeParams, Profile, Snackbar) {
        var vm = this;
        vm.user = undefined;
        vm.profile = {};

        activate();

        function activate() {

            var username = $routeParams.username;

            Profile.get(username).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                vm.user = data.data;
            }

            function profileErrorFn(data, status, headers, config) {
                $location.url('/');
                Snackbar.error('That user does not exist.');
            }
        }

        // Called when the user clicks on Update profile
        vm.update = function(){
            var profile = {
                "charity_name": vm.profile.name,
                "location": vm.profile.address,
                "goal": vm.profile.description,
                "address": vm.profile.address,
                "phone_number": vm.profile.phone_number
            };
            Profile.update(profile);
        }
    }
})();