
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileSettingsController', ProfileSettingsController);

    ProfileSettingsController.$inject = [
        'Profile', '$routeParams'
    ];

    function ProfileSettingsController(Profile, $routeParams) {
        var vm = this;
        vm.setting = {};

        vm.update = update;

        activate();

        function activate() {
            // initial value
            vm.isMatched = false;
            // Get activity data
            setSetting();

            var user_role = Profile.getAuthenticatedAccount();
            if (user_role != undefined && user_role != null) {
                vm.isCharity = user_role.userRole == "charity";
                vm.isMatched = user_role.username == vm.name;
            }

            // TODO: GET request for receive setting info (Only Paypal Info)
            function setSetting() {
                vm.name = $routeParams.name; // name of charity
                var charitySetting; //= Profile.getSetting(vm.name).then ....;
                // console.log(charitySetting);
                // if (charitySetting == undefined || charitySetting == null) {
                //     alert("Page Not Found. We could not find the page you requested.");
                //     $location.url('/home');
                //     return;
                // }

                vm.setting.paypal_email = ""; // charitySetting.paypal_email;
                vm.setting.paypal_token = ""; // charitySetting.paypal_token
                vm.setting.tag = "child,parent";
            }
        }

        // TODO: Add URL service for setting
        function update() {
            vm.setting.tag = angular.element('#tagsetting').val();
            console.log(vm.setting);

            // Profile.someFunctionInService(vm.setting).then(profileSuccessFn, profileErrorFn);

            function profileSuccessFn(data, status, headers, config) {

            }

            function profileErrorFn(data, status, headers, config) {

            }
        }
    }
})();