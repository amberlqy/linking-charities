
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

        // Playground for upload image
        var imageService = Profile.uploadActivityPicture();
        // It will be because we don't have any stored picture.
        // TO DO : Check if there is no stored picture
        $scope.images = imageService.query();
        $scope.newImage = {};

        // Upload an Image on Button Press
        $scope.uploadImage = function() {
            console.log('start upload');
            // call REST API endpoint
            imageService.save($scope.newImage).$promise.then(
                function(response) {
                    // the response is a valid image, put it at the front of the images array
                    $scope.images.unshift(response);
                },
                function(rejection) {
                    console.log('Failed to upload image');
                    console.log(rejection);
                }
            );
        };

        /**
         * Delete an image on Button Press
         */
        $scope.deleteImage = function(image) {
            // call REST API endpoint
            image.$delete(
                // process response of delete
                function(response) {
                    // success delete
                    console.log('Deleted it');
                    // update $scope.images
                    $scope.images = Images.query();
                },
                function(rejection) {
                    // failed to delete it
                    console.log('Failed to delete image');
                    console.log(rejection);
                }
            );
        };
    }
})();