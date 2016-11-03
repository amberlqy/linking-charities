
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileSettingsController', ProfileSettingsController);

    ProfileSettingsController.$inject = [
        '$location', 'Authentication', 'Profile', 'Snackbar'
    ];

    function ProfileSettingsController($location, Authentication, Profile, Snackbar) {
        var vm = this;
        vm.profile = {};

        vm.destroy = destroy;
        vm.update = update;

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
        }

        // TODO: outdated
        function destroy() {
            Profile.destroy(vm.profile).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                Authentication.unauthenticate();
                window.location = '/';

                Snackbar.show('Your account has been deleted.');
            }

            function profileErrorFn(data, status, headers, config) {
                console.log(data);
                console.log(headers);
                Snackbar.error(data.error);
            }
        }

        // TODO: outdated
        function update() {

            if (vm.profile.password === "" ){
                delete vm.profile.password;
            }

            Profile.update(vm.profile).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {
                Snackbar.show('Your profile has been updated.');
            }

            function profileErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
            }
        }
    }
})();