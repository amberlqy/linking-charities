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

        $scope.urlLink = function getImageSrc() {
            $http.get('').success(
                function (response) {
                    $scope.urlLink = response;
                }
            );
        }


    }
})();