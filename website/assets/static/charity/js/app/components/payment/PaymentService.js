
(function () {
    'use strict';

    angular
        .module('charity.payment.services')
        .factory('Payment', Payment);

    Payment.$inject = ['$http'];

    function Payment($http) {
        var Payment = {
            getPaymentVerification: getPaymentVerification
        };

        return Payment;

        function getPaymentVerification(transactionId, identityToken) {
            return $http.post('/api/charity/payment_confirmation/',
                {transaction_id: transactionId,
                    identity_token: identityToken}).then(registerSuccessFn, registerErrorFn);

            function registerSuccessFn(data, status, headers, config) {
                var response = data.data;
                console.log(response);
            }

            function registerErrorFn(data, status, headers, config) {
                console.error('Registration failed! ' + status);
            }
        }
    }
})();