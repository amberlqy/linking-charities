
(function () {
    'use strict';

    angular
        .module('charity.authentication.controllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', 'Authentication'];

    function RegisterController($location, Authentication) {

        var vm = this;
        vm.register = register;

        activate();

        function activate() {

            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                $location.url('/home');
            }
        }

        function register(role) {
            Authentication.register(vm.password, vm.username, vm.email, role);
        }
    }
})();