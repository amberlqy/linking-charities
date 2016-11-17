(function () {
    'use strict';

    angular
        .module('charity.preview.controllers')
        .controller('PreviewProfileController', PreviewProfileController);

    PreviewProfileController.$inject = ['$scope', '$http','$modal'];

    function PreviewProfileController($scope, $http,$modal) {

        <!--get data about activities details-->
        $http.get('/static/charity/resources/profile.json').success(
            function (response) {
                $scope.activityJson = response;
            }
        );
        // $scope.closemodal=function () {
        //     $modal.close();
        // }

    }
})();