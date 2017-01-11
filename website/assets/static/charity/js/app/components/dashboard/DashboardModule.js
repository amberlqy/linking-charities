
(function () {
    'use strict';

    angular
        .module('charity.dashboard', [
            'charity.dashboard.controllers',
            'charity.dashboard.services'
        ]);

    angular
        .module('charity.dashboard.controllers', [
            'ngMaterial']);

    angular
        .module('charity.dashboard.services', []);
})();