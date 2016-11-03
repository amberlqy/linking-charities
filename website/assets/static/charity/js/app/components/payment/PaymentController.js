
(function () {
    'use strict';

    angular
        .module('charity.payment.controllers')
        .controller('PaymentController', PaymentController);

    PaymentController.$inject = ['$location', 'Authentication', 'Snackbar', 'Home'];

    function PaymentController($location, Authentication, Snackbar, Home) {
        var vm = this;

        activate();

        function activate() {

            vm.donation_amount = 100.00;
            vm.donation_currency = "USD";

            vm.donation_currency_options = {
              choices: ["USD", "GBP", "JPY"],
              selected: "USD"
            }
        }
    }
})();