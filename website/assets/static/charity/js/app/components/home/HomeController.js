
(function () {
    'use strict';

    angular
        .module('charity.home.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', 'topRatePrepService', 'topDonatePrepService'];

    function IndexController($scope, topRatePrepService, topDonatePrepService) {
        var vm = this;
        vm.charity = {};

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

            var topRateResult = topRatePrepService.data.charity_profiles;
            var topDonateResult = topDonatePrepService.data.charity_profiles;
            // Has charity
            if (topRateResult.length > 0) {
                var topRateCharity = topRateResult[0];
                var topDonateCharity = topDonateResult[0];
                // Random charity
                var min = 0;
                var max = topRateResult.length - 1;
                var firstIndex = Math.floor(Math.random() * (max - min + 1) + min);
                var secondIndex = Math.floor(Math.random() * (max - min + 1) + min);
                while (secondIndex == firstIndex && topRateResult.length > 1) {
                    secondIndex = Math.floor(Math.random() * (max - min + 1) + min);
                }
                var firstRandomCharity = topRateResult[firstIndex];
                var secondRandomCharity = topRateResult[secondIndex];

                vm.charity.topRateCharity = topRateCharity;
                vm.charity.topDonateCharity = topDonateCharity;
                vm.charity.firstRandomCharity = firstRandomCharity;
                vm.charity.secondRandomCharity = secondRandomCharity;
            }
        }
    }
})();