
(function () {
    'use strict';

    angular
        .module('charity.home', [
            'charity.home.controllers',
            'charity.home.services'
        ]);

    angular
        .module('charity.home.controllers', ['ngRoute', 'ui.bootstrap']);

    angular
        .module('charity.home.services', []);
})();