
(function () {
    'use strict';

    angular
        .module('charity.payment.controllers')
        .controller('PaymentController', PaymentController);

    PaymentController.$inject = ['$location', 'Payment', 'Snackbar', 'Home'];

    function PaymentController($location, Payment, Snackbar, Home) {
        var vm = this;

        activate();

        function activate() {

            vm.donation_amount = 100.00;
            vm.donation_currency = "USD";

            vm.donation_currency_options = {
              choices: ["USD", "GBP", "JPY"],
              selected: "USD"
            };

            // Check if we have any GET parameters
            var queryParameters = $location.search();
            if (typeof queryParameters.tx !== "undefined" && typeof queryParameters.sig !== "undefined"){
                Payment.getPaymentVerification(queryParameters.tx, queryParameters.sig);
            }

            vm.verifyPayment = function(){
                console.log("Verify Clicked");
                Payment.getPaymentVerification();

            }
        }
    }
})();