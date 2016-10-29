(function () {
    'use strict';

    angular
        .module('charity.charityprofile.controllers')
        .controller('CharityProfileController', CharityProfileController);

    CharityProfileController.$inject = ['$scope', '$http', '$location', '$anchorScroll'];

    function CharityProfileController($scope, $http, $location, $anchorScroll) {
        charityProfile();

        function charityProfile() {
            $http.get('/static/charity/resources/profile.json').success(
                function (response) {
                    $scope.profileJson = response;
                }
            );
           <!--tags-->
            $scope.gotoDescription = function () {
                $location.hash('description');
                $anchorScroll();
            };
            $scope.gotoFinancials = function () {
                $location.hash('financials');
                $anchorScroll();
            };

            $scope.gotoActivities = function () {
                $location.hash('activities');
                $anchorScroll();
            };

            $scope.gotoDocuments = function () {
                $location.hash('documents');
                $anchorScroll();
            };


        }
      <!--link to activities-->
        $scope.activityPage = function (name) {
            if (name == 'CharityOne') {
                $location.path('/charityprofile/activities/' + name);
            }
        };
        <!--get data about activities details-->
         $http.get('/static/charity/resources/charityprofileactivities.json').success(
                function (response) {
                    $scope.activityJson = response;
                }
            );


    }
})();