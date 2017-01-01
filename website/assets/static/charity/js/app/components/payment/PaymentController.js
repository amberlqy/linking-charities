
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
            var donateInfo = Payment.donateInfo();
            console.log(donateInfo.getDonateInfo());
            // TODO: Set donateInfo
            // Ex. vm.name = donateInfo.name
            vm.paypal_email = "wuzifan0817-facilitator@gmail.com";
            vm.verified = "Waiting...";
            vm.donation_amount = 100.00;
            vm.donation_currency = "USD";

            vm.donation_currency_options = {
              choices: ["USD", "GBP", "JPY"],
              selected: "USD"
            };

            // Payment confirmation starts here
            // Read which charity the user has donated to: we can only read this from the URL
            var charity_username = $routeParams.charity_username;

            // Check if we have any GET parameters that were attached by PayPal
            var queryParameters = $location.search();
            if (typeof queryParameters.tx !== "undefined" && typeof charity_username !== "undefined"){
                Payment.getPaymentVerification(queryParameters.tx, charity_username).then(verificationSuccessFn, verificationErrorFn);
            }

            function verificationSuccessFn(data, status, headers, config) {
                var response = data.data;
                console.log(response);

                vm.verified = "Verified!";
            }

            function verificationErrorFn(data, status, headers, config) {
                console.error('Payment confirmation failed! ' + status);

                vm.verified = "Bad payment!";
            }
        }
    }
})();