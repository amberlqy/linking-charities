
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileSettingsController', ProfileSettingsController);

    ProfileSettingsController.$inject = [
        '$location', 'Profile', '$routeParams'
    ];

    function ProfileSettingsController($location, Profile, $routeParams) {
        var vm = this;
        vm.setting = {};

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

            // Get activity data
            setSetting();

            // GET setting info (Only Paypal Info)
            function setSetting() {
                vm.name = $routeParams.name; // name of charity
                Profile.getSetting(vm.name).then(getSuccessFn, getErrorFn);

                function getSuccessFn(data, status, headers, config) {
                    var charitySetting = data.data;
                    vm.setting.paypal_email = charitySetting.paypal_email;
                    vm.setting.paypal_token = charitySetting.paypal_token;
                    vm.setting.tag = charitySetting.tags;
                }

                function getErrorFn(data, status, headers, config) {
                    console.error('Getting Search failed! ' + status);
                }
                // console.log(charitySetting);
                // if (charitySetting == undefined || charitySetting == null) {
                //     alert("Page Not Found. We could not find the page you requested.");
                //     $location.url('/home');
                //     return;
                // }
            }
        }

        // TODO: Add URL service for setting
        function update() {
            vm.setting.tag = angular.element('#tagsetting').val();

            Profile.setSetting(vm.setting).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {

            }

            function profileErrorFn(data, status, headers, config) {

            }
        }
    }
})();