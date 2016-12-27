
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileNewActivityController', ProfileNewActivityController);

    ProfileNewActivityController.$inject = ['$http', '$location', 'Authentication', 'Profile', '$filter', '$scope'];

    function ProfileNewActivityController($http, $location, Authentication, Profile, $filter, $scope) {
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
            var date = $filter('date')(vm.activity.date, "yyyyMMdd");
            var activity = {
                "name": vm.activity.name,
                "description": vm.activity.detail,
                "date": date,
                "image": vm.activity.picture
            };

            console.log(vm.activity.picture);

            return $http.post('/api/charity/activity/', activity).then(updateSuccessFn, updateErrorFn);

            function updateSuccessFn(data, status, headers, config) {
                console.log('Update successful!');
            }

            function updateErrorFn(data, status, headers, config) {
                console.error('Update failed!' + status);
            }
        }



        // Try to send image with JSON
        //1. Used to list all selected files
        $scope.files = [];

        //3. listen for the file selected event which is raised from directive
        $scope.$on("seletedFile", function (event, args) {
            $scope.$apply(function () {
                //add the file object to the scope's files collection
                $scope.files.push(args.file);
            });
        });

        //4. Post data and selected files.
        $scope.saveActivity = function () {
            var date = $filter('date')(vm.activity.date, "yyyyMMdd");
            var activity = {
                "name": vm.activity.name,
                "description": vm.activity.detail,
                "date": date,
                "image": null
            };
            console.log(activity);

            $http({
                method: 'POST',
                url: "/api/charity/activity/",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("model", angular.toJson(data.model));
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i]);
                    }
                    return formData;
                },
                data: { model: activity, files: $scope.files }
            })
        };
    }
})();