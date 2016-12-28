
(function () {
    'use strict';

    angular
        .module('charity.payment.services')
        .factory('Payment', Payment);

    Payment.$inject = ['$http'];

    function Payment($http) {
        var _donateKey = "";
        return {
            getPaymentVerification: getPaymentVerification,
            donateInfo: donateInfo
        };

        function getPaymentVerification(transactionId, charity_username) {
            return $http.post('/api/charity/payment_confirmation/' + charity_username + '/',
                {transaction_id: transactionId});
        }

        function donateInfo() {
            return {
                getDonateInfo: function () {
                    return _donateKey;
                },
                setDonateInfo: function(donateObj) {
                    _donateKey = donateObj;
                }
            };
        }
    }
})();