
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', 'Authentication', 'Profile', '$modal', '$scope', 'profilePrepService'];

    function ProfileController($location, Authentication, Profile, $modal, $scope, profilePrepService) {
        var vm = this;
        // vm.isCharity = true;
        vm.profile = {};

        $scope.labels = ["Voluntary £", "Trading to raise funds £", "Investment £"];
        $scope.incomedata = [1234 , 201, 100];
        $scope.spendingdata = [265, 1200, 8];

        activate();

        function activate() {
            // TODO : Use this path in Setting Controller
            // vm.isAuthenticated = Authentication.isAuthenticated();
            // var authenticatedAccount = Authentication.getAuthenticatedAccount();
            // if (!authenticatedAccount) {
            //     $location.url('/login');
            //     //Snackbar.error('You are not authorized to view this page.');
            // } else {
            //     if (authenticatedAccount != undefined){
            //         vm.user = authenticatedAccount.username;
            //     }
            // }

            // initial value
            vm.isMatched = false;
            // Get current charity profile data
            setProfile();

            var user_role = Profile.getAuthenticatedAccount();
            if (user_role != undefined && user_role != null) {
                vm.isCharity = user_role.userRole == "charity";
                vm.isMatched = user_role.username == vm.profile.name;
            }

            function setProfile() {
                var charity_profile = profilePrepService.data.charity_profile;
                console.log(charity_profile);
                if (charity_profile == undefined || charity_profile == null) {
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
        }

        // vm.preview = function(){
        //     var modalInstance = $modal.open({
        //         templateUrl: '/static/charity/js/app/components/preview/previewprofile.html',
        //          controller: 'PreviewProfileController',
        //         scope: $scope,
        //         size:'lg',
        //         resolve: {} // empty storage
        //     });
        // }

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
    }
})();