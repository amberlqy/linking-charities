
(function () {
    'use strict';

    angular
        .module('charity.home.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$location', 'Authentication', 'Snackbar', 'Home', '$scope'];

    function IndexController($location, Authentication, Snackbar, Home, $scope) {
        var vm = this;

        activate();

        function activate() {
            $scope.myInterval = 3000;
            $scope.slides = [
                {
                    image: '/static/charity/images/homepage.jpg'
                },
                {
                    image: '/static/charity/images/homepage.jpg'
                },
                {
                    image: '/static/charity/images/homepage.jpg'
                }
            ];

            // vm.isAuthenticated = Authentication.isAuthenticated();
            // var authenticatedAccount = Authentication.getAuthenticatedAccount();
            //
            // // Redirect if not logged in
            // if (!authenticatedAccount) {
            //     $location.url('/login');
            //     //Snackbar.error('You are not authorized to view this page.');
            // }
        }
    }
})();