(function () {
    'use strict';

    angular
        .module('charity.charityprofile.controllers')
        .controller('CharityProfileController', CharityProfileController);

    CharityProfileController.$inject = ['$scope', '$http', '$location', '$anchorScroll', 'CharityProfile'];

    function CharityProfileController($scope, $http, $location, $anchorScroll, CharityProfile) {
        charityProfile();

        function charityProfile() {
            $http.get('/api/charity/charity_search/', {params:{"id": CharityProfile.getCharityId()}}).then(getSuccessFn, getErrorFn);

            function getSuccessFn(data, status, headers, config) {
                var charityProfile = data.data["charity_profile"];
                console.log(charityProfile);
                $scope.profile = charityProfile;
            }

            function getErrorFn(data, status, headers, config) {
                console.error('Getting Charity Profile failed! ' + status);
            }

            <!--tags-->
            $scope.gotoDescription = function () {
                $location.hash('description');
                $anchorScroll(shouldAnimate,true);

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
            if (name == 'charitytest') {
                $location.path('/charityprofile/activities/' + charitytest);
            }
        };
        <!--get data about activities details-->
         $http.get('/static/charity/resources/charityprofileactivities.json').success(
                function (response) {
                    $scope.activityJson = response;
                }
            );
               <!--get data about document details-->
         $http.get('/static/charity/resources/charityprofiledocument.json').success(
                function (response) {
                    $scope.documentJson = response;
                }
            );


    }
})();