
(function () {
    'use strict';

    angular
        .module('charity.payment.services')
        .factory('Payment', Payment);

    Payment.$inject = ['$http', '$cookies'];

    function Payment($http, $cookies) {
        var _donateKey = "";
        return {
            getPaymentVerification: getPaymentVerification,
            getCharity: getCharityInfo,
            volunteer: beVolunteer
        };

        function getPaymentVerification(transactionId, charity_username) {
            return $http.post('/api/charity/payment_confirmation/' + charity_username + '/',
                {transaction_id: transactionId});
        }

        // TODO : temporary get charity all info
        // Need URL that return only all activities in the charity, paypal email, paypal token
        function getCharityInfo(charityName) {
            return $http.get('/api/charity/get_charity/', {params: {"name": charityName}});
        }

        // Save volunteer data
        function beVolunteer(volunteer) {
            return $http.post('Change URL Here', volunteer);
        }
    }
})();