
(function () {
    'use strict';

    angular
        .module('charity.payment.services')
        .factory('Payment', Payment);

    Payment.$inject = ['$http'];

    function Payment($http) {
        return {
            getPaymentVerification: getPaymentVerification
        };

        function getPaymentVerification(transactionId, charity_username) {
            return $http.post('/api/charity/payment_confirmation/' + charity_username + '/',
                {transaction_id: transactionId});
        }
    }
})();