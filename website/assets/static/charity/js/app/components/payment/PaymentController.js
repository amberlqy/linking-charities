
(function () {
    'use strict';

    angular
        .module('charity.payment.controllers')
        .controller('PaymentController', PaymentController);

    PaymentController.$inject = ['$location', 'Payment', 'Snackbar', 'Home', '$routeParams'];

    function PaymentController($location, Payment, Snackbar, Home, $routeParams) {
        var vm = this;

        activate();

        function activate() {

            vm.verified = "Waiting...";

            vm.donation_amount = 100.00;
            vm.donation_currency = "USD";

            vm.donation_currency_options = {
              choices: ["USD", "GBP", "JPY"],
              selected: "USD"
            };

            var charity_username = $routeParams.charity_username;

            // Check if we have any GET parameters
            var queryParameters = $location.search();
            if (typeof queryParameters.tx !== "undefined" && typeof charity_username !== "undefined"){
                Payment.getPaymentVerification(queryParameters.tx, charity_username).then(registerSuccessFn, registerErrorFn);
            }

            function registerSuccessFn(data, status, headers, config) {
                var response = data.data;
                console.log(response);

                vm.verified = "Verified!";
            }

            function registerErrorFn(data, status, headers, config) {
                console.error('Payment confirmation failed! ' + status);

                vm.verified = "Bad payment!";
            }
        }
    }
})();