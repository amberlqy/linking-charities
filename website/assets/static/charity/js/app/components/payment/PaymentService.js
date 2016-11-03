
(function () {
    'use strict';

    angular
        .module('charity.payment.services')
        .factory('Payment', Payment);

    Payment.$inject = ['$http'];

    function Payment($http) {
        return {}
    }
})();