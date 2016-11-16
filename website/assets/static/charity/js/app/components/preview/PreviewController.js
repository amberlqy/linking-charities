(function () {
    'use strict';

    angular
        .module('charity.preview.controllers')
        .controller('PreviewProfileController', PreviewProfileController);

    PreviewProfileController.$inject = ['$scope', '$http'];

    function PreviewProfileController($scope, $http) {
        <!--get data about activities details-->
        $http.get('/static/charity/resources/profile.json').success(
            function (response) {
                $scope.activityJson = response;
            }
        );

    }
})();