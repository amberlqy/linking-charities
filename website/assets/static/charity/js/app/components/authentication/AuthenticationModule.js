
(function () {
    'use strict';

    angular
        .module('charity.authentication', [
            'charity.authentication.controllers',
            'charity.authentication.services'
        ]);

    angular
        .module('charity.authentication.controllers', ['ngMaterial']);

    angular
        .module('charity.authentication.services', ['ngCookies']);
})();