
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileActivityAlbumController', ProfileActivityAlbumController);

    ProfileActivityAlbumController.$inject = ['$http', '$location', 'Payment', 'Profile', '$routeParams'];

    function ProfileActivityAlbumController($http, $location, Payment, Profile, $routeParams) {
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

        // TODO : Set donateKey and send to payment controller
        vm.donate = function(){
            var donateKey = {name: vm.name,
                              paypal_email: null,
                              paypal_token: null // etc.
                            };
            var donateInfo = Payment.donateInfo();
            donateInfo.setDonateInfo(donateKey);
            $location.path('/payment');
        }
    }
})();