
(function () {
    'use strict';

    angular
        .module('charity.navbar.directives')
        .directive('navbar', navbar);

    function navbar() {

        return {
            controller: 'NavbarController',
            controllerAs: 'vm',
            restrict: 'E',
            scope: {
                posts: '='
            },
            templateUrl: '/static/charity/js/app/components/navbar/navbar.html'
        };
    }
})();