
(function () {
    'use strict';

    angular
        .module('charity.charityprofile.controllers')
        .controller('CharityProfileController', CharityProfileController);

    CharityProfileController.$inject = ['$scope', '$http'];

    function CharityProfileController($scope, $http) {
        charityProfile();

        function charityProfile() {
            $http.get('/static/charity/resources/profile.json').success(
                function (response) {
                    $scope.profileJson = response;
                }
            );
        }
    }
})();