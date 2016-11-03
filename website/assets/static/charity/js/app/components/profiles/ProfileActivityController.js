
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileActivityController', ProfileActivityController);

    ProfileActivityController.$inject = ['$http', '$location', 'Authentication', 'Profile'];

    function ProfileActivityController($http, $location, Authentication, Profile) {
        var vm = this;
        vm.isCharity = true;
        vm.activity = {};

        vm.timelineHtmlPart1 = "<div class='cd-timeline-block'><div class='cd-timeline-img cd-picture'>"
            + "<img src='/static/charity/css/profilecss/cd-icon-picture.svg' alt='Picture'></div>"
            + "<div class='cd-timeline-content'><h2>";

        vm.timelineHtmlPart2 = "</h2><p>Content</p>"
            + "<a href='#0' class='cd-read-more'>{{index}}</a><span class='cd-date'>Jan 14</span></div></div>";

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
            console.log("User role: " + user_role);
            vm.isCharity = user_role == "charity";

            $http.get('/static/charity/resources/profileActivity.json').success(
                function (response) {
                    vm.activityResults = response;
                    // vm.searchResults.splice(vm.myData.indexOf(row), 1);
                });


            // Get current charity profile data
            // return $http.get('/api/charity/activity/').then(getSuccessFn, getErrorFn);
            //
            // function getSuccessFn(data, status, headers, config) {
            //     var charity_profile = data.data["charity_activity"];
            //
            //     alert(charity_profile);
            //     // vm.profile.location = charity_profile["location"];
            //     // vm.profile.description = charity_profile["description"];
            //     // vm.profile.address = charity_profile["address"];
            //     // vm.profile.phone_number = charity_profile["phone_number"];
            // }
            //
            // function getErrorFn(data, status, headers, config) {
            //     console.error('Getting current profile failed! ' + status);
            // }
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