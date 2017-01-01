
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileSettingsController', ProfileSettingsController);

    ProfileSettingsController.$inject = [
        '$location', 'Profile', '$routeParams', 'settingPrepService'
    ];

    function ProfileSettingsController($location, Profile, $routeParams, settingPrepService) {
        var vm = this;
        vm.setting = {};
        vm.isSaving = false;

        vm.update = update;

        activate();

        function activate() {
            vm.name = $routeParams.name; // name of charity

            var user_role = Profile.getAuthenticatedAccount();
            if (user_role != undefined && user_role != null) {
                if (user_role.userRole != "charity" || user_role.username != vm.name) {
                    alert('You do not have permission to access this page');
                    $location.url('/home');
                    return;
                }
            } else {
                alert('You do not have permission to access this page');
                $location.url('/home');
                return;
            }

            // Get setting data
            setSetting();

            // set setting info (Only Paypal Info)
            function setSetting() {
                var charity_setting = settingPrepService.data;
                if (charity_setting == undefined || charity_setting == null) {
                    alert("Page Not Found. We could not find the page you requested.");
                    $location.url('/home');
                    return;
                }
                vm.setting.paypal_email = charity_setting.paypal_email;
                vm.setting.paypal_token = charity_setting.paypal_token;
                vm.setting.tags = charity_setting.tags;
            }
        }

        // Update setting
        function update() {
            vm.isSaving = true;
            vm.setting.tags = angular.element('#tagsetting').val();
            Profile.setSetting(vm.setting).then(settingSuccessFn, settingErrorFn);

            function settingSuccessFn(data, status, headers, config) {
                vm.isSaving = false;
            }

            function settingErrorFn(data, status, headers, config) {
                vm.isSaving = false;
            }
        }
    }
})();