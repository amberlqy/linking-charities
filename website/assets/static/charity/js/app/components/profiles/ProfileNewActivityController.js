
(function () {
    'use strict';

    angular
        .module('charity.profiles.controllers')
        .controller('ProfileNewActivityController', ProfileNewActivityController);

    ProfileNewActivityController.$inject = ['$http', '$location', 'Profile', '$filter', '$scope', '$routeParams'];

    function ProfileNewActivityController($http, $location, Profile, $filter, $scope, $routeParams) {
        var vm = this;
        vm.activity = {};
        vm.isDisabled = false;

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
        }

        $scope.files = [];

        // listen for the file selected event which is raised from directive
        $scope.$on("seletedFile", function (event, args) {
            $scope.$apply(function () {
                //add the file object to the scope's files collection
                $scope.files.push(args.file);
            });
        });

        // save new activity
        vm.saveActivity = function () {
            vm.isDisabled = true;
            var date = $filter('date')(vm.activity.date, "yyyyMMdd");
            var activity = {
                "name": vm.activity.name,
                "description": vm.activity.description,
                "date": date
            };

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
            }).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                $location.url('/profile/' + vm.name + '/activities');
            }

            function getErrorFn(data, status, headers, config) {
                vm.isDisabled = false;
                console.error('Getting Search failed! ' + status);
            }
        };
    }
})();