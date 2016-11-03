
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileNewActivityController', ProfileNewActivityController);

    ProfileNewActivityController.$inject = ['$http', '$location', 'Authentication', 'Profile'];

    function ProfileNewActivityController($http, $location, Authentication, Profile) {
        var vm = this;
        vm.isCharity = true;
        vm.activity = {};

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
            vm.isCharity = user_role == "charity";
        }

        // Called when the user clicks on Update profile
        // TODO After save success direct to activities page
        vm.update = function(){
            console.log(vm.activity.picture);
            var activity = {
                "name": vm.activity.name,
                "description": vm.activity.detail,
                "start_time": vm.activity.date,
                "end_time": null,
                "image": vm.activity.picture
            };

            return $http.post('/api/charity/activity/', activity).then(updateSuccessFn, updateErrorFn);

            function updateSuccessFn(data, status, headers, config) {
                console.log('Update successful!');
            }

            function updateErrorFn(data, status, headers, config) {
                console.error('Update failed!' + status);
            }
        }
    }
})();