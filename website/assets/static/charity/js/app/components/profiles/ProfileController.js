
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$location', '$routeParams', 'Profile', 'Snackbar'];

    function ProfileController($scope, $location, $routeParams, Profile, Snackbar) {
        var vm = this;
        vm.profile = undefined;

        activate();

        function activate() {

            var username = $routeParams.username;

            Profile.get(username).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                vm.profile = data.data;
            }

            function profileErrorFn(data, status, headers, config) {
                $location.url('/');
                Snackbar.error('That user does not exist.');
            }
        }

        vm.update = function(){
            var profile = {
                "charity_name": $scope.profile.name,
                "location": "",
                "goal": $scope.profile.description,
                "address": $scope.profile.address,
                "phone_number": $scope.profile.phonenumber
            };
            Profile.update(profile);
        }
    }
})();