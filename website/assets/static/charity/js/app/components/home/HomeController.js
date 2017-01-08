
(function () {
    'use strict';

    angular
        .module('charity.home.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', 'searchPrepService'];

    function IndexController($scope, searchPrepService) {
        var vm = this;

        activate();

        function activate() {
            $scope.myInterval = 3000;
            $scope.slides = [
                {
                    image: '/static/charity/images/banner1.jpg'
                },
                {
                    image: '/static/charity/images/banner2.jpg'
                },
                {
                    image: '/static/charity/images/banner3.jpg'
                }
            ];

            var searchResult = searchPrepService.data.charity_profiles;
            console.log(searchResult);
        }
    }
})();