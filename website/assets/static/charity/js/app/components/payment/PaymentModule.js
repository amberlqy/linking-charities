
(function () {
    'use strict';

    angular
        .module('charity.payment', [
            'charity.payment.controllers',
            'charity.payment.services'
        ]);

    angular
        .module('charity.payment.controllers', ['ngRoute']);

    angular
        .module('charity.payment.services', ['ngCookies']);
})();
