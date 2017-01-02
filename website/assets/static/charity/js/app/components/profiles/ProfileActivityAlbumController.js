
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileActivityAlbumController', ProfileActivityAlbumController);

    ProfileActivityAlbumController.$inject = ['$http', '$location', 'Payment', 'Profile', '$routeParams', '$scope'];

    function ProfileActivityAlbumController($http, $location, Payment, Profile, $routeParams, $scope) {
        var vm = this;
        vm.album = {};

        activate();

        function activate() {
            // initial value
            vm.isMatched = false;
            // Get activity data
            setAlbum();

            var user_role = Profile.getAuthenticatedAccount();
            if (user_role != undefined && user_role != null) {
                vm.isCharity = user_role.userRole == "charity";
                vm.isMatched = user_role.username == vm.name;
            }

            function setAlbum() {
                // var charityActivity = activityPrepService.data.charity_activities;
                // if (charityActivity == undefined || charityActivity == null) {
                //     alert("Page Not Found. We could not find the page you requested.");
                //     $location.url('/home');
                //     return;
                // }
                // vm.activity = charityActivity;

                vm.name = $routeParams.name; // name of charity
                vm.id = $routeParams.id; // id of activity
            }
        }
    }
})();