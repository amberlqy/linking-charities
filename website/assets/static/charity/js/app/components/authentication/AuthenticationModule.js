
(function () {
    'use strict';

    angular
        .module('charity.authentication', [
            'charity.authentication.controllers',
            'charity.authentication.services'
        ]);

    angular
        .module('charity.authentication.controllers', []);

    angular
        .module('charity.authentication.services', ['ngCookies']);
})();