
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileActivityController', ProfileActivityController);

    ProfileActivityController.$inject = ['$http', '$location', 'Authentication', 'Profile', '$routeParams', 'activityPrepService'];

    function ProfileActivityController($http, $location, Authentication, Profile, $routeParams, activityPrepService) {
        var vm = this;
        vm.isCharity = true;
        vm.activity = {};

        activate();

        function activate() {
            // initial value
            vm.isMatched = false;
            // Get activity data
            setActivity();

            var user_role = Profile.getAuthenticatedAccount();
            if (user_role != undefined && user_role != null) {
                vm.isCharity = user_role.userRole == "charity";
                vm.isMatched = user_role.username == vm.name;
            }

            function setActivity() {
                var charityActivity = activityPrepService.data.charity_activities;
                console.log(charityActivity);
                if (charityActivity == undefined || charityActivity == null) {
                    alert("Page Not Found. We could not find the page you requested.");
                    $location.url('/home');
                    return;
                }
                vm.activity = charityActivity;

                vm.name = $routeParams.name; // name of charity
            }
        }

        // Called when the user clicks on Update profile
        // TODO After save success direct to activities page
        vm.update = function(){
            // TODO Next phase can delete activity
            // return $http.post('/api/charity/activity/', activity).then(updateSuccessFn, updateErrorFn);
            //
            // function updateSuccessFn(data, status, headers, config) {
            //     alert('Finish');
            //     console.log('Update successful!');
            // }
            //
            // function updateErrorFn(data, status, headers, config) {
            //     alert('Fail');
            //     console.error('Update failed!' + status);
            // }
        }
    }
})();